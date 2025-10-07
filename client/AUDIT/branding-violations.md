# Branding Violations Report

**Date:** 2025-10-06
**Scanner:** Manual grep + brand-audit.mjs

---

## CRITICAL VIOLATIONS

### 1. Tagline Missing Comma (3 instances)

| File | Line | Current | Required |
|------|------|---------|----------|
| `src/components/mobile-menu.tsx` | 40 | "From Salt Lake to Everywhere" | "From Salt Lake, to Everywhere" |
| `src/pages/ContentDashboard.tsx` | 45 | "From Salt Lake to Everywhere" | "From Salt Lake, to Everywhere" |
| `src/pages/home-temp.tsx` | 33 | "From Salt Lake to Everywhere" | "From Salt Lake, to Everywhere" |

### 2. Incorrect Destination Count (1 instance)

| File | Line | Current | Required |
|------|------|---------|----------|
| `src/components/temp-auth-bypass.tsx` | 31 | "700+ Utah destinations" | "1 Airport * 1000+ Destinations" |

---

## VIOLATIONS FROM PREVIOUS AUDIT

*(From earlier grep results)*

| File | Line | Violation | Severity |
|------|------|-----------|----------|
| `src/components/seo-head.tsx` | 270 | "700+ destinations" | CRITICAL |
| `src/components/hero-section.tsx` | 21 | "+1000 Places" | HIGH |
| `src/pages/simple-landing.tsx` | 35 | "+1000 Places" | HIGH |
| `src/pages/simple-landing.tsx` | 197 | "1000 destinations" | MEDIUM |
| `src/pages/mt-olympians.tsx` | 176 | "+1000 Destinations" | MEDIUM |
| `src/pages/olympians-atlas-landing.tsx` | 105 | "+1000 Destinations" | MEDIUM |
| `src/pages/home-temp.tsx` | 186 | "1000+ destination database" | LOW |
| `src/pages/search.tsx` | 37 | "1000+ destinations" | LOW |
| `src/components/search.tsx` | 203 | "1000+ destinations" | LOW |

---

## TOTAL VIOLATIONS: 13

- **Tagline errors:** 3
- **Count errors:** 10

---

## NEXT ACTIONS

1. Run `npm install globby` (required for scripts)
2. Run `npm run brand:fix` to auto-correct violations
3. Run `npm run brand:audit` to verify zero violations
4. Commit changes with PR

---
