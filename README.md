# Discord Display Name Styles System

> Automatically discover & apply custom fonts, neon effects, and color gradients to your Discord bot's display name!

---

## 📋 Table of Contents

- [What is this?](#-what-is-this)
- [🚀 Features](#-features)
- [⚙️ Quick Start](#️-quick-start)
- [📚 Documentation](#-documentation)
- [⚠️ License & Usage](#️-license--usage)
- [🤝 Support & Contributions](#-support--contributions)
- [👏 Credits](#-credits)

---

## 💡 What is this?

This is a portable, defensive background service that **automatically discovers and applies** Discord Display Name Styles — including custom fonts, neon effects, and color gradients — to your Discord bot.

> 🛡️ It's designed to be **non-blocking** and **safe**: your bot will never crash if the Discord API rejects the styles.

**Created & maintained by** **[KyronixStudio](https://github.com/kyronixstudio)**

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔍 **Runtime Discovery** | Automatically discovers whether the bot token supports styles via undocumented endpoints |
| ✅ **Verification** | Doesn't just trust HTTP 200 — it **verifies** the style was actually applied |
| 📦 **Portability** | Three complete, standalone implementations: **JavaScript**, **TypeScript**, and **Python** |
| 🎨 **Presets** | Built-in rotation for styles like `sinistre-neon-white` and `cherry-toon-white` |
| 📝 **Diagnostic Logging** | Outputs detailed JSONL request traces and Markdown reports for debugging |
| 🧵 **Non-Blocking** | Runs as an isolated background task — your bot will **never crash** if the API rejects styles |

---

## ⚙️ Quick Start

### 1️⃣ Clone & Install
```bash
git clone https://github.com/kyronixstudio/GlowForNodejs
cd GlowForNodejs
npm install
```

### 2️⃣ Configure Environment
```bash
# Create a .env file with your Discord bot token
echo "DISCORD_TOKEN=your_bot_token_here" > .env

# Edit .env with your bot token and settings
```

### 3️⃣ Setup Style Configuration
Edit `style.json` to customize the look:
```json
{
  "font_id": 10,
  "effect_id": 3,
  "colors": [16777215]
}
```

### 4️⃣ Run
```bash
node index.js
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [📘 JavaScript Guide](./js.md) | JavaScript implementation guide |
| [🎨 Colors](./colors.md) | All supported colors & how to use them |
| [🔤 Fonts](./fonts.md) | All supported fonts & their IDs |
| [✨ Effects](./effects.md) | All effects (solid, gradient, neon, etc.) |
| [🔌 API Endpoints](./endpoints.md) | API endpoints used |
| [🧪 Experiments](./experiments.md) | Experimental features & notes |
| [🔗 Compatibility](./compatibility.md) | Compatibility matrix & testing |
| [📋 Changelog](./CHANGELOG.md) | Version history & changes |
| [🤝 Contributing](./CONTRIBUTING.md) | How to contribute |

---

## ⚠️ License & Usage

This software is provided under a **Strict Proprietary License**.

> ❌ **You MAY NOT** run this code as your own source or claim it as your own work.
>
> ✅ **You MAY** use this code for reference or educational purposes.
>
> ❓ For help, questions, or to contribute, you **MUST** visit our GitHub organization.

📄 See the [LICENSE](./LICENSE) file for full details.

---

## 🤝 Support & Contributions

We welcome discussion and contributions!

- 🏢 **Visit our GitHub:** [https://github.com/kyronixstudio](https://github.com/kyronixstudio)
- 🐛 **Report bugs** — provide `.jsonl` log files (with tokens redacted)
- 🔧 **Open Pull Requests** on GitHub
- 📖 See [CONTRIBUTING.md](./CONTRIBUTING.md) for details

---

## 👏 Credits

| Role | Name |
|------|------|
| 🏗️ **Main Server / Architecture** | **[KyronixStudio](https://github.com/kyronixstudio)** |
| 🤝 **Contributors** | **dray.me**, **6fck** |

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/kyronixstudio">KyronixStudio</a></sub>
</p>