---
title: Config Object
description: Exported configuration object
---

When you start `ags`, it will try to `import` the `default` `export`
from a module which defaults to `~/.config/ags/config.js`.
Even if you mutate this object after initialization,
the config **will not be reloaded**.

```js
// config.js
export default {
    style: './style.css',
    icons: './assests',
    windows: [
        // Array<Gtk.Window>
    ],
    closeWindowDelay: {
        'window-name': 500, // milliseconds
    },
    onConfigParsed: function() {
        // code that runs after this object is loaded
    },
    onWindowToggled: function (windowName, visible) {
        print(`${windowName} is ${visible}`)
    },
};
```

## The exported config object

| Field | Type | Description |
|-------|------|-------------|
| `style` | `string` | Path to a css file.
| `icons` | `string` | Icon directory to append to Gtk.IconTheme.
| `windows` | `Array<Gtk.Window>` | List of [Windows](./widgets#window).
| `closeWindowDelay` | `Record<string, number>` | Delays the closing of a window, this is useful for making animations with a revealer
| `onConfigParsed` | `(app: App) => void` | Callback to execute after all user modules were resolved.
| `onWindowToggled` | `(windowName: string, visible: boolean) => void` | Callback to execute when a window is toggled.
