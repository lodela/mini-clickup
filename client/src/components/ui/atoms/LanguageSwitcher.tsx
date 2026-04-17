/**
 * LanguageSwitcher Atom Component
 * 
 * Language toggle between Spanish (ES) and English (EN).
 * Integrates with i18next for language switching.
 * 
 * @param currentLanguage - Current active language code ('es' or 'en')
 * @param onLanguageChange - Callback when language is changed
 */

import { Button } from './Button';

interface LanguageSwitcherProps {
  currentLanguage: 'es' | 'en';
  onLanguageChange: (language: 'es' | 'en') => void;
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange 
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] p-1">
      {/* Spanish Button */}
      <Button
        variant={currentLanguage === 'es' ? 'primary' : 'ghost'}
        size="small"
        onClick={() => onLanguageChange('es')}
        ariaLabel="Cambiar a español"
        ariaPressed={currentLanguage === 'es'}
      >
        {/* Flag placeholder - will be replaced later */}
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
          🇪🇸
        </div>
        <span>ES</span>
      </Button>

      {/* English Button */}
      <Button
        variant={currentLanguage === 'en' ? 'primary' : 'ghost'}
        size="small"
        onClick={() => onLanguageChange('en')}
        ariaLabel="Switch to English"
        ariaPressed={currentLanguage === 'en'}
      >
        {/* Flag placeholder - will be replaced later */}
        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
          🇺🇸
        </div>
        <span>EN</span>
      </Button>
    </div>
  );
}