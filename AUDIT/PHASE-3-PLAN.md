# PHASE 3: TRIPKIT MARKETPLACE - IMPLEMENTATION PLAN

**Issue:** PROD-001 - Product Reorientation (Phase 3 of 4)
**Date:** 2025-10-06
**Status:** READY TO IMPLEMENT
**Owner:** WasatchWise (all IP confirmed)

---

## EXECUTIVE SUMMARY

Phase 3 transforms SLCTrips from a destination guide into a **dual-revenue marketplace**:
1. **Free Destinations** → Affiliate revenue (Phase 2 ✅)
2. **Premium TripKits** → Direct revenue (Phase 3)

**Game Changer:** You own tk000a - a complete 29-destination educational TripKit ready to deploy as your flagship premium product.

**Revenue Potential:**
- TK-001 "Mt. Olympians" @ $49 × 50 teachers/month = **$2,450/month**
- Future kits (3-4 additional) @ $29-39 = **$1,500-2,000/month**
- **Total Target:** $4,000-5,000/month recurring from TripKits alone

---

## PHASE 3 SCOPE

### 3A: Database Schema (2-3 hours)
Create tables for TripKit marketplace:
- `tripkits` table (kit metadata, pricing, Stripe IDs)
- `tripkit_destinations` junction table (which destinations belong to which kit)
- `email_subscribers` table (Free Explorer email capture)
- `orders` table (purchase history)

### 3B: API Endpoints (3-4 hours)
- `GET /api/tripkits` - List all kits
- `GET /api/tripkits/:id` - Kit details + destinations
- `POST /api/tripkits/:id/subscribe` - Email capture (free kit)
- `POST /api/tripkits/:id/checkout` - Stripe checkout session
- `POST /api/webhooks/stripe` - Order confirmation webhook

### 3C: Frontend Components (4-5 hours)
- Update `tripkits.tsx` marketplace page (use live API)
- Build `tripkits/[kitId].tsx` detail pages (use live API)
- Email capture form with GDPR consent
- Stripe checkout integration
- Order confirmation page

### 3D: TK000A Integration (2-3 hours)
- Import 29 county destinations to database
- Create TK-001 "Mt. Olympians" kit
- Map 29 counties to kit via junction table
- Set price: $49 (teacher edition)
- Create preview (5 free sample counties)

### 3E: Email & Payment Setup (1-2 hours)
- Choose email provider (ConvertKit recommended)
- Create welcome email template
- Set up Stripe products/prices
- Configure webhook endpoint
- Test checkout flow end-to-end

**Total Estimated Time:** 12-17 hours (1.5-2 full days)

---

## SCHEMA DESIGN

### `tripkits` Table
```sql
CREATE TABLE tripkits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name TEXT NOT NULL,                    -- "Mt. Olympians Educational TripKit"
  slug TEXT UNIQUE NOT NULL,             -- "mt-olympians"
  tagline TEXT,                          -- "Utah's 29 counties come alive"
  description TEXT,                      -- Full description
  value_proposition TEXT,                -- "For 4th-grade teachers..."

  -- Pricing
  price DECIMAL(10,2) NOT NULL,          -- 0.00 for free, 49.00 for paid
  tier TEXT NOT NULL,                    -- "Free" | "Premium" | "Pro"
  stripe_product_id TEXT,                -- Stripe product ID
  stripe_price_id TEXT,                  -- Stripe price ID

  -- Metadata
  destination_count INTEGER DEFAULT 0,   -- 29 counties
  estimated_time TEXT,                   -- "2-4 weeks"
  difficulty_level TEXT,                 -- "Beginner" | "Intermediate" | "Advanced"
  status TEXT NOT NULL,                  -- "Available Now" | "Coming Soon"
  featured BOOLEAN DEFAULT false,        -- Show on homepage

  -- Media
  cover_image_url TEXT,                  -- Hero image
  preview_images TEXT[],                 -- Gallery

  -- Content
  features TEXT[],                       -- Bullet points
  includes TEXT[],                       -- What's included

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Educational (optional, for tk000a)
  learning_objectives JSONB,             -- Utah Core Standards
  target_audience TEXT[],                -- ["teachers", "homeschool", "4th-grade"]
  curriculum_alignment TEXT,             -- "Utah Core Standards 4th Grade"

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tripkits_status ON tripkits(status);
CREATE INDEX idx_tripkits_featured ON tripkits(featured) WHERE featured = true;
CREATE INDEX idx_tripkits_price ON tripkits(price);
CREATE INDEX idx_tripkits_slug ON tripkits(slug);

-- Trigger
CREATE TRIGGER trigger_update_tripkits_updated_at
  BEFORE UPDATE ON tripkits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();
```

### `tripkit_destinations` Junction Table
```sql
CREATE TABLE tripkit_destinations (
  id SERIAL PRIMARY KEY,

  tripkit_id UUID NOT NULL REFERENCES tripkits(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,

  display_order INTEGER DEFAULT 0,       -- Sort order in kit
  is_preview BOOLEAN DEFAULT false,      -- Free sample destination
  notes TEXT,                            -- Educational notes for this destination

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(tripkit_id, destination_id)
);

-- Indexes
CREATE INDEX idx_tripkit_destinations_tripkit ON tripkit_destinations(tripkit_id, display_order);
CREATE INDEX idx_tripkit_destinations_destination ON tripkit_destinations(destination_id);
CREATE INDEX idx_tripkit_destinations_preview ON tripkit_destinations(tripkit_id, is_preview) WHERE is_preview = true;
```

### `email_subscribers` Table
```sql
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email TEXT NOT NULL UNIQUE,
  name TEXT,

  -- Subscription Source
  source TEXT NOT NULL,                  -- "free_explorer" | "newsletter" | "checkout"
  tripkit_id UUID REFERENCES tripkits(id) ON DELETE SET NULL,

  -- GDPR Compliance
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMP,
  ip_address TEXT,                       -- For spam prevention (anonymize after 30 days)

  -- Status
  status TEXT DEFAULT 'active',          -- "active" | "unsubscribed" | "bounced"
  unsubscribed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_email_subscribers_source ON email_subscribers(source);

-- RLS Policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage email subscribers"
  ON email_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER trigger_update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();
```

### `orders` Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe Data
  stripe_session_id TEXT UNIQUE,         -- Checkout session ID
  stripe_payment_intent TEXT,            -- Payment intent ID
  stripe_customer_id TEXT,               -- Customer ID

  -- Order Details
  tripkit_id UUID NOT NULL REFERENCES tripkits(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,         -- 4900 for $49.00
  currency TEXT DEFAULT 'usd',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- "pending" | "completed" | "failed" | "refunded"

  -- Fulfillment
  download_url TEXT,                     -- Signed URL for kit download (if digital)
  access_granted BOOLEAN DEFAULT false,
  access_expires_at TIMESTAMP,           -- Optional: for subscription kits

  -- Metadata
  ip_address TEXT,                       -- For fraud prevention
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_tripkit ON orders(tripkit_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();
```

### Helper Function (Reusable)
```sql
-- Create reusable timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## API ENDPOINTS SPECIFICATION

### `GET /api/tripkits`
**Purpose:** List all TripKits for marketplace

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Free Explorer",
    "slug": "free-explorer",
    "tagline": "Start Your Utah Adventure",
    "price": 0.00,
    "tier": "Free",
    "destination_count": 25,
    "status": "Available Now",
    "cover_image_url": "https://...",
    "features": ["25 curated destinations", "Basic route planning"]
  }
]
```

**Filters (Query Params):**
- `?tier=Free` - Filter by tier
- `?status=Available Now` - Filter by status
- `?featured=true` - Featured only

### `GET /api/tripkits/:slug`
**Purpose:** Get TripKit details + destinations

**Response:**
```json
{
  "id": "uuid",
  "name": "Mt. Olympians Educational TripKit",
  "slug": "mt-olympians",
  "description": "...",
  "price": 49.00,
  "destination_count": 29,
  "destinations": [
    {
      "id": "uuid",
      "name": "Beaver County",
      "is_preview": true,
      "display_order": 1,
      "notes": "Meet Quincy the Beaver Alchemist"
    }
  ],
  "features": [...],
  "learning_objectives": {...}
}
```

**Preview Mode:**
- If user hasn't purchased, only show `is_preview: true` destinations (5 free samples)
- If purchased (check `orders` table by email), show all 29

### `POST /api/tripkits/:id/subscribe`
**Purpose:** Email capture for free kit

**Request Body:**
```json
{
  "email": "teacher@school.edu",
  "name": "Jane Doe",
  "consent_given": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check your email for the Free Explorer kit!",
  "subscriber_id": "uuid"
}
```

**Flow:**
1. Validate email format
2. Check if already subscribed (idempotent)
3. Insert into `email_subscribers` table
4. Trigger email via ConvertKit/Resend
5. Return success

**Email Template:**
```
Subject: Your Free Explorer Kit is Ready! 🗺️

Hi Jane,

Welcome to SLCTrips! Your Free Explorer kit is ready to download.

[Download Kit Button] → Link to /tripkits/free-explorer?access=TOKEN

What's Included:
- 25 curated Utah destinations
- Basic route planning
- Essential safety tips
- Mobile-friendly format

Upgrade to Premium:
Unlock 1000+ destinations and premium TripKits for $29-49.

Happy exploring!
Dan & the SLCTrips Team
```

### `POST /api/tripkits/:id/checkout`
**Purpose:** Create Stripe checkout session

**Request Body:**
```json
{
  "email": "buyer@example.com",
  "success_url": "https://slctrips.com/tripkits/success",
  "cancel_url": "https://slctrips.com/tripkits/mt-olympians"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Flow:**
1. Fetch TripKit from database (verify price, Stripe IDs)
2. Create Stripe checkout session:
   ```javascript
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       price: tripkit.stripe_price_id,
       quantity: 1
     }],
     mode: 'payment',
     success_url: req.body.success_url + '?session_id={CHECKOUT_SESSION_ID}',
     cancel_url: req.body.cancel_url,
     customer_email: req.body.email,
     metadata: {
       tripkit_id: tripkit.id,
       tripkit_name: tripkit.name
     }
   });
   ```
3. Insert pending order into `orders` table
4. Return `sessionId` and `url`
5. Redirect user to Stripe checkout

### `POST /api/webhooks/stripe`
**Purpose:** Handle Stripe events (payment confirmation)

**Events to Handle:**
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment processed
- `charge.refunded` - Refund issued

**Flow (checkout.session.completed):**
1. Verify webhook signature (security)
2. Extract `session_id` from event
3. Update `orders` table: `status = 'completed'`, `access_granted = true`
4. Send order confirmation email:
   ```
   Subject: Your Mt. Olympians TripKit is Ready! 🏔️

   Hi [Name],

   Thanks for your purchase! Your Mt. Olympians Educational TripKit is ready.

   [Access Kit Button] → Link to /tripkits/mt-olympians?order_id=UUID

   What You Get:
   - 29 Utah counties with guardian characters
   - Field trip guides with GPS coordinates
   - Learning objectives (Utah Core Standards)
   - Interactive activities and AR experiences

   Questions? Reply to this email.

   Happy teaching!
   SLCTrips Team
   ```

---

## TK000A INTEGRATION STRATEGY

### Step 1: Data Migration
**Import 29 counties from tk000a to `destinations` table**

**Option A: Direct Import (Recommended)**
- Export tk000a `destinations.ts` to JSON
- Transform to match SLCTrips `destinations` schema
- Bulk insert via Supabase SQL or API

**Option B: Enhanced Schema**
- Add optional columns to `destinations`:
  ```sql
  ALTER TABLE destinations ADD COLUMN guardian JSONB;
  ALTER TABLE destinations ADD COLUMN learning_objectives JSONB;
  ALTER TABLE destinations ADD COLUMN field_trip_stops JSONB;
  ALTER TABLE destinations ADD COLUMN activities JSONB;
  ALTER TABLE destinations ADD COLUMN ar_data JSONB;
  ALTER TABLE destinations ADD COLUMN historical_timeline JSONB;
  ```
- Keeps educational data with destinations
- Allows future non-educational TripKits to ignore these fields

**Recommended:** Option B (richer data model, flexible for future kits)

### Step 2: Create TK-001 Kit
```sql
INSERT INTO tripkits (
  name,
  slug,
  tagline,
  description,
  value_proposition,
  price,
  tier,
  destination_count,
  estimated_time,
  difficulty_level,
  status,
  featured,
  cover_image_url,
  features,
  learning_objectives,
  target_audience,
  curriculum_alignment,
  stripe_product_id,
  stripe_price_id
) VALUES (
  'Mt. Olympians Educational TripKit',
  'mt-olympians',
  'Where Utah''s 29 Counties Come Alive',
  'A comprehensive educational TripKit that transforms Utah''s 29 county guardians into grade-appropriate adventures for 4th-grade teachers. Blends mythic storytelling with Utah Core Standards through location-based learning.',
  'Perfect for 4th-grade teachers, homeschool parents, and field trip coordinators. Curriculum-aligned, safety-first, and adventure-ready.',
  49.00,
  'Premium',
  29,
  '2-4 weeks (full semester curriculum)',
  'Intermediate',
  'Available Now',
  true,
  'https://storage.googleapis.com/aistudio-bucket/media/4th-grade-utah-studies/cover.png',
  ARRAY[
    '29 Utah counties with guardian characters',
    'Field trip guides with GPS coordinates',
    'Learning objectives (Utah Core Standards)',
    'Interactive activities and AR experiences',
    'Safety protocols and teacher notes',
    'Historical timelines for each county',
    'Cross-curricular connections',
    'Digital access (PDF + interactive web)'
  ],
  '{
    "social_studies": ["Geography", "History", "Economics", "Civics"],
    "science": ["Earth Science", "Life Science"],
    "ela": ["Reading comprehension", "Narrative writing"],
    "mathematics": ["Data analysis", "Measurement"],
    "health_education": ["Safety", "Wellness"],
    "fine_arts": ["Visual arts", "Music", "Drama"]
  }'::jsonb,
  ARRAY['teachers', 'homeschool', '4th-grade', 'field-trips', 'educators'],
  'Utah Core Standards - 4th Grade Social Studies & Science',
  'prod_STRIPE_PRODUCT_ID',
  'price_STRIPE_PRICE_ID'
);
```

### Step 3: Map Destinations to Kit
```sql
-- Insert all 29 counties into junction table
-- First 5 are preview (free sample)
INSERT INTO tripkit_destinations (tripkit_id, destination_id, display_order, is_preview, notes)
SELECT
  (SELECT id FROM tripkits WHERE slug = 'mt-olympians'),
  d.id,
  ROW_NUMBER() OVER (ORDER BY d.name),
  (ROW_NUMBER() OVER (ORDER BY d.name) <= 5),  -- First 5 are preview
  'Guardian: ' || (d.guardian->>'name')
FROM destinations d
WHERE d.guardian IS NOT NULL  -- Only counties with guardians (from tk000a)
ORDER BY d.name;
```

### Step 4: Stripe Product Setup
1. Create Stripe product: "Mt. Olympians Educational TripKit"
2. Create price: $49.00 one-time payment
3. Copy `product_id` and `price_id` to database
4. Test checkout flow in Stripe test mode

---

## FRONTEND COMPONENTS

### Updated `tripkits.tsx` (Marketplace Page)
**Changes:**
- Replace hardcoded `tripKits` array with API call to `/api/tripkits`
- Add loading state
- Add error handling
- Keep existing grid layout

**Code Snippet:**
```typescript
const [tripKits, setTripKits] = useState<TripKit[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/tripkits')
    .then(res => res.json())
    .then(data => {
      setTripKits(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load TripKits:', err);
      setLoading(false);
    });
}, []);
```

### New `tripkits/[kitId].tsx` (Detail Page)
**Features:**
- Fetch kit details from `/api/tripkits/:slug`
- Display all features, destinations, learning objectives
- Free kit: Email capture form → `/api/tripkits/:id/subscribe`
- Paid kit: "Purchase $49" button → `/api/tripkits/:id/checkout`
- Preview destinations (5 free samples) vs full access (29 counties)

**Email Capture Form:**
```tsx
<form onSubmit={handleSubscribe}>
  <input
    type="email"
    required
    placeholder="teacher@school.edu"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <label>
    <input type="checkbox" required />
    I agree to receive emails from SLCTrips (you can unsubscribe anytime)
  </label>
  <button type="submit">Get Free Kit</button>
</form>
```

**Purchase Flow:**
```tsx
const handlePurchase = async () => {
  const res = await fetch(`/api/tripkits/${tripkit.id}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      success_url: `${window.location.origin}/tripkits/success`,
      cancel_url: window.location.href
    })
  });

  const { url } = await res.json();
  window.location.href = url;  // Redirect to Stripe
};
```

### New `tripkits/success.tsx` (Order Confirmation)
**Features:**
- Display after successful Stripe payment
- Extract `session_id` from URL params
- Verify order in database (optional: call `/api/orders/:session_id`)
- Show download link or access instructions

**Content:**
```tsx
<div className="success-page">
  <h1>Thank you for your purchase! 🎉</h1>
  <p>Your Mt. Olympians TripKit is ready.</p>
  <Link href="/tripkits/mt-olympians?purchased=true">
    <button>Access Your Kit</button>
  </Link>
  <p>A confirmation email has been sent to {email}.</p>
</div>
```

---

## EMAIL PROVIDER SETUP

### Recommended: ConvertKit
**Why ConvertKit:**
- ✅ Creator-focused (not enterprise)
- ✅ Simple API for email capture
- ✅ Built-in GDPR compliance tools
- ✅ Automation for welcome emails
- ✅ $29/month for up to 1,000 subscribers
- ✅ Unsubscribe links automatic

**Setup Steps:**
1. Create ConvertKit account (free trial)
2. Create "Free Explorer Subscribers" form
3. Create "Mt. Olympians Purchasers" tag
4. Set up automation:
   - New subscriber → Send "Free Explorer Welcome" email
   - New purchase tag → Send "Mt. Olympians Access" email
5. Get API key for `/api/tripkits/:id/subscribe` endpoint

**API Integration:**
```javascript
// /api/tripkits/:id/subscribe endpoint
const response = await fetch('https://api.convertkit.com/v3/forms/FORM_ID/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email: req.body.email,
    first_name: req.body.name,
    fields: {
      tripkit_id: tripkit.id,
      tripkit_name: tripkit.name
    }
  })
});
```

**Alternative: Resend**
- Modern email API (better developer experience)
- $0/month for 3,000 emails
- React Email templates (JSX-based)
- Good for transactional emails (order confirmations)

---

## STRIPE SETUP

### Products to Create
1. **Mt. Olympians Educational TripKit** - $49.00 one-time
2. **Utah Mysteries** - $29.00 one-time (future)
3. **Movie Locations** - $39.00 one-time (future)
4. **True Crime** - $49.00 one-time (future)

### Webhook Configuration
**Endpoint:** `https://slctrips.com/api/webhooks/stripe`

**Events to Subscribe:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `charge.refunded`

**Webhook Secret:**
Store in environment: `STRIPE_WEBHOOK_SECRET`

**Signature Verification (Security):**
```javascript
const sig = req.headers['stripe-signature'];
let event;

try {
  event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
} catch (err) {
  return res.status(400).send(`Webhook Error: ${err.message}`);
}

// Process event
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  // Update orders table, send email
}
```

---

## TESTING CHECKLIST

### Phase 3A: Database
- [ ] Run migration successfully
- [ ] Insert sample TripKit (Free Explorer)
- [ ] Insert TK-001 (Mt. Olympians)
- [ ] Map 29 destinations to TK-001
- [ ] Verify junction table queries work
- [ ] Test RLS policies

### Phase 3B: API
- [ ] `GET /api/tripkits` returns all kits
- [ ] `GET /api/tripkits/free-explorer` returns kit + destinations
- [ ] `GET /api/tripkits/mt-olympians` shows only preview if not purchased
- [ ] `POST /api/tripkits/:id/subscribe` inserts email and triggers email
- [ ] `POST /api/tripkits/:id/checkout` creates Stripe session
- [ ] `POST /api/webhooks/stripe` processes payment and updates order

### Phase 3C: Frontend
- [ ] Marketplace page loads kits from API
- [ ] Detail page shows correct data
- [ ] Email form submits successfully
- [ ] Stripe checkout redirects correctly
- [ ] Success page displays after purchase
- [ ] Mobile responsive on all pages

### Phase 3D: Email
- [ ] Free kit email arrives within 1 minute
- [ ] Order confirmation email arrives after payment
- [ ] Unsubscribe link works
- [ ] Emails render correctly in Gmail, Outlook, Apple Mail

### Phase 3E: Stripe
- [ ] Test payment completes successfully
- [ ] Webhook triggers and updates database
- [ ] Refund processed correctly
- [ ] Failed payment handled gracefully

---

## DEPLOYMENT PLAN

### Pre-Deployment
1. ✅ Phase 2 deployed (Gear Module live)
2. ✅ Visual QA complete (awaiting user confirmation)
3. Create Stripe products in test mode
4. Set up ConvertKit forms and automations
5. Create email templates

### Phase 3 Deployment (Sequential)
1. **Database Migration** (5 min)
   - Run migration SQL in Supabase dashboard
   - Verify tables created
   - Insert Free Explorer kit

2. **TK000A Import** (30 min)
   - Export tk000a destinations to JSON
   - Transform data to match schema
   - Bulk insert 29 counties
   - Create TK-001 kit
   - Map destinations to kit

3. **API Endpoints** (Deploy all at once)
   - Push `/api/tripkits` endpoints to Vercel
   - Test each endpoint manually
   - Verify webhook signature in Stripe

4. **Frontend Updates** (Deploy all at once)
   - Update `tripkits.tsx`
   - Create `tripkits/[kitId].tsx`
   - Create `tripkits/success.tsx`
   - Push to Vercel

5. **Smoke Test** (30 min)
   - Visit marketplace page
   - Click Free Explorer → Submit email → Verify email arrives
   - Click Mt. Olympians → Purchase (test mode) → Verify order confirmation
   - Check database for order record

6. **Go Live** (5 min)
   - Switch Stripe to live mode
   - Update Stripe keys in environment
   - Announce on social media / email list

---

## ROLLBACK PLAN

**If Phase 3 breaks:**
1. Revert Vercel deployment (instant rollback via dashboard)
2. Database rollback script:
   ```sql
   DROP TABLE IF EXISTS orders CASCADE;
   DROP TABLE IF EXISTS email_subscribers CASCADE;
   DROP TABLE IF EXISTS tripkit_destinations CASCADE;
   DROP TABLE IF EXISTS tripkits CASCADE;
   ```
3. Notify users via status page (if downtime > 5 minutes)

**Safe to rollback:** Phase 2 (Gear Module) is independent and unaffected.

---

## SUCCESS METRICS

### Phase 3 Complete When:
- [x] Database schema deployed
- [x] TK-001 imported with 29 counties
- [x] All 5 API endpoints working
- [x] Marketplace page live with real data
- [x] Email capture functional (Free Explorer)
- [x] Stripe checkout functional (Mt. Olympians)
- [x] Webhook processing orders correctly
- [x] Order confirmation emails sending

### Revenue Targets (90 days post-launch)
- **Month 1:** 10 TK-001 sales × $49 = $490
- **Month 2:** 30 sales × $49 = $1,470
- **Month 3:** 50 sales × $49 = $2,450
- **Email List:** 200+ subscribers (Free Explorer)

### KPIs to Track
- TripKit page views
- Email capture conversion rate (target: 15-25%)
- Checkout conversion rate (target: 3-5%)
- Average order value
- Customer acquisition cost (CAC)
- Email open rates (target: 30-40%)
- Refund rate (target: < 2%)

---

## NEXT STEPS

**Ready to Start:**
1. ✅ IP ownership confirmed
2. ✅ tk000a analyzed and ready
3. ✅ Schema designed
4. ✅ API specs written
5. ✅ Integration path documented

**Awaiting:**
1. User visual QA on Phase 2 (Gear Module)
2. User approval to proceed with Phase 3

**Once Approved:**
1. Create Supabase migration file
2. Build API endpoints
3. Import tk000a data
4. Update frontend components
5. Set up Stripe + ConvertKit
6. Deploy and test
7. Launch! 🚀

---

**Phase 3 Plan Created By:** Claude (Lead Auditor)
**Date:** 2025-10-06
**Status:** READY TO IMPLEMENT
**Estimated Completion:** 12-17 hours (1.5-2 days)

---

*This is your flagship product. Let's make it legendary.* 🏔️
