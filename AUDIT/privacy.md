# PRIVACY POLICY - DRAFT

**Effective Date:** TBD
**Last Updated:** 2025-10-06
**Status:** DRAFT - NOT PUBLISHED

---

## 1. DATA INVENTORY

### What Data We Collect

#### Current (Phase 2 - Live)
**Public Website Use:**
- ✅ **None** - We currently collect no personal information
- ✅ Server logs (Vercel): IP addresses, request timestamps, page URLs (retained 7 days)
- ✅ No cookies, no tracking pixels, no analytics

**Affiliate Links:**
- ✅ Amazon Associates: When you click an affiliate link, Amazon receives your referral URL
- ✅ We do not receive any personal information from Amazon

#### Planned (Phase 3 - TripKit Marketplace)
**Email Capture (Free Explorer Kit):**
- 📧 Email address (required)
- 📧 Name (optional)
- 📧 IP address (automatic, for spam prevention)
- 📧 Subscription timestamp
- 📧 Consent checkbox state (GDPR compliance)

**Paid TripKit Purchases (Stripe):**
- 💳 Email address (for receipt)
- 💳 Payment details (processed by Stripe, never stored on our servers)
- 💳 Billing address (if required by payment method)
- 💳 Order history (kit ID, purchase date, price)
- 💳 IP address (automatic, fraud prevention)

**Analytics (if implemented):**
- 📊 Page views (anonymous)
- 📊 Referral sources
- 📊 Device type (mobile/desktop)
- 📊 Approximate location (city-level, via IP)

---

## 2. HOW WE USE YOUR DATA

### Current Use
- ✅ **Server logs only:** Used for debugging and security (7-day retention)
- ✅ **Affiliate revenue:** Amazon tracks clicks for commission purposes (their privacy policy applies)

### Planned Use (Phase 3)
**Email Addresses:**
- Send Free Explorer kit download link
- Send occasional product updates (opt-in required)
- Customer support communications

**Payment Data (via Stripe):**
- Process TripKit purchases
- Send order confirmation emails
- Handle refunds if requested

**Analytics:**
- Improve website performance
- Understand popular destinations
- Optimize content strategy

---

## 3. DATA SHARING

### Who We Share With

**Current:**
- ✅ **Vercel (Hosting):** Server logs for 7 days
- ✅ **Supabase (Database):** Public destination data only (no PII)
- ✅ **Amazon Associates:** Referral data when you click affiliate links

**Planned (Phase 3):**
- 📧 **Email Service Provider (TBD: ConvertKit/Mailchimp/Resend):** Email addresses for newsletter delivery
- 💳 **Stripe (Payments):** Payment and order data for transaction processing
- 📊 **Analytics Provider (TBD: Plausible/Fathom):** Anonymous usage data (if implemented)

**We will NEVER:**
- ❌ Sell your email address
- ❌ Share your data with advertisers
- ❌ Send spam or unsolicited marketing (beyond what you opt into)

---

## 4. YOUR RIGHTS (GDPR/CCPA Compliance)

### For EU Residents (GDPR)
You have the right to:
- **Access:** Request a copy of all data we hold about you
- **Rectification:** Correct inaccurate data
- **Erasure ("Right to be Forgotten"):** Request deletion of your data
- **Portability:** Receive your data in a machine-readable format
- **Withdraw Consent:** Unsubscribe from emails at any time

**How to exercise rights:** Email privacy@slctrips.com (TBD: set up email)

### For California Residents (CCPA)
You have the right to:
- Know what personal information we collect
- Request deletion of your personal information
- Opt-out of data "sales" (we don't sell data, so this doesn't apply)

**Non-Discrimination:** We will not discriminate against you for exercising your privacy rights

---

## 5. DATA RETENTION

### Current Policy
- **Server logs:** 7 days (Vercel default)
- **Public destination data:** Indefinite (public catalog)

### Planned Policy (Phase 3)
- **Email subscribers:** Until unsubscribe + 30 days (for processing)
- **Order data:** 7 years (tax compliance requirement)
- **Support tickets:** 2 years after resolution
- **Analytics:** 90 days (anonymous aggregates only)

---

## 6. COOKIES & TRACKING

### Current Status
- ✅ **No cookies used**
- ✅ **No tracking scripts** (Google Analytics, Facebook Pixel, etc.)
- ✅ **No fingerprinting**

### Planned (if analytics implemented)
- 📊 **Analytics cookie** (optional, privacy-friendly provider like Plausible)
- 📊 **Consent banner** will appear before any tracking
- 📊 **Opt-out mechanism** will be provided

---

## 7. SECURITY MEASURES

### Current Protections
- ✅ HTTPS encryption (all pages)
- ✅ Supabase Row Level Security (RLS) policies
- ✅ No user passwords stored (no auth system yet)
- ✅ Vercel serverless functions (isolated execution)

### Planned Protections (Phase 3)
- 🔒 Stripe PCI DSS compliance (payment data never touches our servers)
- 🔒 Email encryption in transit (TLS)
- 🔒 Regular security audits
- 🔒 Data breach notification plan (72-hour GDPR requirement)

---

## 8. THIRD-PARTY SERVICES

### Current
**Vercel (Hosting)**
- Privacy Policy: https://vercel.com/legal/privacy-policy
- Data: Server logs (7 days)

**Supabase (Database)**
- Privacy Policy: https://supabase.com/privacy
- Data: Public destinations, affiliate products (no PII)

**Amazon Associates (Affiliate Program)**
- Privacy Policy: https://www.amazon.com/gp/help/customer/display.html?nodeId=468496
- Data: Referral clicks, cookies (set by Amazon)

**Unsplash (Images)**
- Privacy Policy: https://unsplash.com/privacy
- Data: Image CDN requests (no PII)

### Planned (Phase 3)
**Stripe (Payments)**
- Privacy Policy: https://stripe.com/privacy
- Data: Payment details, billing address

**Email Service Provider (TBD)**
- Privacy Policy: TBD
- Data: Email addresses, subscription preferences

---

## 9. CHILDREN'S PRIVACY

- We do not knowingly collect data from children under 13 (COPPA compliance)
- Our service is intended for adults planning travel
- If we discover data from a child under 13, we will delete it immediately

---

## 10. INTERNATIONAL TRANSFERS

**Current:** All data stored in US (Vercel/Supabase default regions)

**EU Users:** Data may be transferred to US servers (Vercel, Stripe)
- We will implement Standard Contractual Clauses (SCCs) before Phase 3
- EU users will be notified of data transfer during sign-up

---

## 11. CHANGES TO THIS POLICY

- We will notify users of significant changes via email (if we have their address)
- "Last Updated" date at top of policy will change
- Continued use of site after changes = acceptance

---

## 12. CONTACT US

**Privacy Questions:** privacy@slctrips.com (TBD: set up)
**Data Requests:** privacy@slctrips.com
**General Support:** support@slctrips.com (TBD: set up)

**Mailing Address:**
SLCTrips
[Address TBD]
Salt Lake City, UT [ZIP]

---

## COMPLIANCE CHECKLIST

### Required Before Phase 3 Launch
- [ ] Set up privacy@slctrips.com email
- [ ] Choose email service provider (ConvertKit/Mailchimp/Resend)
- [ ] Sign Stripe data processing agreement
- [ ] Implement GDPR consent checkbox on email forms
- [ ] Add "Unsubscribe" link to all emails
- [ ] Create data export mechanism (GDPR Art. 20)
- [ ] Create data deletion mechanism (GDPR Art. 17)
- [ ] Add cookie consent banner (if analytics added)
- [ ] Link privacy policy in footer (all pages)
- [ ] Link privacy policy on email capture form
- [ ] Link privacy policy at Stripe checkout

### Optional (Recommended)
- [ ] Implement privacy-friendly analytics (Plausible/Fathom)
- [ ] Add "Do Not Track" browser signal respect
- [ ] Conduct privacy impact assessment (PIA)
- [ ] Legal review (especially for EU/California compliance)

---

## DRAFT NOTES (Remove before publishing)

**Open Questions:**
1. Do we want to collect analytics? If yes, which provider? (Recommend: Plausible - privacy-friendly, GDPR-compliant, no cookies)
2. Which email service? (Recommend: ConvertKit - simple, GDPR features, good deliverability)
3. Do we need Terms of Service before Phase 3? (YES - required for paid products)
4. Refund policy for TripKits? (Recommend: 30-day money-back guarantee)

**Legal Review Needed:**
- GDPR compliance (EU users)
- CCPA compliance (California users)
- Terms of Service (paid products)
- Affiliate disclosure language
- Refund policy

**Technical TODOs:**
- [ ] Set up privacy email forwarding
- [ ] Implement data export API endpoint
- [ ] Implement data deletion API endpoint
- [ ] Add consent tracking to database
- [ ] Add IP anonymization to analytics (if implemented)

---

*Privacy policy draft by Claude (Lead Auditor)*
*Last updated: 2025-10-06*
*Status: DRAFT - Requires legal review before publication*
