# 🔤 Supported Display Name Fonts

> Give your Discord bot's display name a unique typographic style with 12 different fonts!

---

## 📖 Overview

GLOW supports **12 different fonts** for your Discord Display Name. Each font gives your bot's name a distinct look and personality.

---

## 🎯 Available Fonts

| Font ID | Font Name | Style Description |
|---------|-----------|-------------------|
| `1` | **Bangers** | 🎬 Bold, comic-style display font |
| `2` | **BioRhyme** | 📐 Modern, geometric serif |
| `3` | **Cherry Bomb** | 🍒 Playful, rounded display font |
| `4` | **Chicle** | 😄 Friendly, informal handwriting style |
| `5` | **Compagnon** | 🖋️ Elegant, editorial serif |
| `6` | **Museo Moderno** | 🏛️ Contemporary geometric sans-serif |
| `7` | **Neo-Castel** | 🏰 Medieval-inspired decorative font |
| `8` | **Pixelify Sans** | 👾 Retro pixel-art inspired font |
| `9` | **Ribes** | 🌿 Clean, natural sans-serif |
| `10` | **Sinistre** | 🖤 Dark, gothic-style font |
| `11` | **Default (GG Sans)** | 🔵 Discord's standard font |
| `12` | **Zilla Slab** | 📰 Bold, slab-serif font |

---

## 📝 How to Apply

To apply a font, set the `"font_id"` value in your `style.json` to the corresponding integer.

### Example: Sinistre Font
```json
{
  "font_id": 10
}
```

### Example: With Effect & Color
```json
{
  "font_id": 10,
  "effect_id": 3,
  "colors": [16777215]
}
```

---

## 🚀 Popular Combinations

| Look | Font ID | Effect ID | Colors |
|------|---------|-----------|--------|
| 🖤 **Sinistre Neon White** | `10` | `3` (Neon) | `[16777215]` |
| 🍒 **Cherry Toon White** | `3` | `4` (Toon) | `[16777215]` |
| 👾 **Pixelify Pop Pink** | `8` | `5` (Pop) | `[16711935]` |

---

## 💡 Tips

- 🆕 **Font ID `11`** is Discord's default font (GG Sans) — use it to reset to standard
- 🎨 Combine fonts with effects from [effects.md](./effects.md) and colors from [colors.md](./colors.md)
- 🔄 Presets like `sinistre-neon-white` automatically combine font + effect + color

---

<p align="center">
  <sub>📖 See <a href="./effects.md">effects.md</a> for available effects | See <a href="./colors.md">colors.md</a> for color values</sub>
</p>