# Display Name Styles API Endpoints

> The system automatically discovers and tests Discord's undocumented API endpoints to apply styles to your bot's profile.

---

## Overview

The library utilizes several **undocumented** Discord API endpoints to apply Display Name styles to bot profiles. During startup, the system automatically tests these endpoints to find a working payload format.

---

## Candidate Endpoints

### 1 User Profile Endpoint (Global)

| Property | Value |
|----------|-------|
| Method | `PATCH` |
| Route | `/users/@me` |
| Scope | **Global** — Updates the default style across all servers |

### 2 Guild Member Endpoint (Server-Specific)

| Property | Value |
|----------|-------|
| Method | `PATCH` |
| Route | `/guilds/{guild_id}/members/@me` |
| Scope | **Server-Specific** — Updates style only for the specified guild |

### 3 Guild Profile Endpoint (Server-Specific)

| Property | Value |
|----------|-------|
| Method | `PATCH` |
| Route | `/guilds/{guild_id}/profile/@me` |
| Scope | **Server-Specific** — Alternate endpoint for server-specific updates |

---

## Payload Formats

Because the API endpoints change formats frequently, the system tests **two distinct JSON payload structures** to see which one the API currently accepts.

### Format A — Nested Structure
```json
{
  "display_name_styles": {
    "font_id": 10,
    "effect_id": 3,
    "colors": [16777215]
  }
}
```

### Format B — Flattened Structure
```json
{
  "display_name_font_id": 10,
  "display_name_effect_id": 3,
  "display_name_colors": [16777215]
}
```

---

## How Discovery Works

| Step | Action |
|------|--------|
| 1 | Tests each endpoint with both payload formats |
| 2 | Handles rate limiting automatically |
| 3 | Verifies the style was actually applied |
| 4 | Caches the working configuration for future use |

> The system handles endpoint selection, rate limiting, and verification **automatically** — no manual configuration needed!

---

## Forced Re-Discovery

To force re-evaluation of all endpoints (ignoring cached configs):

```bash
# Set this environment variable:
DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=true
```

---

## Related Documentation

| File | Description |
|------|-------------|
| [experiments.md](./experiments.md) | Experimental features & API changes |
| [compatibility.md](./compatibility.md) | Compatibility matrix testing |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

See [experiments.md](./experiments.md) for experimental endpoints & changes