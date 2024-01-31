---
title: Common Issues
description: Common Issues and Tips & Tricks
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
and use `Gtk.IconTheme.append_search_path` or `icons` option in exported object

```js
// config.js
import Gtk from 'gi://Gtk?version=3.0';

Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets`);

Widget.Icon({
    icon: 'custom-symbolic', // custom-symbolic.svg
    css: 'color: green;', // can be colored, like other named icons
});

export default {
    icons: `${App.configDir}/assets`,
}
```
