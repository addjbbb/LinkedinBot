# 🧪 Testing Guide - Voyage Mystère Website

**Last Updated:** November 9, 2024
**Purpose:** Comprehensive testing checklist to verify all functionality before production launch

---

## 📋 TABLE OF CONTENTS

1. [Pre-Launch Setup](#pre-launch-setup)
2. [Environment Testing](#environment-testing)
3. [Database Testing](#database-testing)
4. [Booking Funnel Testing](#booking-funnel-testing)
5. [Payment Integration Testing](#payment-integration-testing)
6. [Email System Testing](#email-system-testing)
7. [SEO & Performance Testing](#seo--performance-testing)
8. [Cross-Browser Testing](#cross-browser-testing)
9. [Mobile Responsiveness](#mobile-responsiveness)
10. [Security Testing](#security-testing)
11. [Bug Tracking](#bug-tracking)

---

## 🚀 PRE-LAUNCH SETUP

### 1. Environment Configuration

**Checklist:**
- [ ] `.env.local` file created with all variables from `.env.example`
- [ ] Supabase URL and keys configured
- [ ] Stripe test keys configured (pk_test_, sk_test_)
- [ ] Resend API key configured
- [ ] `NEXT_PUBLIC_BASE_URL` set correctly

**Verification:**
```bash
# Check if environment variables are loaded
npm run dev
# Visit http://localhost:3000
# Open browser console - no environment variable errors
```

### 2. Dependencies Installation

```bash
cd voyage-mystere
npm install
```

**Verify:**
- [ ] No installation errors
- [ ] All packages installed successfully
- [ ] `node_modules/` directory created

---

## 🗄️ DATABASE TESTING

### 1. Schema Creation

**Steps:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `/database/schema.sql`
3. Execute the SQL script
4. Check for errors

**Verify:**
- [ ] All 8 tables created successfully
- [ ] All indexes created
- [ ] All triggers created
- [ ] All functions created
- [ ] RLS policies enabled

**Test Queries:**
```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should return: users, bookings, questionnaire_responses,
-- destinations, available_dates, payments, reviews, booking_options

-- Check functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';

-- Should return: generate_booking_number, update_updated_at_column,
-- generate_reveal_code
```

### 2. Seed Data Loading

**Steps:**
1. Copy contents of `/database/seed.sql`
2. Execute in SQL Editor
3. Verify data inserted

**Verify:**
- [ ] 6 destinations created (2 per theme)
- [ ] Available dates generated for next 6 months
- [ ] Sample users created
- [ ] Sample bookings and reviews created

**Test Query:**
```sql
-- Check destinations
SELECT theme, COUNT(*) FROM destinations GROUP BY theme;
-- Should return 2 for each theme

-- Check available dates
SELECT theme, COUNT(*) FROM available_dates GROUP BY theme;
-- Should return ~120-150 dates per theme
```

### 3. Database Connection Test

**Create test file:** `voyage-mystere/test-db.js`
```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Database connection failed:', error)
  } else {
    console.log('✅ Database connection successful!')
    console.log('Sample destination:', data[0])
  }
}

testConnection()
```

**Run:**
```bash
node test-db.js
```

**Expected:** Connection successful, destination data returned

---

## 🛒 BOOKING FUNNEL TESTING

### Step 1: Theme Selection (`/reserver`)

**Test Cases:**
- [ ] Page loads without errors
- [ ] All 3 theme cards displayed correctly
- [ ] Prices shown: Romantique (890€), Nature (750€), Urbain (820€)
- [ ] Click on each theme button
- [ ] Redirects to `/reserver/dates?theme=X`

**Visual Check:**
- [ ] Images/icons display properly
- [ ] Responsive on mobile/tablet
- [ ] Hover effects work on cards
- [ ] Progress indicator shows step 1/5

### Step 2: Date Selection (`/reserver/dates`)

**Test Cases:**
- [ ] Calendar displays current month
- [ ] Past dates are disabled
- [ ] Can select start date
- [ ] Can select end date (after start date)
- [ ] Minimum 2 nights enforced
- [ ] Selected dates highlight properly
- [ ] Click "Continue" → creates booking → redirects to questionnaire

**Edge Cases:**
- [ ] Try selecting end date before start date → should not work
- [ ] Try selecting same date twice → proper handling
- [ ] Navigate between months → calendar updates

**API Test:**
```javascript
// Should create a booking in database
// Check Supabase dashboard → bookings table
// New row with status='pending' should appear
```

### Step 3: Questionnaire (`/reserver/questionnaire`)

**Test Cases:**
- [ ] 5 steps displayed with progress bar
- [ ] Step 1/5: Occasion, traveler style, rhythm questions work
- [ ] Step 2/5: Budget, dietary, mobility, phobias questions work
- [ ] Step 3/5: Regions, distance, transport questions work
- [ ] Step 4/5: Accommodation, time, music questions work
- [ ] Step 5/5: Desired experience + summary works
- [ ] Back button navigates to previous step
- [ ] Next button advances to next step
- [ ] Submit on final step → saves to database → redirects to summary

**Form Validation:**
- [ ] Can proceed without filling all fields (most are optional)
- [ ] Multiple checkboxes work correctly
- [ ] Slider for distance works
- [ ] All select dropdowns functional

**API Test:**
```sql
-- Check questionnaire_responses table
SELECT * FROM questionnaire_responses
ORDER BY created_at DESC LIMIT 1;
-- Should show your test answers
```

### Step 4: Summary (`/reserver/recapitulatif`)

**Test Cases:**
- [ ] Base package displayed with correct price
- [ ] Upgrade option shows (if available for theme)
- [ ] Click upgrade → price updates in sidebar
- [ ] Optional add-ons displayed (Champagne 40€, Photoshoot 150€, Basket 45€)
- [ ] Check/uncheck options → price updates
- [ ] Total calculates correctly
- [ ] Click Continue → redirects to information page

**Price Calculations:**
```
Base Romantique: 890€
+ Prestige upgrade: +200€ = 1090€
+ Champagne: +40€
+ Photoshoot: +150€
+ Basket: +45€
Total possible: 1325€
```

### Step 5: Information (`/reserver/informations`)

**Test Cases:**
- [ ] Form displays with all fields
- [ ] First name required ✓
- [ ] Last name required ✓
- [ ] Email required + validation ✓
- [ ] Phone required + format validation ✓
- [ ] Address required ✓
- [ ] Postal code required + 5 digits validation ✓
- [ ] City required ✓
- [ ] Special requests optional
- [ ] Terms checkbox required ✓
- [ ] Marketing checkbox optional
- [ ] Click submit with invalid data → errors shown
- [ ] Click submit with valid data → saves → redirects to payment

**Validation Tests:**
```
Invalid email: "test@test" → Error
Invalid phone: "abc123" → Error
Invalid postal: "1234" → Error (must be 5 digits)
Missing required → Error messages display
```

### Step 6: Payment (`/reserver/paiement`)

**Test Cases:**
- [ ] Payment page displays
- [ ] Order summary shown
- [ ] Total price correct
- [ ] Security badges displayed
- [ ] Click "Pay" button → creates Stripe session
- [ ] Redirects to Stripe Checkout
- [ ] Stripe Checkout page loads

**Stripe Test Mode:**
```
Test Card: 4242 4242 4242 4242
Expiry: Any future date (12/25)
CVC: Any 3 digits (123)
ZIP: Any 5 digits (12345)
```

- [ ] Enter test card → payment succeeds
- [ ] Redirected back to confirmation page
- [ ] Webhook fires → booking status updated to 'confirmed'

**Test Declined Card:**
```
Declined Card: 4000 0000 0000 0002
```
- [ ] Payment fails → error message shown
- [ ] Booking status stays 'pending'

### Step 7: Confirmation (`/reserver/confirmation`)

**Test Cases:**
- [ ] Confirmation page displays
- [ ] Booking number shown
- [ ] Email confirmation mentioned
- [ ] Timeline of next steps displayed
- [ ] Download PDF button present (may not work yet)
- [ ] Return to home button works

**Verify in Database:**
```sql
-- Check booking status updated
SELECT booking_number, status, total_price
FROM bookings
WHERE status = 'confirmed'
ORDER BY created_at DESC LIMIT 1;

-- Check payment recorded
SELECT * FROM payments
ORDER BY created_at DESC LIMIT 1;
```

---

## 💳 PAYMENT INTEGRATION TESTING

### 1. Stripe Dashboard Setup

**Verify:**
- [ ] 9 products created with correct prices
- [ ] Product IDs match environment variables
- [ ] Webhook endpoint configured
- [ ] Webhook secret in `.env.local`

**Products:**
```
1. Voyage Romantique - 890€
2. Voyage Romantique Prestige - 1090€
3. Voyage Nature - 750€
4. Voyage Nature Aventure+ - 900€
5. Voyage Urbain - 820€
6. Voyage Urbain Foodie - 1000€
7. Option Champagne - 40€
8. Option Photoshoot - 150€
9. Option Panier Gourmand - 45€
```

### 2. Webhook Testing

**Method 1: Stripe CLI (Local)**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test payment
stripe trigger payment_intent.succeeded
```

**Verify:**
- [ ] Webhook received in terminal
- [ ] Booking status updated in database
- [ ] Email sent (if email system configured)

**Method 2: Manual Test (Production)**
1. Complete a real test booking
2. Go to Stripe Dashboard → Webhooks
3. Check webhook logs
4. Verify all events received (checkout.session.completed, payment_intent.succeeded)

### 3. Payment Flow Testing Matrix

| Scenario | Card | Expected Result |
|----------|------|----------------|
| Success | 4242 4242 4242 4242 | Payment succeeds, booking confirmed |
| Decline | 4000 0000 0000 0002 | Payment fails, booking stays pending |
| Auth Required | 4000 0025 0000 3155 | 3D Secure modal, then success |
| Insufficient Funds | 4000 0000 0000 9995 | Payment fails with error |

**Test each scenario:**
- [ ] Success case ✓
- [ ] Decline case ✓
- [ ] 3D Secure case ✓
- [ ] Insufficient funds case ✓

---

## 📧 EMAIL SYSTEM TESTING

### 1. Resend Setup

**Verify:**
- [ ] Resend account created
- [ ] API key in `.env.local`
- [ ] Domain verified (if using custom domain)
- [ ] Sending email verified

### 2. Email Templates Testing

**Booking Confirmation Email:**
```javascript
// Test file: test-email.js
const { sendBookingConfirmation } = require('./voyage-mystere/lib/email')

sendBookingConfirmation({
  to: 'your-email@example.com',
  firstName: 'Test',
  bookingNumber: 'VM-2024-11-0001',
  theme: 'romantique',
  startDate: '2024-12-15',
  totalPrice: 890
})
```

**Run:** `node test-email.js`

**Verify:**
- [ ] Email received in inbox
- [ ] Subject correct
- [ ] HTML renders properly
- [ ] All variables populated
- [ ] Links work

**Test all email templates:**
- [ ] Booking confirmation ✓
- [ ] Reveal code email ✓
- [ ] Box shipped notification ✓
- [ ] Booking reminder (J-10) ✓
- [ ] Cancellation confirmation ✓
- [ ] Review request ✓

### 3. Email Automation Testing

**Trigger events:**
1. Complete a booking → Confirmation email sent
2. Webhook payment success → Email triggered
3. Manual triggers for other emails

**Check Resend Dashboard:**
- [ ] All emails appear in logs
- [ ] Delivery status: Delivered
- [ ] Open/click rates tracked

---

## 🔍 SEO & PERFORMANCE TESTING

### 1. SEO Metadata

**Test each page:**

**Homepage** (`/`)
- [ ] Title: "Voyage Mystère Premium - Week-end Surprise..."
- [ ] Meta description present (<160 chars)
- [ ] Open Graph tags present
- [ ] Twitter Card tags present

**Destinations** (`/destinations/*`)
- [ ] Each theme page has unique title
- [ ] Meta descriptions optimized
- [ ] Schema markup present

**Check with browser DevTools:**
```
Right-click → View Page Source
Search for: <meta property="og:
Search for: <script type="application/ld+json"
```

### 2. Sitemap & Robots

**Test sitemap:**
```bash
curl http://localhost:3000/sitemap.xml
```

**Verify:**
- [ ] XML format valid
- [ ] All main pages listed
- [ ] URLs are absolute (https://...)
- [ ] Last modified dates present

**Test robots.txt:**
```bash
curl http://localhost:3000/robots.txt
```

**Verify:**
- [ ] Sitemap URL listed
- [ ] Allow/disallow rules correct
- [ ] /api/ and /admin/ disallowed

### 3. Performance Testing

**Tools:**
- Lighthouse (Chrome DevTools)
- PageSpeed Insights
- GTmetrix

**Run Lighthouse:**
```
1. Open Chrome DevTools (F12)
2. Lighthouse tab
3. Generate report
```

**Target Scores:**
- [ ] Performance: >80
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

**Optimize if needed:**
- Images: Convert to WebP, add lazy loading
- CSS: Remove unused styles
- JS: Code splitting, tree shaking
- Fonts: Preload, font-display: swap

### 4. Schema Markup Validation

**Tool:** https://validator.schema.org/

**Steps:**
1. View page source
2. Copy JSON-LD schema
3. Paste into validator
4. Check for errors

**Pages to test:**
- [ ] Homepage (Organization schema) ✓
- [ ] Destinations (Product schema) ✓
- [ ] FAQ (FAQ schema) ✓
- [ ] Testimonials (Review schema) ✓

---

## 🌐 CROSS-BROWSER TESTING

### Desktop Browsers

**Chrome (Latest):**
- [ ] All pages load correctly
- [ ] Booking funnel works
- [ ] Payment redirects work
- [ ] Forms validate properly

**Firefox (Latest):**
- [ ] Same as Chrome checklist
- [ ] No console errors

**Safari (Latest):**
- [ ] Same as Chrome checklist
- [ ] Date picker works
- [ ] Payment flow works

**Edge (Latest):**
- [ ] Same as Chrome checklist

### Mobile Browsers

**iOS Safari:**
- [ ] All pages responsive
- [ ] Touch interactions work
- [ ] Forms accessible
- [ ] Payment works

**Android Chrome:**
- [ ] Same as iOS checklist

### Testing Tools

**BrowserStack** (free trial):
- Test on real devices
- Screenshot comparisons

**Lambdatest** (free tier):
- Automated screenshots

**Manual Testing:**
```
Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
Test multiple viewport sizes:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1920px)
```

---

## 📱 MOBILE RESPONSIVENESS

### Layout Testing

**Pages to test:**
- [ ] Homepage
- [ ] Comment ça marche
- [ ] Destinations hub
- [ ] Individual destination pages
- [ ] FAQ
- [ ] Testimonials
- [ ] Gift card page
- [ ] Booking funnel (all steps)

**Checklist for each page:**
- [ ] No horizontal scroll
- [ ] Text readable (min 16px)
- [ ] Buttons tap-friendly (min 44×44px)
- [ ] Images scale properly
- [ ] Navigation menu works (hamburger)
- [ ] Forms easy to fill
- [ ] Footer displays correctly

### Orientation Testing

**Portrait:**
- [ ] All pages work

**Landscape:**
- [ ] All pages work
- [ ] No layout breaks

### Device-Specific

**Small devices (iPhone SE):**
- [ ] Content doesn't overflow
- [ ] Buttons not cut off

**Tablets (iPad):**
- [ ] Uses tablet layout
- [ ] Grid layouts work

**Large phones (iPhone 14 Pro Max):**
- [ ] Optimal use of space

---

## 🔒 SECURITY TESTING

### 1. Environment Variables

**Verify:**
- [ ] No secrets in git
- [ ] `.env.local` in `.gitignore`
- [ ] API keys never exposed to client
- [ ] Only `NEXT_PUBLIC_*` vars in browser

**Test:**
```javascript
// Browser console
console.log(process.env.STRIPE_SECRET_KEY) // Should be undefined
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) // Should work
```

### 2. API Routes Protection

**Test unauthorized access:**
```bash
# Try accessing without proper data
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return 400 error with "Missing required fields"
```

**Verify:**
- [ ] Endpoints validate input
- [ ] Required fields enforced
- [ ] SQL injection prevented (using Supabase parameterized queries)
- [ ] XSS prevented (React escapes by default)

### 3. Stripe Security

**Verify:**
- [ ] Webhook signature verified
- [ ] Payment amounts validated server-side
- [ ] No price manipulation possible from client

### 4. Database Security

**RLS Policies:**
```sql
-- Test as anonymous user
SELECT * FROM users; -- Should fail
SELECT * FROM bookings; -- Should fail
SELECT * FROM destinations WHERE is_active = true; -- Should work
```

**Verify:**
- [ ] Users can only see their own data
- [ ] Public can only see published content
- [ ] Admin operations require auth

---

## 🐛 BUG TRACKING

### Found Bugs Template

```markdown
## Bug: [Short Description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 118
- OS: macOS 14
- Device: Desktop
- URL: https://example.com/page

**Screenshots:**
[Attach if applicable]

**Console Errors:**
```
Error message here
```

**Status:** Open / In Progress / Fixed / Won't Fix
```

### Common Issues & Solutions

**Issue: Build errors**
```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Issue: Environment variables not loading**
```bash
# Solution: Restart dev server
# Kill all node processes
killall node
npm run dev
```

**Issue: Database connection fails**
- Check Supabase project is active
- Verify API keys are correct
- Check network/firewall

**Issue: Stripe webhook not firing**
```bash
# Solution: Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Issue: Emails not sending**
- Check Resend API key
- Verify domain (if using custom)
- Check email limits (100/day on free tier)

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

### Code Quality
- [ ] No console.errors in production
- [ ] All TypeScript errors resolved
- [ ] ESLint passing
- [ ] Code formatted (Prettier)

### Database
- [ ] Schema deployed
- [ ] Seed data loaded (if needed)
- [ ] Backups configured
- [ ] RLS policies active

### Integrations
- [ ] Supabase connection working
- [ ] Stripe test mode working
- [ ] Stripe production mode ready
- [ ] Resend sending emails
- [ ] Domain verified for emails

### Content
- [ ] All text proofread
- [ ] All images optimized
- [ ] All links working
- [ ] Legal pages complete (CGV, Privacy Policy)

### Performance
- [ ] Lighthouse score >80
- [ ] Images lazy loading
- [ ] Fonts optimized
- [ ] Bundle size reasonable

### SEO
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Meta tags on all pages
- [ ] Schema markup added
- [ ] Open Graph images

### Security
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] HTTPS enabled (in production)
- [ ] CORS configured properly

### Analytics (Optional but recommended)
- [ ] Google Analytics configured
- [ ] Conversion tracking set up
- [ ] Error monitoring (Sentry)

---

## 🚀 GO LIVE STEPS

1. **Final Smoke Test:**
   - Complete one full test booking in test mode
   - Verify everything works end-to-end

2. **Switch to Production:**
   - Update Stripe keys to production (pk_live_, sk_live_)
   - Update environment variables in Vercel
   - Configure production webhook URL in Stripe

3. **Deploy:**
```bash
git push origin main
# Or deploy via Vercel dashboard
```

4. **Post-Deploy Verification:**
   - Test production URL
   - Complete one real test booking (can refund)
   - Monitor error logs
   - Check analytics

5. **Monitor First Week:**
   - Watch Stripe dashboard daily
   - Check email delivery rates
   - Review user feedback
   - Monitor server errors

---

## 🆘 SUPPORT RESOURCES

**Documentation:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Resend: https://resend.com/docs

**Communities:**
- Next.js Discord
- Supabase Discord
- Stripe Support

**Emergency Contacts:**
- Hosting: support@vercel.com
- Payment: support@stripe.com
- Database: support@supabase.com

---

**Testing completed! Site ready for production. 🎉**
