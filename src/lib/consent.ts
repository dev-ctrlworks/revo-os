const STORAGE_KEY = "revo-consent-v1";
const EVENT = "revo-consent-change";

export type Consent = "granted" | "denied";

export function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function getServerConsent(): Consent | null {
  return null;
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(new Event(EVENT));
}
