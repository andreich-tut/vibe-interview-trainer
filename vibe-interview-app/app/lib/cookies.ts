import { DEFAULT_LANGUAGE, LANG_COOKIE, isValidLanguage } from './i18n';
import type { Language } from './i18n';

/**
 * Parses the cookie string from a Request header and returns the value for a given key.
 * Works in both server (SSR) and edge environments.
 */
function parseCookieHeader(cookieHeader: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rest] = part.split('=');
    const key = rawKey.trim();
    if (key) {
      result[key] = decodeURIComponent(rest.join('=').trim());
    }
  }
  return result;
}

/**
 * Server-side: reads the language cookie from an incoming Request object.
 * Returns null if the cookie is absent or contains an invalid language value.
 */
export function getLanguageCookie(request: Request): Language | null {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  if (!cookieHeader) return null;
  const cookies = parseCookieHeader(cookieHeader);
  const value = cookies[LANG_COOKIE];
  return value ? validateLanguageFromCookie(value) : null;
}

/**
 * Client-side: sets the language cookie in document.cookie.
 * Cookie is scoped to root path, expires in 365 days, SameSite=Lax.
 */
export function setLanguageCookie(lang: Language): void {
  const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Validates a raw cookie value against the supported language list.
 * Returns the typed Language or null if invalid.
 */
export function validateLanguageFromCookie(value: string): Language | null {
  const trimmed = value.trim();
  return isValidLanguage(trimmed) ? trimmed : null;
}

/**
 * Resolves the active language from a Request, falling back to DEFAULT_LANGUAGE.
 */
export function resolveLanguage(request: Request): Language {
  return getLanguageCookie(request) ?? DEFAULT_LANGUAGE;
}
