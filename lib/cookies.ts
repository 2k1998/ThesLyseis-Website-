const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
    if (!getCookie(name)) {
      localStorage.setItem(name, value);
    }
  } catch {
    try {
      localStorage.setItem(name, value);
    } catch {}
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    if (match) return decodeURIComponent(match.split("=")[1]);
  } catch {}
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${name}=; max-age=0; path=/`;
    localStorage.removeItem(name);
  } catch {}
}
