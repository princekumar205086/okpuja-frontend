const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem("access");
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem("refresh");
}

export function setTokens(access: string, refresh?: string): void {
  if (!isBrowser) return;
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);

  // Sync cookies for Next.js middleware
  setCookie("access", access, 7);
  if (refresh) setCookie("refresh", refresh, 30);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  deleteCookie("access");
  deleteCookie("refresh");
  deleteCookie("userRole");
}

// --- cookie helpers ---
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;secure;samesite=lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
