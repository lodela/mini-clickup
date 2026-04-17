# Locales Guidelines

## Overview

Internationalization (i18n) translation files for multi-language support.

## Structure

```
client/src/locales/
├── en.json     # English translations
└── es.json     # Spanish translations
```

## Where to Look

| Task             | Location                               |
| ---------------- | -------------------------------------- |
| English text     | `en.json`                              |
| Spanish text     | `es.json`                              |
| Adding languages | Create new `{lang}.json` file          |
| Nested keys      | Use dot notation (e.g., `navbar.home`) |

## Conventions

- File naming: `{language_code}.json` (e.g., `en.json`, `es.json`)
- JSON structure: Flat or nested key-value pairs
- Key naming: Use dot notation for hierarchy (e.g., `common.save`, `navbar.settings`)
- String values: Plain text, no HTML (use React components for formatting)
- Plurals: Use i18next plural syntax (e.g., `"{{count}} task": ["no tasks", "one task", "{{count}} tasks"]`)
- Nesting: Prefer flat structure for simplicity, nest only when logical
- Updates: Add new keys to ALL language files simultaneously
- Missing keys: Fallback to default language (English)

## Anti-Patterns

- Inconsistent keys: Missing keys in some language files cause fallback issues
- HTML in strings: Avoid putting HTML in translation values
- Over-nesting: Deeply nested objects make keys hard to manage
- Magic strings: Use constants for frequently used keys in code
- Ignoring context: Same key used in different contexts with different meanings
- Hardcoded language: Don't assume user language, detect from browser/prefs

## Notes

- Uses i18next library for translation
- Language detection: Browser language or user preference
- Fallback chain: es → en (if Spanish missing, use English)
- Namespace: Currently using single namespace, consider splitting for large apps
- Date/number formatting: Use i18next formatting functions, not manual string manipulation
