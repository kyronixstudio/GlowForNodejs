# Display Name Styles Compatibility

> Ensure long-term stability across Discord API changes with the built-in Compatibility Matrix tester.

---

## What is the Compatibility Matrix?

The service includes a **built-in Compatibility Matrix tester** that systematically verifies every known **Font**, **Effect**, and **Color** combination against the Discord API.

> Enable it by setting `DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY=true` in your environment configuration.

---

## Tests Performed

During the Compatibility Matrix run, the system performs **3 categories of tests**:

| # | Test | Description |
|---|------|-------------|
| 1 | Font Verification | Cycles through all fonts (IDs `1` to `12`) while keeping effect & colors static |
| 2 | Effect Verification | Cycles through all effects (IDs `1` to `6`) while keeping font & colors static |
| 3 | Color Verification | Tests a curated list of **solid colors** and **gradients** to ensure accurate API updates |

---

## Accessing Reports

After the script completes its boot process, results are written to:

```
logs/display-name-styles/latest-report.md
```

> Check this file to see which font/effect/color combinations are currently supported by the Discord API.

---

## Important Warning

> Running the compatibility matrix takes an extended amount of time!
>
> The system sleeps between every request to respect Discord's rate limits (`429 Too Many Requests`).
>
> Do **not** run compatibility tests on every boot in production environments.

---

## Quick Reference

| Setting | Value | Effect |
|---------|-------|--------|
| Enable | `DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY=true` | Runs full matrix on boot |
| Disable | Omit or set to `false` | Skips compatibility testing |
| Output | `logs/display-name-styles/latest-report.md` | View test results |

---

See [experiments.md](./experiments.md) for experimental features | See [endpoints.md](./endpoints.md) for API details