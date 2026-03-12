import type { TranslationDict } from '~/contexts/LanguageContext';
import { useTranslation } from './useTranslation';

/**
 * Convenience hook that loads the 'ui' translation namespace for the current language.
 *
 * Prefer LanguageContext.t() for UI strings already loaded at SSR time.
 * This hook is provided for consistency with other namespace hooks and for cases
 * where the UI namespace must be loaded independently (e.g. isolated components).
 *
 * @returns The flat UI translation dict, or null while loading / on error.
 */
export function useUITranslation(): TranslationDict | null {
  return useTranslation('ui');
}
