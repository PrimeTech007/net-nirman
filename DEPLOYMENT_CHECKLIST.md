# 🚀 DEPLOYMENT CHECKLIST - reCAPTCHA v3 FIX

## STEP 1: Google reCAPTCHA Console Setup (5 min)

- [ ] Go to: https://www.google.com/recaptcha/admin
- [ ] Login with your Google account
- [ ] Click **Create** to add new site
- [ ] Name: "Net Nirman Contact Form"
- [ ] Select reCAPTCHA type: **v3** (NOT v2!)
- [ ] Add domains:
  - [ ] localhost
  - [ ] 127.0.0.1
  - [ ] netnirman.com
  - [ ] www.netnirman.com
  - [ ] *.vercel.app
- [ ] Accept terms, click Submit
- [ ] Copy **Site Key**: `6LfG5NUn...` (public)
- [ ] Copy **Secret Key**: `6LfG5NUn...` (private)
- [ ] Store both securely

---

## STEP 2: Set Environment Variables in Vercel (5 min)

- [ ] Go to: https://vercel.com/dashboard
- [ ] Select your project
- [ ] Settings → Environment Variables
- [ ] Add new variable:
  - **Name:** `VITE_RECAPTCHA_SITE_KEY`
  - **Value:** (paste Site Key from Step 1)
  - **Click Add**
- [ ] Add another variable:
  - **Name:** `RECAPTCHA_SECRET_KEY`
  - **Value:** (paste Secret Key from Step 1)
  - **Click Add**
- [ ] Verify both variables appear in list

---

## STEP 3: Deploy Updated Code (5 min)

Option A: Git Push (Auto-Deploy)
```bash
cd d:\claude-dir
git add .
git commit -m "Fix: Complete reCAPTCHA v3 implementation"
git push
```
- [ ] Wait for Vercel to detect push
- [ ] Check Vercel dashboard - deployment in progress
- [ ] Wait for "✓ Ready" status

Option B: Manual Redeploy
- [ ] Go to Vercel Dashboard
- [ ] Click your project
- [ ] Click **Deployments** tab
- [ ] Click the three dots (...) on latest deployment
- [ ] Select **Redeploy**
- [ ] Wait for "✓ Ready"

---

## STEP 4: Verify Build Succeeded (2 min)

- [ ] Vercel shows "✓ Ready" 
- [ ] No "Failed" badge
- [ ] Check Function logs:
  - [ ] Go to Deployments → Functions
  - [ ] Click `/api/contact`
  - [ ] Should see recent calls

---

## STEP 5: Test Locally (5 min)

```bash
# In terminal:
cd d:\claude-dir

# Create .env.local (if not exists)
# Add this line:
VITE_RECAPTCHA_SITE_KEY=6LfG5NUn...

# Start dev server
npm run dev

# Browser should show: http://localhost:5173
```

- [ ] Browser opens to http://localhost:5173
- [ ] Go to /contact page
- [ ] Fill out form with test data:
  - Name: "Test User"
  - Email: "test@example.com"
  - Message: "This is a test message"
- [ ] Click Submit
- [ ] Check browser console (F12 → Console):
  - [ ] See "🔐 Generating reCAPTCHA token..."
  - [ ] See "✅ Token generated: abc123..."
  - [ ] See "📤 Submitting form to API..."
  - [ ] See success message or error
- [ ] If error, note the exact message

---

## STEP 6: Test Production (5 min)

- [ ] Wait 2-3 minutes for deployment
- [ ] Visit: https://netnirman.com/contact (or your custom domain)
- [ ] Fill out form:
  - Name: "Test User"
  - Email: "your-email@example.com"
  - Message: "Testing reCAPTCHA v3"
- [ ] Click Submit
- [ ] Expected: "Thank you! Your message has been received"
- [ ] Check your email:
  - [ ] Should receive email from contact form
  - [ ] Subject: "New Contact from Test User"

---

## STEP 7: Monitor Backend (5 min)

- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Functions tab
- [ ] Click `/api/contact`
- [ ] Look for recent logs
- [ ] Search for your test submission
- [ ] Verify log shows:
  - [ ] "✅ [reCAPTCHA] Google verification successful"
  - [ ] "📊 [Score] reCAPTCHA score: X.XX"
  - [ ] "✅ [Email] Sent successfully"
  - [ ] "✅ [Success] Form submitted successfully"

---

## STEP 8: Verify Everything Works (Final Check)

- [ ] Local test passed ✅
- [ ] Production test passed ✅
- [ ] Email received ✅
- [ ] Vercel logs show success ✅
- [ ] No error messages ✅

---

## 🆘 TROUBLESHOOTING

### "reCAPTCHA verification failed" error?

- [ ] Did you set RECAPTCHA_SECRET_KEY in Vercel?
- [ ] Did you redeploy after setting env var?
- [ ] Is the secret key correct? (copy-paste from Google console)
- [ ] Did you hard refresh? (Ctrl+Shift+R)

**Fix:**
1. Double-check RECAPTCHA_SECRET_KEY in Vercel
2. Redeploy from Vercel dashboard
3. Hard refresh your browser
4. Wait 1 minute and test again

### "reCAPTCHA not loaded" error?

- [ ] Did you set VITE_RECAPTCHA_SITE_KEY?
- [ ] Did you restart dev server after adding .env.local?
- [ ] Is App.jsx wrapped with GoogleReCaptchaProvider?

**Fix:**
1. Create/edit `.env.local`: `VITE_RECAPTCHA_SITE_KEY=your_key`
2. Kill dev server (Ctrl+C)
3. Restart: `npm run dev`
4. Hard refresh browser

### Email not arriving?

- [ ] Check spam folder
- [ ] Verify email address in CMS settings
- [ ] Check Resend API key is set in Vercel
- [ ] Check Vercel logs for email errors

**Fix:**
1. Go to Firebase CMS, edit `siteConfig.email`
2. Verify RESEND_API_KEY is in Vercel
3. Check Vercel function logs for errors

### Token generation fails?

- [ ] Is reCAPTCHA script loading? (check Network tab)
- [ ] Are you on correct domain?
- [ ] Did you add domain to Google console?

**Fix:**
1. Add domain to Google reCAPTCHA console
2. Hard refresh (Ctrl+Shift+R)
3. Wait 5 minutes for domain to activate

---

## 📞 FINAL CHECKLIST

Before declaring success:

- [ ] Environment vars set in Vercel
- [ ] Code deployed to Vercel (✓ Ready)
- [ ] Local test passed (npm run dev)
- [ ] Production test passed (netnirman.com)
- [ ] Email received in inbox
- [ ] Vercel logs show ✅
- [ ] No errors in browser console
- [ ] Contact form clears after submit
- [ ] Success message displays to user

---

## ✅ YOU'RE DONE!

If all items above are checked ✅, your reCAPTCHA v3 implementation is:

✅ Fully functional  
✅ Production-ready  
✅ Secure  
✅ Working with Google verification  

---

## 📚 FILES UPDATED

- `api/contact.js` - Backend (complete rewrite)
- `src/sections/ContactSection.jsx` - Frontend (enhanced)
- `src/App.jsx` - Provider setup (already correct)
- `RECAPTCHA_SETUP.md` - Setup guide (NEW)
- `RECAPTCHA_FIX_SUMMARY.md` - Detailed explanation (NEW)

---

## 💡 QUICK TIPS

- **Always** set env vars in Vercel, not local .env
- **Always** redeploy after changing env vars
- **Always** hard refresh browser (Ctrl+Shift+R)
- **Always** check Vercel function logs for debugging
- **Always** test locally before production
- **Never** commit secrets to Git
- **Never** put backend secrets in frontend code

---

**Estimated Time to Complete:** 30-40 minutes

**Most Common Issue:** Forgetting to set RECAPTCHA_SECRET_KEY in Vercel

**Solution:** Set it, redeploy, test. Done! 🎉
