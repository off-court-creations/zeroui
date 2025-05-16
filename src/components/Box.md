# `<Box />`

ZeroUI’s **base layout primitive**.  
A thin wrapper around a `<div>` that:

* forces `box-sizing: border-box`
* accepts **all** native `<div>` attributes
* supports ZeroUI’s **style preset** system via the `preset` prop

Use `Box` as a neutral container before reaching for more opinionated components like `Stack` or `Surface`.

---

## Examples

### Simple wrapper

```jsx
import { Box } from '../components/Box';
import { Typography } from '../components/Typography';

<Box>
  Hello from inside Box
</Box>
```

### Inline styles

```jsx
import { Box } from '../components/Box';

<Box style={{ background: '#efefef', padding: 16, borderRadius: 8 }}>
  Gray background
</Box>
```

---

## Props

| Name      | Type                 | Default | Description                                                                  |
|-----------|----------------------|---------|------------------------------------------------------------------------------|
| `preset`  | `string` · `string[]`| —       | One or more preset style classes returned by `definePreset()`.               |
| *(rest)*  | All native `<div>` props | —    | Forwarded to the underlying `<div>` element.                                 |

---

> **Tip:** Combine `preset` with the theme’s spacing utilities to create consistent, reusable layout containers without additional CSS.
