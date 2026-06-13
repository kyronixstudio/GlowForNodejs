# 📋 Changelog

> All notable changes to this project will be documented here.
>
> **Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
> **Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [1.0.0] — 🚀 Initial Release

### ✅ Added

| Item | Description |
|------|-------------|
| 🖥️ **Multi-Language Support** | Complete Display Name Styles System implementations in **JavaScript**, **TypeScript**, and **Python** |
| 🔍 **Auto-Discovery** | Automatic endpoint discovery and cached working configuration testing |
| 🔄 **Preset Rotation** | 7 built-in presets (`sinistre-neon-white`, `cherry-toon-white`, etc.) |
| 🏠 **Guild Support** | Guild-scoped profile updating |
| 📝 **Logging** | JSONL logging + Markdown report generation on each run |
| 📄 **Project Files** | `.env.example`, `CONTRIBUTING.md`, `LICENSE`, and `CHANGELOG.md` |

### 🐛 Fixed

| Issue | Fix |
|-------|-----|
| 🐍 **Python Logger Callbacks** | Fixed unawaited logger callbacks in the Python API module — loggers are now properly synchronous |
| 📘 **TypeScript Compilation** | Resolved type compilation errors regarding static properties |
| ⚡ **JavaScript Fallback** | Added strict fallback return logic in the JavaScript API fetch loop |
| 🕐 **Python Deprecations** | Fixed `datetime.utcnow()` deprecation warnings and improved error handling blocks |

---

<p align="center">
  <sub>📋 Full project history available on <a href="https://github.com/kyronixstudio/Glow">GitHub</a></sub>
</p>