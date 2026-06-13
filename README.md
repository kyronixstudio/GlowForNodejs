# Discord Display Name Styles System

> Automatically discover & apply custom fonts, neon effects, and color gradients to your Discord bot's display name!

---

## 📋 Table of Contents

- [What is this?](#-what-is-this)
- [🚀 Features](#-features)
- [⚡ How to Use (Quick Start)](#-how-to-use-quick-start)
- [📚 Full Documentation](#-full-documentation)
- [🎨 Customizing Colors (Hex to Decimal)](#-customizing-colors-hex-to-decimal)
- [⚠️ License & Usage](#️-license--usage)
- [🆘 Support](#-support)
- [👏 Credits](#-credits)

---

## 💡 What is this?

This is a **portable background service** that automatically discovers and applies Discord Display Name Styles — custom fonts, neon effects, and color gradients — to your Discord bot.

> 🛡️ Non-blocking & safe: your bot will never crash if the Discord API rejects the styles.

**Created & maintained by** **[KyronixStudio](https://github.com/kyronixstudio)**

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔍 **Auto-Discovery** | Automatically finds working API endpoints |
| ✅ **Verification** | Actually confirms the style was applied (doesn't just trust HTTP 200) |
| 🎨 **7 Presets** | Ready-to-use styles like Sinistre Neon White, Cherry Toon White, etc. |
| 🔄 **Rollout Mode** | Each run rotates to a different preset style |
| 📝 **Diagnostic Logging** | Detailed JSONL logs + Markdown reports |
| 🧵 **Non-Blocking** | Runs as isolated background task, never crashes your bot |

---

## ⚡ How to Use (Quick Start)

### Step 1: Clone the repository
```bash
git clone https://github.com/kyronixstudio/GlowForNodejs
```

### Step 2: Go into the folder
```bash
cd GlowForNodejs
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Add your Discord bot token
Create a file named `.env` in the folder and put this inside:
```
DISCORD_TOKEN=your_bot_token_here
```
> Replace `your_bot_token_here` with your actual Discord bot token from the Discord Developer Portal.

### Step 5: Run the service
```bash
node run.js
```

> **That's it!** The service will automatically detect the API and apply a style to your bot's display name.

### 🔄 Running Multiple Times (Rollout)

Each time you run `node run.js`, it will **rollout** a different preset style automatically:

- Run 1 → Sinistre Neon White
- Run 2 → Ribes Neon Pink
- Run 3 → Neo-Castel Blue/White Gradient
- Run 4 → Pixelify Pop Purple
- Run 5 → Bangers Pink/Purple Glow
- Run 6 → Cherry Bomb Toon White
- Run 7 → Zilla Slab Solid Blue
- Then it cycles back to the beginning!

> This rotation is saved and persists between runs.

---

## 🎨 Customizing Colors (Hex to Decimal)

Colors in Discord use **decimal values**, not hex codes. Here's how to convert:

| Hex Code | Decimal Value | Color Name |
|----------|---------------|------------|
| `#FFFFFF` | `16777215` | White |
| `#FF69B4` | `16711935` | Hot Pink |
| `#16E` | `5865` | Discord Blue |
| `#7F00FF` | `8388736` | Purple |

### How to customize

Edit the `style.json` file and change the values:

```json
{
  "font_id": 10,
  "effect_id": 3,
  "colors": [16777215]
}
```

| Field | What it does | Values |
|-------|-------------|--------|
| `font_id` | Choose a font | `1` to `12` (see [fonts.md](./fonts.md)) |
| `effect_id` | Choose an effect | `1` to `6` (see [effects.md](./effects.md)) |
| `colors` | Choose colors | Decimal array (see [colors.md](./colors.md)) |

> **For full customization**, read all the documentation files listed below.

---

## 📚 Full Documentation

Read these docs to fully customize your bot:

| File | What it covers |
|------|----------------|
| [📘 js.md](./js.md) | Complete JavaScript API reference & all options |
| [🎨 colors.md](./colors.md) | All colors, how to convert hex to decimal, gradients |
| [🔤 fonts.md](./fonts.md) | All 12 fonts available |
| [✨ effects.md](./effects.md) | All 6 effects (Solid, Gradient, Neon, Toon, Pop, Glow) |
| [🔌 endpoints.md](./endpoints.md) | How the API discovery works |
| [🧪 experiments.md](./experiments.md) | Experimental features & API changes |
| [🔗 compatibility.md](./compatibility.md) | How to test all font/effect/color combinations |
| [📋 CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## ⚠️ License & Usage

This software is provided under a **Strict Proprietary License**.

> ❌ **You MAY NOT** run this code as your own source or claim it as your own work.
>
> ✅ **You MAY** use this code for reference or educational purposes.

See the [LICENSE](./LICENSE) file for full details.

---

## 🆘 Support

Need help? Want to contribute? Have questions about customization?

- 🏢 **Visit our GitHub:** [https://github.com/kyronixstudio](https://github.com/kyronixstudio)
- 🐛 **Report bugs** — provide `.jsonl` log files (with tokens redacted)
- 🔧 **Open Pull Requests** on GitHub
- 📖 See [CONTRIBUTING.md](./CONTRIBUTING.md) for more info

---

## 👏 Credits

| Role | Name |
|------|------|
| Creator & Maintainer | **[KyronixStudio](https://github.com/kyronixstudio)** |
| Contributors | **[dray-me](https://discord.com/users/1105408192537698334)**, **[2f9r](https://discord.com/users/1466067054409814149)**, **[6fck](https://discord.com/users/1243921122400145423)** |

---

Made with ❤️ by [KyronixStudio](https://github.com/kyronixstudio)

© KYRONIX STUDIO & Creators All Rights Reserved
