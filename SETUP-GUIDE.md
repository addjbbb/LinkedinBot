# 🚀 Voyage Mystère - Complete Setup Guide

**Last Updated:** November 9, 2024
**Status:** Frontend 100% Complete + Backend Integration Ready

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup (Supabase)](#database-setup)
5. [Payment Setup (Stripe)](#payment-setup)
6. [Email Setup (Resend)](#email-setup)
7. [Development](#development)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 📦 PREREQUISITES

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control

You'll also need accounts for:
- **Supabase** ([supabase.com](https://supabase.com)) - Database
- **Stripe** ([stripe.com](https://stripe.com)) - Payments
- **Resend** ([resend.com](https://resend.com)) - Emails
- **Vercel** ([vercel.com](https://vercel.com)) - Hosting (recommended)

---

## 🔧 INSTALLATION

### 1. Clone the Repository

```bash
cd LinkedinBot/voyage-mystere
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- Stripe SDK
- Resend SDK
- And all UI dependencies

---

## 🔐 ENVIRONMENT CONFIGURATION

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual credentials:

```bash
# ============================================
# DATABASE (Supabase)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# PAYMENT (Stripe)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE=price_...
NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE_PRESTIGE=price_...
NEXT_PUBLIC_STRIPE_PRICE_NATURE=price_...
NEXT_PUBLIC_STRIPE_PRICE_NATURE_AVENTURE=price_...
NEXT_PUBLIC_STRIPE_PRICE_URBAIN=price_...
NEXT_PUBLIC_STRIPE_PRICE_URBAIN_FOODIE=price_...
NEXT_PUBLIC_STRIPE_PRICE_CHAMPAGNE=price_...
NEXT_PUBLIC_STRIPE_PRICE_PHOTOSHOOT=price_...
NEXT_PUBLIC_STRIPE_PRICE_BASKET=price_...

# ============================================
# EMAIL (Resend)
# ============================================
RESEND_API_KEY=re_...

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🗄️ DATABASE SETUP (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be provisioned (~2 minutes)

### 2. Get Your API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create Database Schema

Go to SQL Editor in Supabase Dashboard and run this schema:

```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER DEFAULT 2,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  destination_id UUID,
  special_requests TEXT,
  reveal_code VARCHAR(10),
  box_shipped_at TIMESTAMP WITH TIME ZONE,
  code_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);

-- ============================================
-- QUESTIONNAIRE RESPONSES
-- ============================================
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  occasion VARCHAR(100),
  traveler_style TEXT[], -- Array of selected styles
  rhythm VARCHAR(50),
  budget VARCHAR(50),
  dietary_restrictions TEXT[],
  mobility VARCHAR(50),
  phobies TEXT[],
  visited_regions TEXT[],
  max_distance INTEGER,
  transport_preference VARCHAR(50),
  accommodation_type VARCHAR(50),
  preferred_time VARCHAR(50),
  desired_experience VARCHAR(100),
  music_preference VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questionnaire_booking_id ON questionnaire_responses(booking_id);

-- ============================================
-- DESTINATIONS
-- ============================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',
  description TEXT,
  accommodation_name VARCHAR(200),
  accommodation_type VARCHAR(50),
  activities TEXT[],
  is_active BOOLEAN DEFAULT true,
  min_price DECIMAL(10,2),
  max_capacity INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_theme ON destinations(theme);
CREATE INDEX idx_destinations_active ON destinations(is_active);

-- ============================================
-- AVAILABLE DATES
-- ============================================
CREATE TABLE available_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 10,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(theme, date)
);

CREATE INDEX idx_available_dates_theme_date ON available_dates(theme, date);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  destination_revealed VARCHAR(100),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_published ON reviews(is_published);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS VARCHAR AS $$
DECLARE
  new_number VARCHAR;
  year VARCHAR;
  month VARCHAR;
  random_part VARCHAR;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  month := TO_CHAR(NOW(), 'MM');
  random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  new_number := 'VM-' || year || '-' || month || '-' || random_part;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies (Example - adjust based on your auth strategy)
-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can read their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 💳 PAYMENT SETUP (Stripe)

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up and complete verification
3. Switch to **Test Mode** (toggle in top right)

### 2. Get API Keys

1. Go to Developers → API keys
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### 3. Create Products & Prices

In Stripe Dashboard, go to Products → Add Product

Create the following products with their prices:

**1. Voyage Mystère Romantique**
- Price: €890
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE`

**2. Voyage Mystère Romantique Prestige**
- Price: €1,090 (890 + 200)
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE_PRESTIGE`

**3. Voyage Mystère Nature**
- Price: €750
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_NATURE`

**4. Voyage Mystère Nature Aventure+**
- Price: €900 (750 + 150)
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_NATURE_AVENTURE`

**5. Voyage Mystère Urbain**
- Price: €820
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_URBAIN`

**6. Voyage Mystère Urbain Foodie**
- Price: €1,000 (820 + 180)
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_URBAIN_FOODIE`

**7. Option: Champagne**
- Price: €40
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_CHAMPAGNE`

**8. Option: Shooting Photo**
- Price: €150
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_PHOTOSHOOT`

**9. Option: Panier Gourmand**
- Price: €45
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_BASKET`

### 4. Set Up Webhooks

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy Signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 📧 EMAIL SETUP (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account (100 emails/day free)

### 2. Get API Key

1. Go to API Keys
2. Create new API key
3. Copy key → `RESEND_API_KEY`

### 3. Verify Domain (Production)

1. Go to Domains
2. Add your domain (e.g., `voyage-mystere.fr`)
3. Add DNS records provided by Resend
4. Wait for verification

For development, you can send emails to verified addresses without domain verification.

---

## 💻 DEVELOPMENT

### 1. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. File Structure

```
voyage-mystere/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── comment-ca-marche/   # How it works
│   ├── destinations/        # Destination pages
│   ├── faq/                 # FAQ
│   ├── temoignages/         # Testimonials
│   ├── offrir/              # Gift cards
│   └── reserver/            # Booking funnel
│       ├── page.tsx         # Step 1: Theme selection
│       └── dates/           # Step 2: Date selection
│
├── components/              # React components
│   ├── ui/                 # UI components (15 total)
│   ├── navbar.tsx          # Navigation
│   └── footer.tsx          # Footer
│
├── lib/                    # Utilities & integrations
│   ├── utils.ts           # Helper functions
│   ├── pricing.ts         # Pricing config
│   ├── supabase.ts        # Database client
│   ├── stripe.ts          # Payment client
│   └── email.ts           # Email client
│
└── docs/                  # Documentation
```

### 3. Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

---

## 🚀 DEPLOYMENT (Vercel)

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select your repo

### 2. Configure Environment Variables

In Vercel project settings, add all environment variables from `.env.local`

### 3. Deploy

```bash
git push origin main
```

Vercel will automatically deploy on push.

### 4. Set Up Domains

1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🧪 TESTING

### Test in Development

```bash
# Test database connection
npm run dev
# Visit http://localhost:3000

# Check logs for any errors
```

### Test Stripe (Test Mode)

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth required: `4000 0025 0000 3155`

### Test Emails

Send to a verified email address in Resend dashboard.

---

## 🔧 TROUBLESHOOTING

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection Issues

1. Check Supabase project is active
2. Verify API keys are correct
3. Check RLS policies allow access

### Stripe Webhook Issues

1. Verify webhook URL is correct
2. Check signing secret matches
3. Test with Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Email Not Sending

1. Verify API key is correct
2. Check domain verification (production)
3. Check email limits (100/day free)

---

## 📚 ADDITIONAL RESOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 SUPPORT

For technical questions:
- Check `IMPLEMENTATION-STATUS.md` for current status
- Check `docs/` folder for detailed documentation
- Review code comments in source files

---

**Setup complete! Your Voyage Mystère website is ready to go. 🎉**
