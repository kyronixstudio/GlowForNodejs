# Supported Display Name Colors

> Choose from millions of colors to customize your Discord bot's display name style!

---

## How Colors Work

Colors are represented as **standard decimal integer color codes**. You can use any valid decimal color value between:

```
0  (black)  →  16777215  (white / 0xFFFFFF)
```

---

## Example Colors

| Color Name | Decimal Value | Description |
|------------|---------------|-------------|
| White | `16777215` | Bright white |
| Pink | `16711935` | Hot pink |
| Blue | `5865` | Discord Blue |
| Purple | `8388736` | Rich purple |

> Tip: Use an online decimal-to-hex converter (e.g., `16777215` → `#FFFFFF`) to find your perfect color!

---

## How to Apply

You apply colors by providing an array of decimal integers to the `"colors"` key in your `style.json`.

### Solid Colors (Single Color)

For solid effects, provide an array with **one** color:

```json
{
  "colors": [16777215]
}
```

### Gradients (Two Colors)

If you are using the **Gradient** effect (`effect_id: 2`), you must provide **exactly two colors** in the array:

| Array Position | Description |
|----------------|-------------|
| `colors[0]` | Start color of gradient |
| `colors[1]` | End color of gradient |

```json
{
  "colors": [5865, 16777215]
}
```

---

## Quick Reference

| Usage | Array Length | Example |
|-------|-------------|---------|
| Solid | 1 color | `[16777215]` |
| Gradient | 2 colors | `[5865, 16777215]` |

---

## Important Notes

- Value range: `0` to `16777215` (inclusive)
- Works with all effect types
- Do not use hex values (e.g., `#FFFFFF`) — use decimal integers only
- Gradient effect requires **exactly** 2 colors — no more, no less

---

See [effects.md](./effects.md) for available effects | See [fonts.md](./fonts.md) for available fonts