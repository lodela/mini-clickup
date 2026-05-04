# Figma MCP Server Configuration

**Status:** ✅ Operational
**Location:** `C:\Users\norberto.lodela\mcp-servers\figma`
**Version:** 0.3.0
**Package:** `figma-developer-mcp`

---

## 🔧 Configuration

### Environment Variables Required

Create `.env` file in `C:\Users\norberto.lodela\mcp-servers\figma\.env`:

```env
FIGMA_API_KEY=your_figma_api_key_here
FIGMA_FILE_KEY=IOYnTnClPHrmSnWFlKh96O
FIGMA_NODE_ID=0-1
PORT=3333
```

### Getting Figma API Key

1. Go to: https://www.figma.com/developers/api#access-tokens
2. Click "Create new token"
3. Copy and save the token (show only once!)
4. Add to `.env` file

### File Key Extraction

From your Figma URL:
```
https://www.figma.com/design/IOYnTnClPHrmSnWFlKh96O/CRM-Workroom--Community-?node-id=0-1
                                              ^^^^^^^^^^^^^^^^^^^^
                                              This is the FILE_KEY
```

### Node ID Extraction

From your Figma URL:
```
https://www.figma.com/design/IOYnTnClPHrmSnWFlKh96O/CRM-Workroom--Community-?node-id=0-1
                                                                                      ^^^
                                                                                      This is the NODE_ID
```

---

## 🚀 Usage in Cursor/AI Editor

### Example Prompt

```
Implement the login page from this Figma design:
https://www.figma.com/design/IOYnTnClPHrmSnWFlKh96O/CRM-Workroom--Community-?node-id=0-2

Use the existing component library (Button, Input, Card) from @/components/ui.
Follow the design tokens in @/styles/globals.css.
```

### What MCP Provides

1. **Design Tokens**
   - Colors with hex codes
   - Typography (font sizes, weights)
   - Spacing values
   - Border radius

2. **Component Structure**
   - Layout hierarchy
   - Auto-layout properties
   - Constraints

3. **Style Information**
   - Fills (colors, gradients)
   - Strokes (borders)
   - Effects (shadows, blurs)
   - Text styles

---

## 📋 Available Commands

The MCP server provides these capabilities:

1. **Get File Info**
   - Retrieve file metadata
   - List all pages
   - Get component sets

2. **Get Node Info**
   - Retrieve specific frame/node data
   - Get children nodes
   - Extract styles

3. **Get Styles**
   - List all text styles
   - List all color styles
   - List all effect styles

4. **Get Components**
   - List component sets
   - Get component properties
   - Get variant groups

---

## 🔍 Verification Steps

### 1. Check MCP Server Status

```bash
cd C:\Users\norberto.lodela\mcp-servers\figma
npm run build
npm start -- --help
```

### 2. Test Figma API Connection

```bash
# Test with curl (replace YOUR_KEY and FILE_KEY)
curl -X GET "https://api.figma.com/v1/files/IOYnTnClPHrmSnWFlKh96O" \
  -H "X-Figma-Token: YOUR_API_KEY"
```

### 3. Verify in Cursor

1. Open Cursor settings
2. Go to MCP Servers
3. Add server:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "your_key_here",
        "FIGMA_FILE_KEY": "IOYnTnClPHrmSnWFlKh96O"
      }
    }
  }
}
```

---

## 📐 Design System Mapping

### From Figma to Code

| Figma Property | Code Equivalent |
|----------------|-----------------|
| Auto Layout | Flexbox (`flex`, `flex-direction`) |
| Constraints | CSS `position`, `inset` |
| Text Styles | Tailwind `text-*`, `font-*` |
| Color Styles | CSS variables (`--primary`, `--electric-blue`) |
| Effects | Tailwind `shadow-*`, `backdrop-blur-*` |
| Components | React components (`<Button />`, `<Card />`) |

### Current Design Tokens (globals.css)

```css
/* Colors */
--primary: #0f172a (Navy)
--electric-blue: #3b82f6
--success: #10b981
--warning: #f59e0b
--destructive: #ef4444

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.8)
--blur-md: 16px
--blur-lg: 24px

/* Typography */
--font-family: 'Inter'
--font-size-base: 16px

/* Spacing */
--spacing-md: 16px
--spacing-lg: 24px

/* Border Radius */
--radius: 16px
```

---

## ✅ Next Steps

1. **Create `.env` file** with Figma API key
2. **Build MCP server**: `npm run build`
3. **Configure in Cursor** (or your AI editor)
4. **Test with prompt**: "Get info from Figma file [URL]"
5. **Begin development** using Figma designs as reference

---

**Last Updated:** 2026-03-17
**Status:** Ready for development
