# 📘 JavaScript Implementation Guide

> Automatic display name customization for Discord bots using **Node.js**

---

## 📋 Table of Contents

- [Requirements](#-requirements)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration Options](#-configuration-options)
- [Style Configuration](#-style-configuration)
- [Style Presets](#-style-presets)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Logging & Reports](#-logging--reports)
- [Troubleshooting](#-troubleshooting)
- [Credits](#-credits)

---

## ✅ Requirements

| Requirement | Version |
|-------------|---------|
| **Node.js** | 16+ |
| **npm** | 8+ |
| **Dependencies** | `node-fetch` v2, `dotenv` |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kyronixstudio/Glow
cd Glow

# Install dependencies
npm install

# Configure your bot token
cp .env.example .env
# Edit .env with your Discord bot token
```

---

## 🚀 Quick Start

### Basic Usage — Discord.js v13+

```javascript
const ProfileStyleService = require('./index');

// Initialize in your Discord.js bot's ready event
client.on('ready', async () => {
  await ProfileStyleService.initialize(client);
});
```

### With Custom Options

```javascript
const ProfileStyleService = require('./index');

client.on('ready', async () => {
  await ProfileStyleService.initialize(client, {
    targetStyle: {
      font_id: 10,
      effect_id: 3,
      colors: [16777215]
    },
    stylePreset: 'sinistre-neon-white',
    styleMode: 'rotate',     // 'rotate' | 'random' | 'fixed'
    guildId: '123456789012345678'
  });
});
```

---

## ⚙️ Configuration Options

The `ProfileStyleService` accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetStyle` | `object` | `null` | Direct style object `{ font_id, effect_id, colors }` |
| `stylePreset` | `string` | `null` | Preset key name (e.g. `'sinistre-neon-white'`) |
| `styleMode` | `string` | `'rotate'` | `'rotate'` — cycles through presets, `'random'` — picks randomly, `'fixed'` — uses first preset |
| `guildId` | `string` | `null` | Apply style only to specific guild |
| `forceDiscovery` | `boolean` | `false` | Ignore cached config & re-discover endpoints |
| `runCompatibilityTests` | `boolean` | `false` | Run full font/effect/color compatibility matrix |
| `logDir` | `string` | `'logs/display-name-styles/'` | Directory for logs & reports |
| `requestDelayMs` | `number` | `1500` | Delay between API requests (ms) |
| `maxRetries` | `number` | `2` | Max retries per API request |

---

## 🎨 Style Configuration

You can configure styles in **3 ways** (priority order):

### 1️⃣ Direct Options (Highest Priority)
```javascript
await ProfileStyleService.initialize(client, {
  targetStyle: {
    font_id: 10,
    effect_id: 3,
    colors: [16777215]
  }
});
```

### 2️⃣ Environment Variables
```bash
# In your .env file
DISCORD_PROFILE_STYLE_JSON='{"font_id":10,"effect_id":3,"colors":[16777215]}'

# OR individual variables:
DISCORD_PROFILE_STYLE_FONT_ID=10
DISCORD_PROFILE_STYLE_EFFECT_ID=3
DISCORD_PROFILE_STYLE_COLORS=16777215
```

### 3️⃣ `style.json` File
Create a `style.json` in the project root:
```json
{
  "font_id": 10,
  "effect_id": 3,
  "colors": [16777215]
}
```

> 💡 Comments (lines starting with `#`) are supported in `style.json`

---

## 🎭 Style Presets

Built-in presets available for quick setup:

| Key | Label | Font | Effect | Colors |
|-----|-------|------|--------|--------|
| `sinistre-neon-white` | Sinistre Neon White | Sinistre (10) | Neon (3) | White `[16777215]` |
| `ribes-neon-pink` | Ribes Neon Pink | Ribes (9) | Neon (3) | Pink `[16711935]` |
| `neo-castel-gradient-blue-white` | Neo-Castel Blue/White Gradient | Neo-Castel (7) | Gradient (2) | Blue → White `[5865, 16777215]` |
| `pixelify-pop-purple` | Pixelify Sans Pop Purple | Pixelify Sans (8) | Pop (5) | Purple `[8388736]` |
| `bangers-glow-pink-purple` | Bangers Pink/Purple Glow | Bangers (1) | Glow (6) | Pink → Purple `[16711935, 8388736]` |
| `cherry-toon-white` | Cherry Bomb Toon White | Cherry Bomb (3) | Toon (4) | White `[16777215]` |
| `zilla-solid-blue` | Zilla Slab Solid Blue | Zilla Slab (12) | Solid (1) | Blue `[5865]` |

### Preset Modes

| Mode | Behavior |
|------|----------|
| **`rotate`** (default) | Cycles through presets on each restart (persisted in `preset-rotation.json`) |
| **`random`** | Picks a random preset on each restart |
| **`fixed`** | Always uses the first preset (`sinistre-neon-white`) |

```javascript
// Use a specific preset
await ProfileStyleService.initialize(client, {
  stylePreset: 'cherry-toon-white',
  styleMode: 'fixed'
});
```

---

## 🌐 Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DISCORD_TOKEN` | `string` | — | Your Discord bot token |
| `DISCORD_PROFILE_STYLE_ENABLED` | `boolean` | `true` | Set to `false` to disable GLOW |
| `DISCORD_PROFILE_STYLE_PRESET` | `string` | — | Preset key to use |
| `DISCORD_PROFILE_STYLE_MODE` | `string` | `'rotate'` | `'rotate'`, `'random'`, or `'fixed'` |
| `DISCORD_PROFILE_STYLE_GUILD_ID` | `string` | — | Apply to specific guild only |
| `DISCORD_PROFILE_STYLE_JSON` | `json` | — | Inline style JSON |
| `DISCORD_PROFILE_STYLE_FONT_ID` | `number` | — | Font ID override |
| `DISCORD_PROFILE_STYLE_EFFECT_ID` | `number` | — | Effect ID override |
| `DISCORD_PROFILE_STYLE_COLORS` | `string` | — | Comma-separated color values |
| `DISCORD_PROFILE_STYLE_FORCE_DISCOVERY` | `boolean` | `false` | Force re-discovery of endpoints |
| `DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY` | `boolean` | `false` | Run compatibility matrix |
| `DISCORD_PROFILE_STYLE_REQUEST_DELAY_MS` | `number` | `1500` | Delay between requests (ms) |
| `DISCORD_PROFILE_STYLE_MAX_RETRIES` | `number` | `2` | Max retries per request |
| `DISCORD_PROFILE_STYLE_LOG_DIR` | `string` | `'logs/display-name-styles/'` | Log directory |

---

## 📚 API Reference

### `ProfileStyleService`

The main class for managing Discord Display Name styles.

#### Static Methods

| Method | Description |
|--------|-------------|
| `ProfileStyleService.initialize(client, options?)` | Creates instance & starts style service |
| `ProfileStyleService.FONTS` | Array of all supported font objects |
| `ProfileStyleService.EFFECTS` | Array of all supported effect objects |
| `ProfileStyleService.COLOR_TESTS` | Array of color test configurations |
| `ProfileStyleService.TARGET_STYLE` | Default target style |
| `ProfileStyleService.STYLE_PRESETS` | Array of all style presets |

#### Instance Methods

| Method | Description |
|--------|-------------|
| `service.run()` | Executes the full discovery & apply pipeline |
| `service.resolveTargetStyle()` | Determines which style to apply |
| `service.readStyleConfig()` | Reads style from `style.json` file |
| `service.getCandidateEndpoints()` | Gets list of API endpoints to test |
| `service.detectWorkingConfiguration()` | Tests endpoints to find working config |
| `service.applyFinalStyle()` | Applies the final confirmed style |
| `service.runCompatibilityMatrix()` | Tests all font/effect/color combos |

### DiscordProfileAPI (Internal)

Located in `utils/api.js` — handles raw HTTP requests to Discord's API.

| Method | Description |
|--------|-------------|
| `api.get(endpoint, options?)` | Sends GET request |
| `api.patch(endpoint, body, options?)` | Sends PATCH request |

---

## 📝 Logging & Reports

GLOW automatically generates detailed logs:

### Log Files
```
📁 logs/display-name-styles/
├── 📄 YYYY-MM-DD_HH-MM-SS.jsonl     # Raw API request/response traces
├── 📄 latest-report.md               # Human-readable summary report
├── 📄 working-config.json            # Cached working configuration
└── 📄 preset-rotation.json           # Current preset rotation state
```

### JSONL Log Format
Each line contains a JSON object with:
- `type` — Log type (`api-response`, `display-name-style-test`, `summary`, etc.)
- `timestamp` — ISO timestamp
- `data` — Detailed log data (tokens are auto-redacted)

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| ❌ **"No working configuration found"** | API endpoint changed | Set `DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=true` |
| ⏳ **"Rate limited"** | Too many requests | Increase `requestDelayMs` (e.g., `3000`) |
| ⚠️ **"200 OK but style not applied"** | Silent rejection | Check `.jsonl` logs for verification phase |
| 🚫 **"401 Unauthorized"** | Invalid bot token | Verify `DISCORD_TOKEN` in `.env` |
| 🐌 **"Compatibility matrix too slow"** | Rate limit delays | Only run in development, disable in production |

### Debugging

```bash
# Force re-discovery of all endpoints
DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=true node index.js

# Run compatibility matrix
DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY=true node index.js

# Check latest report
cat logs/display-name-styles/latest-report.md
```

---

## 👏 Credits

| Role | Name |
|------|------|
| 🏗️ **Main Server** | **KyronixStudio** |
| 🤝 **Contributors** | **dray.me**, **6fck** |

---

## 📖 Related Documentation

| File | Description |
|------|-------------|
| [🎨 colors.md](./colors.md) | All supported colors |
| [🔤 fonts.md](./fonts.md) | All supported fonts |
| [✨ effects.md](./effects.md) | All visual effects |
| [🔌 endpoints.md](./endpoints.md) | API endpoints |
| [🧪 experiments.md](./experiments.md) | Experimental features |
| [🔗 compatibility.md](./compatibility.md) | Compatibility testing |

---

<p align="center">
  <sub>Made with ❤️ by KyronixStudio — GLOW Discord Display Name Styles System</sub>
</p>