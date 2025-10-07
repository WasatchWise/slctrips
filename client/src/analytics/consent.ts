// analytics/consent.ts
/**
 * Lightweight consent management for GDPR/CCPA compliance
 * No tracking before explicit user consent
 */

export const hasConsent = (): boolean => {
  if (typeof globalThis.localStorage === 'undefined') return false;
  return globalThis.localStorage?.getItem("slctrips_consent") === "yes";
};

export const grantConsent = (): void => {
  if (typeof globalThis.localStorage === 'undefined') return;
  globalThis.localStorage.setItem("slctrips_consent", "yes");
};

export const revokeConsent = (): void => {
  if (typeof globalThis.localStorage === 'undefined') return;
  globalThis.localStorage.removeItem("slctrips_consent");
};

export const whenConsented = (fn: () => void): void => {
  if (hasConsent()) {
    fn();
  }
};

// Usage example:
// whenConsented(() => initAnalytics());
// whenConsented(() => loadGoogleMaps());
