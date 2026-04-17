# Sign In Page - Figma Design Specifications

**Frame:** Sign In (0:6914)  
**Source:** CRM Woorkroom (Community) - Figma  
**Extracted:** 2026-03-17

---

## 🎨 Color Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--background-primary` | `#F4F9FE` | rgb(244, 249, 254) | Page background |
| `--card-background` | `#FFFFFF` | rgb(255, 255, 255) | Card background |
| `--primary-blue` | `#3F8CFF` | rgb(63, 140, 255) | Main button, links, accents |
| `--text-primary` | `#0A1628` | rgb(10, 22, 40) | Primary text |
| `--text-secondary` | `#7D8592` | rgb(125, 133, 146) | Secondary text, labels |
| `--border-input` | `#D9E0E6` | rgb(217, 224, 230) | Input borders |
| `--checkbox-border` | `#0A1628` | rgb(10, 22, 40) | Checkbox border |
| `--checkbox-checked` | `#3F8CFF` | rgb(63, 140, 255) | Checkbox checked fill |

---

## 📐 Layout

### Page Frame
- **Width:** 1440px
- **Height:** 820px
- **Background:** `#F4F9FE`

### Main Card
- **Width:** 440px
- **Height:** Auto (content-based)
- **Border Radius:** 24px
- **Shadow:** `drop-shadow(0px 6px 58px rgba(196, 203, 214, 0.104))`
- **Background:** `#FFFFFF`
- **Padding:** 48px

---

## 🔤 Typography

### Font Family
- **Primary:** `Nunito Sans`
- **Fallback:** `system-ui, -apple-system, sans-serif`

### Text Styles

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| Brand Title | 30px | 700 (Bold) | 40.92px | `#FFFFFF` (on dark) |
| Card Title | 28px | 700 (Bold) | 36px | `#0A1628` |
| Subtitle | 16px | 400 (Regular) | 21.82px | `#7D8592` |
| Input Label | 16px | 600 (SemiBold) | 21.82px | `#0A1628` |
| Input Text | 16px | 400 (Regular) | 21.82px | `#0A1628` |
| Button Text | 16px | 700 (Bold) | 21.82px | `#FFFFFF` |
| Link Text | 16px | 600 (SemiBold) | 21.82px | `#3F8CFF` |
| Helper Text | 16px | 400 (Regular) | 21.82px | `#7D8592` |

### Tagline
- **Text:** "Your place to work\nPlan. Create. Control."
- **Font Size:** 40px
- **Weight:** 700 (Bold)
- **Line Height:** 56px (140%)
- **Color:** `#FFFFFF`

---

## 🔘 Components

### Main Button (Sign In)
- **Width:** 170px (minimum), full-width on card
- **Height:** 48px
- **Border Radius:** 14px
- **Background:** `#3F8CFF`
- **Text:** "Sign In" + Arrow icon (24x24px, white)
- **Shadow:** `drop-shadow(0px 6px 12px rgba(63, 140, 255, 0.264))`
- **Hover:** `#3F8CFF` at 90% opacity
- **Padding:** 12px 24px

### Input Fields
- **Height:** 56px
- **Border Radius:** 14px
- **Border:** 1px solid `#D9E0E6`
- **Background:** `#FFFFFF`
- **Padding:** 16px
- **Focus Border:** `#3F8CFF`
- **Focus Ring:** 2px solid `#3F8CFF` with 2px offset
- **Label Spacing:** 8px above input
- **Error State:** Border `#EF4444`

### Checkbox (Remember Me)
- **Size:** 24x24px
- **Border Radius:** 6px (on inner 20x20px border)
- **Border:** 1px solid `#0A1628`
- **Checked Background:** `#3F8CFF`
- **Checkmark:** White, 14x14px
- **Label:** "Remember me", 16px, `#7D8592`
- **Spacing:** 8px between checkbox and label

---

## 📏 Spacing

### Vertical Spacing
- Card Header to Title: 0px
- Title to Subtitle: 12px
- Subtitle to First Input: 32px
- Between Inputs: 24px
- Last Input to Remember Me/Forgot Password: 16px
- Remember Me to Button: 24px
- Button to Sign Up Link: 24px

### Horizontal Spacing
- Card Padding: 48px left/right
- Input Label to Field: 8px
- Checkbox to Label: 8px
- Remember Me | Forgot Password: `justify-between`

---

## 🎭 Effects

### Card Shadow
```css
box-shadow: 0px 6px 58px rgba(196, 203, 214, 0.104);
```

### Button Shadow
```css
box-shadow: 0px 6px 12px rgba(63, 140, 255, 0.264);
```

### Input Focus Ring
```css
box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #3F8CFF;
```

---

## 🔗 Links

### Forgot Password
- **Position:** Top right, above inputs
- **Text:** "Forgot Password?"
- **Color:** `#7D8592`
- **Hover:** `#3F8CFF`
- **Font:** 16px, Regular

### Sign Up Link
- **Position:** Bottom, centered
- **Text:** "Don't have an account?" + "Sign up" (link)
- **Color:** `#3F8CFF`
- **Font:** 16px, SemiBold
- **Hover:** Underline

---

## 🖼️ Branding

### Logo
- **Size:** 50x50px
- **Border Radius:** 12px
- **Background:** White rounded square
- **Icon:** Electric blue abstract shape
- **Position:** Top left of sidebar (dark section)

### Brand Text
- **Title:** "Woorkroom"
- **Font:** Nunito Sans Bold, 30px
- **Color:** White
- **Tagline:** "Your place to work\nPlan. Create. Control."
- **Tagline Font:** Nunito Sans Bold, 40px, 140% line height
- **Color:** White

---

## 📱 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌──────────────────────────────────┐ │
│  │             │  │                                  │ │
│  │   LOGO      │  │        Sign In Card              │ │
│  │  Woorkroom  │  │                                  │ │
│  │             │  │  ┌────────────────────────────┐ │ │
│  │  Tagline    │  │  │ Email Input                │ │ │
│  │             │  │  └────────────────────────────┘ │ │
│  │             │  │                                  │ │
│  │             │  │  ┌────────────────────────────┐ │ │
│  │             │  │  │ Password Input             │ │ │
│  │             │  │  └────────────────────────────┘ │ │
│  │             │  │                                  │ │
│  │             │  │  ☑ Remember me   Forgot Pass?   │ │
│  │             │  │                                  │ │
│  │             │  │  ┌────────────────────────────┐ │ │
│  │             │  │  │      Sign In Button        │ │ │
│  │             │  │  └────────────────────────────┘ │ │
│  │             │  │                                  │ │
│  │             │  │   Don't have an account? Sign up│ │
│  │             │  │                                  │ │
│  └─────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

- [ ] Update color tokens in Tailwind config
- [ ] Update Input component border radius to 14px
- [ ] Update Button shadow to match design
- [ ] Add Nunito Sans font family
- [ ] Update typography scale
- [ ] Update card border radius to 24px
- [ ] Update spacing values
- [ ] Add proper focus states
- [ ] Implement checkbox custom styling
- [ ] Add hover states to all interactive elements
