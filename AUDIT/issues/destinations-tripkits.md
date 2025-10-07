# PRODUCT REORIENTATION: Destinations + TripKit Marketplace

**Issue ID:** PROD-001
**Date Created:** 2025-10-06
**Priority:** HIGH
**Status:** PLANNING

---

## OBJECTIVE

Reorient SLCTrips toward a lean "Destinations + TripKit Marketplace" story with:
1. Clean destination discovery and detail pages with dynamic Supabase data
2. Simple TripKit marketplace with pricing and detail pages
3. Removal of Olympian storyline and extra brand lore
4. Addition of "Affiliate Gear You Might Need" module on destination pages

---

## CURRENT STATE AUDIT

### Landing Page (`src/pages/landing.tsx`)
**Current Structure:**
- ✅ DriveTimeHero (brand tagline + drive-time chips) - KEEP
- ✅ BullsEyeExplorerClean (interactive ring navigation) - KEEP
- ❌ Dan the Wasatch Sasquatch section (brand lore) - SIMPLIFY/REMOVE
- ✅ FeaturedDestinations (curated highlights) - KEEP & ENHANCE

**Current Flow:** Home → Bulls-eye → Featured Destinations (no search bar)

### Destinations Experience
**Index Page (`src/pages/destinations.tsx`):**
- ✅ Search bar with filters (category, subcategory, drive time, sort)
- ✅ Grid view with destination cards
- ✅ Drive time filter integration from bulls-eye
- ✅ Dynamic data from `fetchDestinations()` API

**Detail Page (`src/pages/destination/slug.tsx`):**
- ✅ Fetches from `/api/destinations/[slug]`
- ✅ Validation via Zod schema (`validateDestination`)
- ✅ Error boundaries and loading states
- ✅ Dynamic content rendering via `DestinationPage` component
- ❌ NO affiliate gear module - **MISSING**

**Current Destination Schema (`validateDestination.ts`):**
```typescript
- id, external_id, name, category
- drive_time, distance, address, coordinates
- phone, website, description, highlights
- hours, pricing, tags, activities
- seasonality, time_needed, difficulty, accessibility
- photos[], vibe_descriptors[], rating
- public_transit, family_friendly
- olympic_venue (bool)
```

### TripKit Marketplace (`src/pages/tripkits.tsx`)
**Current State:**
- ✅ Featured "Free Explorer" kit hero section
- ✅ Grid view of 4 kits (3 "Coming Soon")
- ✅ Pricing display (FREE or $XX)
- ✅ Detail page links (`/tripkits/[id]`)
- ✅ Hardcoded data (tripKits array)
- ⚠️ Thin inventory (only 1 available kit)

**Current Kits:**
1. Free Explorer (FREE) - Available
2. Utah Mysteries ($29) - Coming Soon
3. Movie Locations ($39) - Coming Soon
4. True Crime ($49) - Coming Soon

### Components to Archive/Remove
**Olympian Storyline Files:**
1. `src/pages/mt-olympians.tsx` - Archive
2. `src/pages/olympians-atlas-landing.tsx` - Archive
3. `src/components/olympic-spotlight.tsx` - Archive or simplify to single mention

**Brand Lore to Simplify:**
- Dan the Sasquatch section (reduce to 1-2 sentences or remove)
- Extra narrative copy throughout

---

## REQUIRED CHANGES

### 1. Landing Page Enhancements

**Goal:** Clean destination search + curated highlights

**Changes:**
- ✅ Keep DriveTimeHero (brand tagline display)
- ✅ Keep BullsEyeExplorerClean (visual drive-time navigation)
- ➕ ADD: Search bar with autocomplete above or below bulls-eye
- ✅ Keep FeaturedDestinations, enhance with better imagery
- ❌ REMOVE: Dan section OR reduce to single card/mention
- ❌ REMOVE: Any Olympian storyline references

**Component Modifications:**
```
landing.tsx:
  - Add <SearchBar /> component (new)
  - Remove/simplify Dan section (lines 28-53)
  - Enhance FeaturedDestinations styling
```

---

### 2. Destination Detail Page - Affiliate Gear Module

**Goal:** Add "Affiliate Gear You Might Need" module

**Required Supabase Schema Changes:**
```sql
-- New table: destination_affiliate_gear
CREATE TABLE destination_affiliate_gear (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id),
  product_name TEXT NOT NULL,
  product_description TEXT,
  affiliate_link TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2),
  stripe_product_id TEXT,  -- For Stripe integration
  category TEXT,  -- "Gear", "Apparel", "Guide Books", etc.
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OR: Add JSON field to existing destinations table
ALTER TABLE destinations
ADD COLUMN affiliate_gear JSONB DEFAULT '[]';

-- Example structure:
-- {
--   "product_name": "Hiking Boots",
--   "affiliate_link": "https://amzn.to/...",
--   "image_url": "...",
--   "price": 89.99,
--   "stripe_product_id": "prod_..."
-- }
```

**Component Requirements:**
```
src/components/AffiliateGearModule.tsx (NEW):
  - Fetch gear from destination.affiliate_gear or API
  - Display 2-4 product cards
  - Link to affiliate URLs or Stripe checkout
  - Track clicks for attribution
  - Fallback to generic "Utah Adventure Gear" if no specific items
```

**Integration Points:**
```
src/pages/destination/slug.tsx:
  - Add <AffiliateGearModule destinationId={destination.id} />
  - Position after main content, before "Nearby Destinations"

src/components/DestinationPage.tsx:
  - Add gear module to template layout
```

---

### 3. TripKit Marketplace Enhancements

**Goal:** Simple grid/list with clear pricing and descriptions

**Current Status:** ✅ Mostly complete, needs inventory expansion

**Suggested Canonical Kits to Add:**
1. ✅ Free Explorer (already exists)
2. ➕ "Seasonal Highlights: Winter Olympics Preview" ($19)
3. ➕ "Weekend Warriors: 48-Hour Utah Sampler" ($29)
4. ➕ "National Parks Circuit" ($39)
5. ➕ "Hidden Gems: Off-the-Beaten-Path" ($49)

**TripKit Schema Needs:**
```typescript
interface TripKit {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;  // 0 for free
  tier: "Free" | "Premium" | "Elite";
  destinationCount: number;
  destinations: Destination[];  // Array of destination IDs/objects
  estimatedTime: string;
  difficultyLevel: string;
  status: "Available Now" | "Coming Soon";
  featured: boolean;
  coverImageUrl: string;
  features: string[];
  stripeProductId?: string;  // For paid kits
  stripePriceId?: string;
}
```

**Component Modifications:**
```
src/pages/tripkits.tsx:
  - Expand tripKits array with 2-3 more canonical kits
  - Add status badges more prominently
  - Link "Get Free Kit" to download/email capture flow
  - Link premium kits to Stripe checkout

src/pages/tripkits/[id].tsx (NEW):
  - TripKit detail page with full destination list
  - Interactive map of all destinations
  - Download/purchase CTA
  - Preview of included content
```

---

### 4. Simplify Brand Lore

**Goal:** Remove/archive Olympian storyline, de-emphasize extra narrative

**Changes:**
- ❌ Archive `mt-olympians.tsx` (move to `/archive` folder)
- ❌ Archive `olympians-atlas-landing.tsx`
- ❌ Remove `olympic-spotlight.tsx` OR simplify to single line mention
- ✅ Keep Olympic venue flags in destination data (subtle mention only)
- ❌ Remove Dan section or reduce to 1-2 sentence bio + small avatar

**Navigation Updates:**
```
src/components/navigation.tsx:
  - Remove "Olympians" menu item
  - Keep: Destinations, TripKits, About
```

---

## PAGE FLOW MOCK

### Updated User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Header: Logo + "From Salt Lake, to Everywhere"            │ │
│  │  Subhead: "1 Airport * 1000+ Destinations"                 │ │
│  │  Drive-time chips: 30min | 1hr | 2hrs | 4hrs | 6hrs+      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SEARCH BAR (NEW)                                          │ │
│  │  🔍 "Search destinations by name, activity, or vibe..."   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  BULLS-EYE EXPLORER                                        │ │
│  │  Interactive concentric rings (30min → 6hrs+)              │ │
│  │  Click ring → filter destinations by drive time           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  FEATURED DESTINATIONS                                     │ │
│  │  Grid of 6-8 curated picks (dynamic from Supabase)        │ │
│  │  "View All Destinations" button                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  TRIPKIT PREVIEW (NEW/ENHANCED)                            │ │
│  │  "Curated Adventure Kits - Free & Premium"                │ │
│  │  Featured: Free Explorer + 2 premium kits                 │ │
│  │  "Browse All TripKits" button                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
              ↓ Click "View All Destinations"
┌─────────────────────────────────────────────────────────────────┐
│                     DESTINATIONS INDEX                          │
│  Filters: Search, Category, Subcategory, Drive Time, Sort      │
│  Grid: 50+ destinations with photos, ratings, drive times      │
│  Click destination card → Destination Detail                   │
└─────────────────────────────────────────────────────────────────┘
              ↓ Click destination card
┌─────────────────────────────────────────────────────────────────┐
│                   DESTINATION DETAIL PAGE                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Hero: Photo gallery + Name + Drive time + Rating         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Description + Highlights + Best time to visit            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Map (Google Maps embed or static)                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AFFILIATE GEAR MODULE (NEW)                              │ │
│  │  "Gear You Might Need for This Adventure"                │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │ │
│  │  │ Gear │ │ Gear │ │ Gear │ │ Gear │                    │ │
│  │  │ Card │ │ Card │ │ Card │ │ Card │                    │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                    │ │
│  │  Links to affiliate/Stripe                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Nearby Destinations (related picks)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
              ↓ Click "Browse TripKits" from nav/home
┌─────────────────────────────────────────────────────────────────┐
│                     TRIPKIT MARKETPLACE                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Featured: Free Explorer (hero card)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Grid: 5-6 TripKits (Free + Premium)                      │ │
│  │  Each card: Name, Price, Destination count, Difficulty    │ │
│  │  Status badges: "Available Now" vs "Coming Soon"          │ │
│  └────────────────────────────────────────────────────────────┘ │
│  Click kit card → TripKit Detail                              │
└─────────────────────────────────────────────────────────────────┘
              ↓ Click TripKit card
┌─────────────────────────────────────────────────────────────────┐
│                    TRIPKIT DETAIL PAGE (NEW)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Hero: Cover image + Name + Price + Tagline              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Description + Features list + Value proposition          │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Map: All destinations in kit (interactive)               │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Destination List: Cards for each included destination    │ │
│  │  (Link to full destination detail pages)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  CTA: "Download Free Kit" OR "Purchase for $XX"          │ │
│  │  (Links to email capture or Stripe checkout)              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT CHECKLIST: Dynamic vs Static

### Dynamic Components (Supabase/API Data Required)

#### Destinations
- ✅ **FeaturedDestinations** - `src/components/featured-destinations.tsx`
  - Data: `fetchDestinations()` filtered by `isFeatured`
  - Fields: `id, name, photoUrl, description_short, driveTime, rating, slug`

- ✅ **Destinations Index** - `src/pages/destinations.tsx`
  - Data: `fetchDestinations()` with filters
  - Fields: All destination fields for search/filter/sort

- ✅ **Destination Detail Page** - `src/pages/destination/slug.tsx`
  - Data: `/api/destinations/[slug]`
  - Fields: Full destination schema (see validateDestination.ts)

- ❌ **AffiliateGearModule** - NEW COMPONENT NEEDED
  - Data: `destination.affiliate_gear` (JSONB field) OR new API endpoint
  - Fields: `product_name, affiliate_link, image_url, price, stripe_product_id`
  - **MISSING FROM SCHEMA** - needs to be added

#### TripKits
- ⚠️ **TripKits Index** - `src/pages/tripkits.tsx`
  - Data: Currently hardcoded array
  - **TODO:** Connect to Supabase `tripkits` table (doesn't exist yet)

- ❌ **TripKit Detail Page** - `src/pages/tripkits/[id].tsx`
  - Data: Fetch single TripKit by ID with included destinations
  - **MISSING COMPONENT** - needs to be created
  - **MISSING API** - `/api/tripkits/[id]` doesn't exist

### Static Components (Fixed Copy/UI Only)

- ✅ **DriveTimeHero** - `src/components/drive-time-hero.tsx`
  - Static: Brand tagline, drive-time chips
  - Uses: `brand.tagline`, `brand.destinations` from `brand.ts`

- ✅ **BullsEyeExplorerClean** - `src/components/bulls-eye-explorer-clean.tsx`
  - Static: SVG rings, drive-time labels
  - Interactive: Click handlers navigate to `/destinations?driveTime=X`

- ✅ **Navigation** - `src/components/navigation.tsx`
  - Static: Menu items, logo
  - Uses: `brand.taglineParts` from `brand.ts`
  - **TODO:** Remove Olympians menu item

- ✅ **Footer** - `src/components/footer.tsx`
  - Static: Links, copyright, social icons

### Components to Archive/Remove

- ❌ **OlympicSpotlight** - `src/components/olympic-spotlight.tsx`
  - Action: Archive or reduce to single mention

- ❌ **Dan Section** - `src/pages/landing.tsx` (lines 28-53)
  - Action: Remove or reduce to 1-2 sentences

---

## MISSING SUPABASE/API FIELDS & ENDPOINTS

### Schema Gaps

#### 1. Affiliate Gear (CRITICAL GAP)
**Current:** No affiliate gear fields in `destinations` table

**Option A: JSON Field (Simpler)**
```sql
ALTER TABLE destinations
ADD COLUMN affiliate_gear JSONB DEFAULT '[]';

-- Example data:
UPDATE destinations SET affiliate_gear = '[
  {
    "product_name": "Trail Running Shoes",
    "description": "Lightweight shoes perfect for Utah trails",
    "affiliate_link": "https://amzn.to/xyz123",
    "image_url": "https://...",
    "price": 89.99,
    "category": "Footwear"
  },
  {
    "product_name": "Hydration Pack",
    "affiliate_link": "https://amzn.to/abc456",
    "image_url": "https://...",
    "price": 45.00,
    "category": "Gear"
  }
]' WHERE id = 1;
```

**Option B: Separate Table (More Scalable)**
```sql
CREATE TABLE destination_affiliate_gear (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  affiliate_link TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2),
  stripe_product_id TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_destination_gear ON destination_affiliate_gear(destination_id);
```

#### 2. TripKits Table (NEEDED FOR MARKETPLACE)
**Current:** No TripKits table exists

**Required Schema:**
```sql
CREATE TABLE tripkits (
  id SERIAL PRIMARY KEY,
  external_id TEXT UNIQUE,  -- For URL slugs
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  value_proposition TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  tier TEXT DEFAULT 'Free',  -- Free, Premium, Elite
  destination_count INTEGER DEFAULT 0,
  estimated_time TEXT,
  difficulty_level TEXT,
  status TEXT DEFAULT 'Available Now',  -- Available Now, Coming Soon
  featured BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  features JSONB DEFAULT '[]',  -- Array of feature strings
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tripkit_destinations (
  id SERIAL PRIMARY KEY,
  tripkit_id INTEGER REFERENCES tripkits(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  UNIQUE(tripkit_id, destination_id)
);

CREATE INDEX idx_tripkit_destinations ON tripkit_destinations(tripkit_id);
```

### API Endpoints Needed

#### 1. Affiliate Gear Endpoint
```
GET /api/destinations/[id]/gear
Response: [
  {
    product_name: "...",
    affiliate_link: "...",
    image_url: "...",
    price: 89.99,
    category: "..."
  }
]
```

#### 2. TripKits Endpoints
```
GET /api/tripkits
Response: Array of all TripKits

GET /api/tripkits/[id]
Response: Single TripKit with included destinations array

POST /api/tripkits/[id]/purchase (for paid kits)
Body: { email, stripe_payment_intent_id }
Response: { success, download_url }
```

---

## IMPLEMENTATION PLAN

### Phase 1: Cleanup & Simplification (2-3 hours)
1. ✅ Archive Olympian pages to `/archive` folder
2. ✅ Remove Olympian menu items from navigation
3. ✅ Simplify/remove Dan section from landing page
4. ✅ Add SearchBar component to landing page
5. ✅ Clean up brand lore references throughout

### Phase 2: Affiliate Gear Module (3-4 hours)
1. ✅ Add `affiliate_gear` JSONB field to destinations table
2. ✅ Create `AffiliateGearModule.tsx` component
3. ✅ Integrate module into destination detail page
4. ✅ Seed 5-10 destinations with sample affiliate products
5. ✅ Test affiliate link tracking

### Phase 3: TripKit Enhancements (4-5 hours)
1. ✅ Create `tripkits` and `tripkit_destinations` tables
2. ✅ Seed database with 5-6 canonical kits
3. ✅ Create `/api/tripkits` and `/api/tripkits/[id]` endpoints
4. ✅ Create `src/pages/tripkits/[id].tsx` detail page
5. ✅ Update tripkits index to pull from database
6. ✅ Add TripKit preview section to landing page

### Phase 4: Polish & QA (2-3 hours)
1. ✅ Visual QA on all updated pages
2. ✅ Test dynamic data flows
3. ✅ Verify brand.ts usage throughout
4. ✅ Update navigation and footer links
5. ✅ Deploy to Vercel and smoke test

---

## SUCCESS CRITERIA

### Must Have (P0)
- ✅ Landing page has clean search bar
- ✅ Destination detail pages show affiliate gear module
- ✅ TripKit marketplace displays 5+ kits with pricing
- ✅ TripKit detail pages exist with full destination lists
- ✅ Olympian storyline removed/archived
- ✅ Dan section simplified or removed
- ✅ All brand copy uses `brand.ts` imports

### Should Have (P1)
- ✅ FeaturedDestinations enhanced with better imagery
- ✅ TripKit preview section on landing page
- ✅ Affiliate gear links to Stripe or Amazon
- ✅ Email capture for Free Explorer kit
- ✅ Search bar has autocomplete

### Nice to Have (P2)
- Interactive map on TripKit detail pages
- Gear recommendations algorithm (ML-based)
- User reviews/ratings for TripKits
- Download receipts for purchased kits

---

## ROLLBACK PLAN

1. Archive work to feature branch: `feature/marketplace-reorientation`
2. Keep main branch stable with current state
3. Incremental merges after each phase
4. Database migrations reversible via down scripts

---

**Next Steps:**
1. Review and approve this plan
2. Create Supabase migration scripts for new fields/tables
3. Begin Phase 1 (cleanup) immediately
4. Assign development resources to Phases 2-4

---

*Issue created by Claude (Lead Auditor) - 2025-10-06*
*Coordination: AUDIT/notes.md*
