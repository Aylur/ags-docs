---
title: Common Issues
---

## Window doesn't show up

When a window doesn't have a size allocation on construction,
it will never show up.
You can solve this by wrapping the children in a box
and forcing the box to have some size.
For example when the window's direct child is a
revealer that starts off with `reveal_child: false`

```js
Widget.Window({
  child: Widget.Box({
    css: 'padding: 1px;',
    child: Widget.Revealer(),
  }),
})
```
