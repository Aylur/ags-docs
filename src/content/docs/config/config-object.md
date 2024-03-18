---
title: Config Object
description: Exported configuration object
---

`App.config` can be called any number of times, the passed
properties will be applied on top of previous calls

```js
// config.js
App.config({
    style: "./style.css",
    icons: "./assets",
    windows: [
        // Array<Gtk.Window>
    ],
    gtkTheme: "Adwaita-dark",
    cursorTheme: "Qogir",
    iconTheme: "MoreWaita",
    closeWindowDelay: {
        "window-name": 500, // milliseconds
    },
    onConfigParsed: function() {
        // code that runs after this object is loaded
    },
    onWindowToggled: function (windowName, visible) {
        print(`${windowName} is ${visible}`)
    },
});
```

| Field | Type | Description |
|-------|------|-------------|
| style | `string` | Path to a css file.
| icons | `string` | Icon directory to append to Gtk.IconTheme.
| windows | `Array<Gtk.Window>` | List of [Windows](./widgets#window).
| gtkTheme | `string` | Name of the base GTK3 theme.
| cursorTheme | `string` | Name of a cursor theme. Useful for greetd greeters.
| iconTheme | `string` | Name of an icon theme.
| closeWindowDelay | `Record<string, number>` | Delays the closing of a window, this is useful for making animations with a revealer
| onConfigParsed | `(app: App) => void` | Callback to execute after all user modules were resolved.
| onWindowToggled | `(windowName: string, visible: boolean) => void` | Callback to execute when a window is toggled.
