/* global process, Buffer */
import { Resend } from 'resend';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message, honeypot, recaptchaToken } = req.body;

  // 1. Honeypot check (hidden field)
  if (honeypot) {
    return res.status(400).json({ message: 'Bot detected by honeypot.' });
  }

  // 2. Input validation
  if (!name || !email || !message || !recaptchaToken) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (name.length < 2 || message.length < 10) {
    return res.status(400).json({ message: 'Name or message too short.' });
  }

  // 3. reCAPTCHA verification
  let recaptchaScore = 0;
  try {
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      }),
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
    }

    recaptchaScore = recaptchaData.score;
    if (recaptchaScore < 0.5) {
      return res.status(400).json({ message: 'Suspicious activity detected. Please try again.' });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({ message: 'Verification service unavailable.' });
  }

  // 4. Rate limiting / Cooldown via IP (Firebase)
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const ipHash = Buffer.from(clientIp).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  
  const rateLimitRef = doc(db, 'rateLimits', ipHash);
  const rateLimitSnap = await getDoc(rateLimitRef);

  const NOW = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  if (rateLimitSnap.exists()) {
    const data = rateLimitSnap.data();
    const lastRequest = data.lastRequest;
    const count = data.count || 0;

    if (NOW - lastRequest < TEN_MINUTES) {
      if (count >= 3) {
        return res.status(429).json({ message: 'You are sending messages too fast. Please wait 10 minutes.' });
      }
      await setDoc(rateLimitRef, { count: count + 1, lastRequest: NOW }, { merge: true });
    } else {
      // Reset after 10 min
      await setDoc(rateLimitRef, { count: 1, lastRequest: NOW });
    }
  } else {
    await setDoc(rateLimitRef, { count: 1, lastRequest: NOW });
  }

  // 5. Get recipient email from CMS
  let recipientEmail = 'your-email@gmail.com';
  try {
    const cmsSnap = await getDoc(doc(db, 'cms', 'content'));
    if (cmsSnap.exists() && cmsSnap.data().siteConfig?.email) {
      recipientEmail = cmsSnap.data().siteConfig.email;
    }
  } catch (e) {
    console.error('Failed to get CMS email:', e);
  }

  // 6. Send Email
  try {
    const { error } = await resend.emails.send({
      from: 'Net Nirman <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `New Lead from ${name} (Net Nirman)`,
      html: `
        <h2>New Website Contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <p><small>IP: ${clientIp}</small></p>
        <p><small>reCAPTCHA Score: ${recaptchaScore}</small></p>
      `
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }

    return res.status(200).json({ message: 'Message sent successfully.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
