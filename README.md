<h1 align="center">✨ GLOW — Discord Display Name Styles System ✨</h1>
<p align="center">
  <b>Automatically discover & apply custom fonts, neon effects, and color gradients to your Discord bot's display name!</b>
</p>

<p align="center">
  <a href="https://discord.gg/UFCdsaMnYm"><img src="https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=flat&logo=discord" alt="Discord"></a>
  <a href="https://github.com/kyronixstudio/Glow"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Proprietary-red?style=flat" alt="License"></a>
</p>

---

## 📋 Table of Contents

- [What is GLOW?](#-what-is-glow)
- [🚀 Features](#-features)
- [📦 Available Implementations](#-available-implementations)
- [⚙️ Quick Start](#️-quick-start)
- [📚 Documentation](#-documentation)
- [⚠️ License & Usage](#️-license--usage)
- [🤝 Support & Contributions](#-support--contributions)
- [👏 Credits](#-credits)

---

## 💡 What is GLOW?

**GLOW** is a portable, defensive background service that **automatically discovers and applies** Discord Display Name Styles — including custom fonts, neon effects, and color gradients — to your Discord bot.

> 🛡️ It's designed to be **non-blocking** and **safe**: your bot will never crash if the Discord API rejects the styles.

**Created & maintained by** **KyronixStudio**, with contributions from **dray.me** and **6fck**.

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

## 📦 Available Implementations

Choose the language that best fits your bot:

| Language | Requirements | Setup |
|----------|-------------|-------|
| <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"> **JavaScript** | Node.js 16+, `node-fetch` v2 | [📖 View Docs](./js.md) |
| <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"> **TypeScript** | Node.js 16+, `node-fetch` v2 | 📖 View Docs (coming soon) |
| <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"> **Python** | Python 3.8+, `requests` | 📖 View Docs (coming soon) |

---

## ⚙️ Quick Start

### 1️⃣ Clone & Install
```bash
git clone https://github.com/kyronixstudio/Glow
cd Glow
npm install
```

### 2️⃣ Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

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
| [📘 js.md](./js.md) | JavaScript implementation guide |
| [🎨 colors.md](./colors.md) | All supported colors & how to use them |
| [🔤 fonts.md](./fonts.md) | All supported fonts & their IDs |
| [✨ effects.md](./effects.md) | All effects (solid, gradient, neon, etc.) |
| [🔌 endpoints.md](./endpoints.md) | API endpoints used by GLOW |
| [🧪 experiments.md](./experiments.md) | Experimental features & notes |
| [🔗 compatibility.md](./compatibility.md) | Compatibility matrix & testing |
| [📋 CHANGELOG.md](./CHANGELOG.md) | Version history & changes |
| [🤝 CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |

---

## ⚠️ License & Usage

This software is provided under a **Strict Proprietary License**.

> ❌ **You MAY NOT** run this code as your own source or claim it as your own work.
>
> ✅ **You MAY** use this code for reference or educational purposes.
>
> ❓ For help, questions, or to contribute, you **MUST** join our official Discord server.

📄 See the [LICENSE](./LICENSE) file for full details.

---

## 🤝 Support & Contributions

We welcome discussion and contributions!

- 💬 **Join our Discord:** [https://discord.gg/UFCdsaMnYm](https://discord.gg/UFCdsaMnYm)
- 🐛 **Report bugs** — provide `.jsonl` log files (with tokens redacted)
- 🔧 **Open Pull Requests** on GitHub
- 📖 See [CONTRIBUTING.md](./CONTRIBUTING.md) for details

---

## 👏 Credits

| Role | Name |
|------|------|
| 🏗️ **Main Server / Architecture** | **KyronixStudio** |
| 🤝 **Contributors** | **dray.me**, **6fck** |

---

<p align="center">
  <sub>Made with ❤️ by KyronixStudio — GLOW Discord Display Name Styles System</sub>
</p>