# Display Name Experiments

> The Discord Display Name Style system is an **active area of experimentation** — API routes, payload structures, and supported IDs change frequently.

---

## Overview

Because this feature is tied to Discord's private beta features or the Discord Shop, the API is subject to frequent changes. The system is designed to **adapt automatically** to these changes.

---

## Known Experimental States

### 1 Payload Format Migrations

The Discord API has historically bounced between two payload structures:

| Format | Structure | Example |
|--------|-----------|---------|
| Nested | `display_name_styles: { font_id, effect_id, colors }` | `{ "display_name_styles": { "font_id": 10 } }` |
| Flattened | `display_name_font_id`, `display_name_effect_id`, etc. | `{ "display_name_font_id": 10 }` |

> The system automatically tests **both formats** during discovery to find which one works.

### 2 Endpoint Redirection

Depending on how the bot connects:
- Changes made to `/users/@me` **may not** reflect in guilds
- The bot may need to iterate over `GET /users/@me/guilds` and `PATCH` them directly

### 3 Validation Strictness

> Discord has been known to return **`200 OK`** on `PATCH` requests even when the style payload is **silently dropped or rejected**.

This is why the service **verifies** the style was actually applied — it doesn't just trust HTTP status codes.

---

## Ongoing Work

The system constantly evaluates the endpoints to adapt to these experiments:

| Tool | How to Use | Purpose |
|------|-----------|---------|
| Force Discovery | Set `DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=true` | Ignores cached configs & re-evaluates all endpoints |
| JSONL Logs | Check `logs/` directory | Raw API responses + verification phases for debugging |
| Markdown Reports | `logs/display-name-styles/latest-report.md` | Summarized compatibility test results |

---

## Debugging Tips

```bash
# Force re-discovery of all endpoints
DISCORD_PROFILE_STYLE_FORCE_DISCOVERY=true node index.js

# Run compatibility matrix
DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY=true node index.js
```

> Check the `.jsonl` dump for detailed `raw` API responses and `verification` phases — these can expose **silent rejections** from the API.

---

## Related Documentation

| File | Description |
|------|-------------|
| [endpoints.md](./endpoints.md) | API endpoints used |
| [compatibility.md](./compatibility.md) | Compatibility matrix & testing |
| [CHANGELOG.md](./CHANGELOG.md) | Version history & changes |

---

See [endpoints.md](./endpoints.md) for endpoint details | [compatibility.md](./compatibility.md) for testing