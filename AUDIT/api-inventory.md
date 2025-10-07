# API INVENTORY - SLCTrips

**Date:** 2025-10-06
**Purpose:** Security audit and privacy compliance documentation
**Status:** IN PROGRESS

---

## API ENDPOINTS

### Destinations API

#### `GET /api/destinations/gear`
**Purpose:** Fetch affiliate gear recommendations for a specific destination
**Parameters:**
- `id` (required) - Destination UUID

**Response:** JSON array of affiliate products
```json
[
  {
    "id": 21,
    "product_name": "Nikon Monarch 7 Binoculars 10x42",
    "product_description": "Premium birding binoculars...",
    "category": "Electronics",
    "affiliate_link": "https://amzn.to/nikonbinoculars",
    "image_url": "https://images.unsplash.com/...",
    "price": "449.99",
    "featured": true,
    "brand": "Nikon",
    "tags": ["wildlife", "premium", "bestseller"]
  }
]
```

**Database Table:** `destination_affiliate_gear`
**RLS Policy:** Public read for active=true products only
**Security Features:**
- Input validation (UUID format required)
- Filtered to active products only
- Rate limiting: TBD (recommended: 100 req/min per IP)
- CORS: Vercel default (same-origin)

**Privacy Considerations:**
- No PII collected
- Affiliate links contain no tracking tokens beyond standard Amazon Associates
- Links use `rel="noopener noreferrer nofollow"` for privacy/SEO

**Files:**
- Endpoint: `/client/api/destinations/gear.js`
- Component: `/client/src/components/AffiliateGearModule.tsx`
- Integration: `/client/src/components/category-templates/CategoryTemplateEngine.tsx`

**Status:** ✅ Deployed and operational (as of 2025-10-06)

---

## PLANNED ENDPOINTS (Phase 3)

### TripKits API

#### `GET /api/tripkits`
**Purpose:** List all TripKits (free and premium)
**Status:** NOT IMPLEMENTED
**Required for:** Phase 3 TripKit Marketplace

#### `GET /api/tripkits/:id`
**Purpose:** Get TripKit details including destination list
**Status:** NOT IMPLEMENTED
**Required for:** Phase 3 TripKit detail pages

#### `POST /api/tripkits/:id/subscribe`
**Purpose:** Email capture for Free Explorer kit
**Status:** NOT IMPLEMENTED
**Privacy Impact:** HIGH - Collects email addresses
**Required Compliance:**
- GDPR consent checkbox
- Privacy policy link
- Email service provider integration (ConvertKit/Mailchimp/Resend)
- Data retention policy
- Unsubscribe mechanism

#### `POST /api/tripkits/:id/checkout`
**Purpose:** Create Stripe checkout session for paid kits
**Status:** NOT IMPLEMENTED
**Privacy Impact:** HIGH - Collects payment info (via Stripe)
**Required Compliance:**
- PCI DSS compliance (handled by Stripe)
- Terms of service acceptance
- Privacy policy link
- Refund policy display
- Stripe webhook for order confirmation

---

## EXTERNAL SERVICES

### Supabase (Database & Auth)
**URL:** `process.env.SUPABASE_URL`
**API Key:** `process.env.SUPABASE_ANON_KEY` (public, RLS-protected)
**Data Stored:**
- `destinations` table - Public destination data
- `destination_affiliate_gear` table - Public product recommendations
- Future: `tripkits`, `tripkit_destinations`, `email_subscribers`, `orders`

**Privacy Compliance:**
- RLS policies enforce public read-only access
- No user authentication required for public endpoints
- Future: authenticated write access for admin panel

### Amazon Associates (Affiliate Links)
**Partner ID:** TBD (embedded in affiliate_link URLs)
**Data Shared:**
- Referral URL (which page user came from)
- User click timestamp (via Amazon tracking)
- No PII from SLCTrips side

**Privacy Policy Note:** Must disclose Amazon Associates participation

### Stripe (Payment Processing)
**Status:** NOT IMPLEMENTED
**Planned Integration:** Checkout sessions for TripKit purchases
**Data Shared:**
- User email (for receipt)
- Payment details (handled entirely by Stripe)
- Order metadata (kit ID, user IP via Stripe)

**Privacy Policy Note:** Must disclose Stripe data processing

### Unsplash (Product Images)
**Usage:** Placeholder images for affiliate products
**Privacy:** No user data shared (images loaded client-side)
**License:** Free tier, attribution not required for web use

---

## RATE LIMITING & SECURITY

### Current Status
- [ ] Rate limiting NOT implemented
- [ ] API key authentication NOT required (public endpoints)
- [ ] Request logging NOT implemented
- [ ] DDoS protection: Vercel default only

### Recommendations
1. **Implement rate limiting:**
   - 100 requests/minute per IP for `/api/destinations/gear`
   - Use Vercel Edge Config or Redis for tracking

2. **Add request logging:**
   - Log IP, endpoint, timestamp, response time
   - Privacy: Anonymize IPs after 30 days

3. **Add monitoring:**
   - Alert on unusual traffic patterns
   - Monitor error rates (5xx responses)

---

## CORS & HEADERS

### Current Configuration
**CORS:** Vercel default (same-origin only)
**Security Headers:** TBD

### Recommended Headers
```javascript
// /api/destinations/gear.js (add to response)
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
```

---

## DATA RETENTION

### Current Policy
- **Affiliate product data:** Indefinite (public catalog)
- **API logs:** None (not implemented)
- **User data:** None collected (public endpoints only)

### Future Policy (Phase 3+)
- **Email subscribers:** Retain until unsubscribe + 30 days
- **Order data:** Retain 7 years (tax compliance)
- **API logs:** 90 days, then anonymize/delete
- **User sessions:** 24 hours (if auth implemented)

---

## PRIVACY IMPACT SUMMARY

### Current Risk Level: **LOW**
- No PII collected
- No user authentication
- Public data only
- Affiliate links disclosed

### Phase 3 Risk Level: **MEDIUM-HIGH**
- Email collection (Free Explorer)
- Payment processing (Paid TripKits)
- User order history
- Potential GDPR/CCPA compliance required

### Required Before Phase 3:
1. ✅ Privacy Policy page (link in footer)
2. ✅ Terms of Service page
3. ✅ Cookie consent banner (if tracking cookies used)
4. ✅ GDPR consent checkbox (EU users)
5. ✅ Data deletion request process
6. ✅ Email unsubscribe mechanism

---

## COMPLIANCE CHECKLIST

### Current State (Phase 2)
- [x] Affiliate links disclosed (disclaimer in module)
- [x] nofollow attributes on affiliate links
- [ ] Privacy Policy published (PENDING - /AUDIT/privacy.md stub)
- [ ] Terms of Service published (PENDING)
- [ ] Cookie Policy (PENDING - currently no cookies)

### Required for Phase 3
- [ ] Email service provider GDPR agreement
- [ ] Stripe PCI compliance review
- [ ] GDPR data processing agreement
- [ ] CCPA compliance review (California users)
- [ ] Data breach notification plan
- [ ] User data export mechanism (GDPR Art. 20)
- [ ] User data deletion mechanism (GDPR Art. 17)

---

## AUDIT TRAIL

**2025-10-06:** Initial API inventory created
**2025-10-06:** `/api/destinations/gear` documented (Phase 2 deployed)
**PENDING:** Phase 3 TripKit endpoints specification
**PENDING:** Privacy policy stub creation
**PENDING:** Security headers implementation

---

**Next Steps:**
1. Create `/AUDIT/privacy.md` stub with data inventory
2. Update `/AUDIT/checklists.md` with security checklist
3. Plan Phase 3 compliance requirements
4. Review with legal (if needed for email/payment collection)

---

*API inventory maintained by Claude (Lead Auditor)*
*Last updated: 2025-10-06*
