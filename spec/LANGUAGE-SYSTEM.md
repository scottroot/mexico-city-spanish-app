# Language System Documentation

## Overview

The Spanish Language Learning App features a comprehensive internationalization (i18n) system that allows users to switch between English and Spanish (Latinoamericano) interfaces. This system is designed to be accessible to users whether they are logged in or not, providing a seamless multilingual experience.

## Architecture

### Language Flow
```
User Selection → LanguageContext → Translation Files → UI Components
```

### Key Components

1. **LanguageContext**: Central state management for language preferences
2. **LanguageToggle**: UI component for language switching
3. **Translation Files**: JSON files containing all translatable text
4. **Translation Function**: `t()` function for accessing translations

## Implementation Details

### LanguageContext (`contexts/LanguageContext.js`)

The LanguageContext provides:
- **State Management**: Current language and loaded translations
- **Persistence**: Language preference saved to localStorage
- **Translation Function**: `t(key, fallback)` for accessing translations
- **Dynamic Loading**: Translations loaded asynchronously

#### Key Methods:
- `changeLanguage(langCode)`: Switch language and persist preference
- `t(key, fallback)`: Get translation for a key with fallback support

#### State:
- `language`: Current language code ('es' or 'en')
- `translations`: Loaded translation objects

### LanguageToggle Component (`components/ui/LanguageToggle.js`)

A dropdown component that:
- Shows current language with flag icon
- Provides language selection dropdown
- Handles click-outside-to-close behavior
- Accessible from all pages via header

#### Features:
- Visual feedback with flag icons (🇪🇸 for Spanish, 🇺🇸 for English)
- Responsive design (shows language name on desktop, flag only on mobile)
- Smooth animations and hover effects

### Translation Files

#### Structure (`lib/translations/`)
```
translations/
├── es.json    # Spanish (Latinoamericano) translations
└── en.json    # English translations
```

#### Organization:
Translations are organized by feature sections:
- `app`: App title and subtitle
- `navigation`: Navigation menu items
- `auth`: Authentication forms and messages
- `home`: Home page content
- `progress`: Progress tracking interface
- `games`: Game-related text
- `common`: Shared UI elements

#### Example Structure:
```json
{
  "app": {
    "title": "¡Español Divertido!",
    "subtitle": "Aprende español latinoamericano"
  },
  "navigation": {
    "games": "Juegos",
    "progress": "Progreso",
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión"
  },
  "auth": {
    "welcomeBack": "¡Bienvenido de vuelta!",
    "loginSubtitle": "Inicia sesión para continuar aprendiendo",
    "email": "Correo electrónico",
    "password": "Contraseña"
  }
}
```

## Usage Examples

### Basic Translation Usage
```javascript
import { useLanguage } from '@/contexts/LanguageContext'

function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  )
}
```

### Language Switching
```javascript
import { useLanguage } from '@/contexts/LanguageContext'

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  
  return (
    <button onClick={() => changeLanguage('en')}>
      Switch to English
    </button>
  )
}
```

### Conditional Rendering Based on Language
```javascript
import { useLanguage } from '@/contexts/LanguageContext'

function ConditionalContent() {
  const { language } = useLanguage()
  
  return (
    <div>
      {language === 'es' ? (
        <p>Contenido en español</p>
      ) : (
        <p>English content</p>
      )}
    </div>
  )
}
```

## Integration Points

### Layout Integration
The LanguageToggle is integrated into the main Layout component (`components/Layout.js`) and appears in the header alongside the user menu or login button.

### Component Integration
All UI components that display text have been updated to use the `t()` function:
- Authentication forms (Login, Signup, Forgot Password)
- Home page content
- Progress tracking interface
- Game cards and navigation
- Error messages and validation text

### Root Layout Integration
The LanguageProvider wraps the entire application in `app/layout.js`, ensuring language context is available throughout the app.

## Language Support

### Supported Languages
1. **Spanish (Latinoamericano)** - Default language
   - Code: `es`
   - Flag: 🇪🇸
   - Target: Latin American Spanish speakers

2. **English** - Secondary language
   - Code: `en`
   - Flag: 🇺🇸
   - Target: English speakers learning Spanish

### Language Persistence
- Language preference is saved to `localStorage` with key `app-language`
- Preference persists across browser sessions
- Defaults to Spanish if no preference is saved

## Development Guidelines

### Adding New Translations

1. **Add to both translation files**:
   ```json
   // es.json
   {
     "newSection": {
       "newKey": "Nuevo texto en español"
     }
   }
   
   // en.json
   {
     "newSection": {
       "newKey": "New text in English"
     }
   }
   ```

2. **Use in components**:
   ```javascript
   const { t } = useLanguage()
   return <p>{t('newSection.newKey')}</p>
   ```

### Translation Key Naming Convention
- Use descriptive, hierarchical keys
- Group related translations under common sections
- Use camelCase for key names
- Include context in key names when needed

### Fallback Handling
The `t()` function supports fallback values:
```javascript
t('key.that.might.not.exist', 'Default fallback text')
```

## Future Enhancements

### Planned Features
- **Additional Languages**: Support for more languages (Portuguese, French, etc.)
- **RTL Support**: Right-to-left language support
- **Pluralization**: Advanced pluralization rules
- **Date/Number Formatting**: Locale-specific formatting
- **Dynamic Loading**: Load translations on-demand

### Performance Optimizations
- **Translation Caching**: Cache frequently used translations
- **Bundle Splitting**: Split translation files by feature
- **Lazy Loading**: Load translations only when needed

## Testing

### Language Switching Tests
- Verify language toggle functionality
- Test persistence across page reloads
- Ensure all UI elements update correctly
- Test fallback behavior for missing translations

### Translation Coverage
- Ensure all user-facing text is translated
- Test both languages thoroughly
- Verify consistency between languages
- Check for missing or incomplete translations

---

*This language system documentation should be updated when changes are made to the internationalization system.*
