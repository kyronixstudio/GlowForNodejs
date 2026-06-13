# Supported Display Name Effects

> Transform your Discord bot's display name with stunning visual effects!

---

## Overview

The system supports **6 different visual effects** for your Discord Display Name. Each effect gives your bot's name a unique look and feel.

---

## Available Effects

| Effect ID | Effect Name | Description |
|-----------|-------------|-------------|
| `1` | Solid | Single flat color |
| `2` | Gradient | Smooth transition between 2 colors |
| `3` | Neon | Glowing neon-like effect |
| `4` | Toon | Cartoon/toon style rendering |
| `5` | Pop | Bold, popping visual effect |
| `6` | Glow | Soft outer glow effect |

---

## How to Apply

To apply an effect, set the `"effect_id"` value in your `style.json` to the corresponding integer.

### Example: Neon Effect
```json
{
  "effect_id": 3
}
```

### Example: Gradient Effect
```json
{
  "effect_id": 2,
  "colors": [5865, 16777215]
}
```

---

## Important Notes

| Effect | Color Requirements |
|--------|-------------------|
| Solid (`1`) | 1 color in array |
| Gradient (`2`) | **Exactly 2 colors** required |
| Neon (`3`) | 1 color in array |
| Toon (`4`) | 1 color in array |
| Pop (`5`) | 1 color in array |
| Glow (`6`) | 1 color in array |

> If you are using the **Gradient** effect (ID `2`), make sure to supply **exactly 2 colors** in the `colors` array. See [colors.md](./colors.md) for details.

---

## Quick Reference

```json
// Solid effect example
{ "effect_id": 1, "colors": [16777215] }

// Gradient effect example
{ "effect_id": 2, "colors": [5865, 16777215] }

// Neon effect example
{ "effect_id": 3, "colors": [16711935] }
```

---

See [colors.md](./colors.md) for color values | See [fonts.md](./fonts.md) for available fonts