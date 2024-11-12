---
title: Common Issues
description: Common Issues and Tips & Tricks
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
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

## Custom svg symbolic icons

Put svgs in a directory, named `<icon-name>-symbolic.svg`
and use `App.addIcons` or `icons` option in exported object

```js
// config.js
App.addIcons(`${App.configDir}/assets`)

Widget.Icon({
    icon: 'custom-symbolic', // custom-symbolic.svg
    css: 'color: green;', // can be colored, like other named icons
});
```

## GtkWindow is not a layer surface

If `Widget.Window` shows as up as a regular window,
it usually means ags is running in xwayland.
Try running `ags` from a non xwayland terminal, or try

```bash
env GDK_BACKEND=wayland ags
```
