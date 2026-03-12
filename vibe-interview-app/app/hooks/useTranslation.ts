import { useState, useEffect, useRef } from 'react';
import type { Language } from '~/lib/i18n';
import { useLanguage } from '~/contexts/LanguageContext';
import type { TranslationDict } from '~/contexts/LanguageContext';

/**
 * Module-level cache: key is "{lang}/{namespace}", value is the resolved dict.
 * In-flight requests are stored as Promises to prevent duplicate fetches.
 */
const cache = new Map<string, TranslationDict | Promise<TranslationDict | null>>();

async function fetchNamespace(
  lang: Language,
  namespace: string,
  signal: AbortSignal,
): Promise<TranslationDict | null> {
  const url = `/content/${lang}/${namespace}.json`;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as TranslationDict;
    return data;
  } catch {
    // Network errors and AbortError both fall here
    return null;
  }
}

/**
 * Loads a translation namespace for the given language.
 *
 * @param namespace - The JSON filename without extension (e.g. "theory", "topics")
 * @param lang - Optional language override. Defaults to the current language from LanguageContext.
 * @returns The flat translation dict on success, or null while loading / on error.
 */
export function useTranslation(
  namespace: string,
  lang?: Language,
): TranslationDict | null {
  const { lang: ctxLang } = useLanguage();
  const resolvedLang: Language = lang ?? ctxLang;
  const cacheKey = `${resolvedLang}/${namespace}`;

  const [dict, setDict] = useState<TranslationDict | null>(() => {
    const cached = cache.get(cacheKey);
    if (cached === undefined) return null;
    if (cached instanceof Promise) return null;
    return cached;
  });

  // Keep a ref so the effect cleanup can compare against current key
  const cacheKeyRef = useRef(cacheKey);
  cacheKeyRef.current = cacheKey;

  useEffect(() => {
    const currentKey = cacheKey;

    // If already in cache as a resolved value, update state immediately
    const existing = cache.get(currentKey);
    if (existing !== undefined && !(existing instanceof Promise)) {
      setDict(existing);
      return;
    }

    const controller = new AbortController();

    const load = async (): Promise<void> => {
      let promise: Promise<TranslationDict | null>;

      if (existing instanceof Promise) {
        // Reuse the in-flight request
        promise = existing;
      } else {
        // Start a new fetch and store the promise so concurrent mounts share it
        promise = fetchNamespace(resolvedLang, namespace, controller.signal);
        cache.set(currentKey, promise);
      }

      const result = await promise;

      // Only update cache and state if this effect is still current
      if (controller.signal.aborted) return;

      if (result !== null) {
        cache.set(currentKey, result);
      } else {
        // Remove broken entry so a future retry can try again
        if (cache.get(currentKey) instanceof Promise) {
          cache.delete(currentKey);
        }
      }

      // Only update state if the key hasn't changed during the await
      if (cacheKeyRef.current === currentKey) {
        setDict(result);
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [cacheKey, resolvedLang, namespace]);

  return dict;
}
