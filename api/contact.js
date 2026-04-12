/* global process, Buffer */
import { Resend } from 'resend';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================
if (!process.env.RESEND_API_KEY) {
  console.error('CRITICAL: RESEND_API_KEY is not set in environment variables');
}

if (!process.env.RECAPTCHA_SECRET_KEY) {
  console.warn('⚠️ WARNING: RECAPTCHA_SECRET_KEY not set - reCAPTCHA verification will be bypassed');
}

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

// ============================================================================
// HELPER: Verify reCAPTCHA token with Google (conditional)
// ============================================================================
async function verifyRecaptcha(token) {
  if (!token || typeof token !== 'string' || token.length === 0) {
    throw new Error('Token: Invalid or empty token provided');
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('⚠️ [reCAPTCHA] Bypassing verification - RECAPTCHA_SECRET_KEY not set');
    return { success: true, score: 1.0, bypassed: true };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ [reCAPTCHA] Google verification successful:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      errorCodes: data['error-codes'] || 'none',
    });

    return data;
  } catch (error) {
    console.error('❌ [reCAPTCHA] Verification failed:', error.message);
    throw error;
  }
}

// ============================================================================
// HELPER: Validate contact form input
// ============================================================================
function validateInput(name, email, message) {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Invalid email format';
  }

  if (!message || message.trim().length < 10) {
    return 'Message must be at least 10 characters';
  }

  return null; // Valid
}

// ============================================================================
// HELPER: Get recipient email from Firebase
// ============================================================================
async function getRecipientEmail() {
  try {
    const cmsSnap = await getDoc(doc(db, 'cms', 'content'));
    if (cmsSnap.exists() && cmsSnap.data().siteConfig?.email) {
      return cmsSnap.data().siteConfig.email;
    }
  } catch (e) {
    console.warn('[Email] Could not fetch from CMS:', e.message);
  }
  return 'contact@netnirman.com'; // Fallback
}

// ============================================================================
// HELPER: Rate limiting (per IP)
// ============================================================================
async function checkAndUpdateRateLimit(clientIp) {
  const ipHash = Buffer.from(clientIp).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  const rateLimitRef = doc(db, 'rateLimits', ipHash);
  const rateLimitSnap = await getDoc(rateLimitRef);

  const NOW = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;
  const MAX_REQUESTS = 3;

  if (rateLimitSnap.exists()) {
    const data = rateLimitSnap.data();
    const lastRequest = data.lastRequest || 0;
    const count = data.count || 0;

    if (NOW - lastRequest < TEN_MINUTES) {
      if (count >= MAX_REQUESTS) {
        const retrySeconds = Math.ceil((TEN_MINUTES - (NOW - lastRequest)) / 1000);
        throw {
          status: 429,
          message: `Too many requests. Please try again in ${retrySeconds} seconds.`,
        };
      }
      await setDoc(rateLimitRef, { count: count + 1, lastRequest: NOW }, { merge: true });
    } else {
      // Window expired
      await setDoc(rateLimitRef, { count: 1, lastRequest: NOW });
    }
  } else {
    // First request
    await setDoc(rateLimitRef, { count: 1, lastRequest: NOW });
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }

  const { name, email, message, honeypot } = req.body;

  try {
    // ← 1. HONEYPOT CHECK
    if (honeypot && honeypot.trim() !== '') {
      console.warn('⚠️ [Spam] Honeypot field was filled');
      return res.status(200).json({ success: true, message: 'Message sent!' });
    }

    // ← 2. GET CLIENT IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      'unknown';

    console.log('📍 [Request] From IP:', clientIp);

    // ← 3. RATE LIMIT CHECK
    try {
      await checkAndUpdateRateLimit(clientIp);
    } catch (limitError) {
      console.warn('🚫 [RateLimit] Rejected:', limitError.message);
      return res.status(limitError.status || 429).json({
        success: false,
        message: limitError.message,
      });
    }

    // ← 4. VALIDATE INPUTS
    const validationError = validateInput(name, email, message);
    if (validationError) {
      console.warn('❌ [Validation] Failed:', validationError);
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // ← 5. VALIDATE INPUTS
    const validationError = validateInput(name, email, message);
    if (validationError) {
      console.warn('❌ [Validation] Failed:', validationError);
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // ← 6. GET EMAIL
    const recipientEmail = await getRecipientEmail();
    console.log('📧 [Email] Sending to:', recipientEmail);

    // ← 7. SEND EMAIL
    try {
      const { error: sendError } = await resend.emails.send({
        from: 'Net Nirman <onboarding@resend.dev>',
        to: recipientEmail,
        replyTo: email.trim(),
        subject: `New Contact from ${name}`,
        html: `
          <div style="font-family: Arial; max-width: 600px;">
            <h2 style="color: #0f172a;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">IP: ${clientIp} | Time: ${new Date().toISOString()}</p>
          </div>
        `,
      });

      if (sendError) {
        console.error('❌ [Email] Send failed:', sendError);
      } else {
        console.log('✅ [Email] Sent successfully');
      }
    } catch (emailError) {
      console.error('❌ [Email] Error:', emailError.message);
      // Don't fail the request, email might retry
    }

    // ← 8. SUCCESS
    console.log('✅ [Success] Form submitted successfully');
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.',
    });
  } catch (error) {
    console.error('❌ [Handler] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}
