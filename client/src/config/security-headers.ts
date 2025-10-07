// config/security-headers.ts
// Drop into Next.js middleware or Vercel config
export const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()"
  },
  {
    key: "X-XSS-Protection",
    value: "0"
  }
];

export default securityHeaders;
