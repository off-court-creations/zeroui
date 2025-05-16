# `<Button />`

ZeroUI’s primary actionable element.

A Button can render as a solid call-to-action (`"main"`) or as a lightweight outlined action (`"alt"`), and comes in three sizes.

## Examples

### Default (`main`, `md`)

```jsx
<Button>Save changes</Button>
```

### Outlined alternative

```jsx
import { Box } from "./Box";

<Box style={{backgroundColor: "#666", padding: "24px",}}>
  <Button variant="alt">Cancel</Button>
</Box>
```

### Small & disabled

```jsx
<Button size="sm" disabled>
  Processing …
</Button>
```

## Props

| Name      | Type                          | Default | Description                                  |
|-----------|------------------------------|---------|----------------------------------------------|
| `variant` | `"main"` - `"alt"`          | `main`  | Visual presentation. `"main"` is solid; `"alt"` is outlined. |
| `size`    | `"sm"` - `"md"` - `"lg"`   | `md`    | Overall control dimensions and font size.    |
| `preset`  | `string - string[]`         | –       | One or more preset style classes returned by `definePreset()`. |
| *(rest)*  | All native `<button>` props  | –       | You can pass any standard button attributes. |

---

> **Tip:** Combine `preset` with zeroui’s preset system to create reusable visual variants without writing additional CSS.
