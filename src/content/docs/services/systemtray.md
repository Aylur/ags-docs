---
title: System Tray
---

:::note
package dependency: `libdbusmenu-gtk3`
:::

## signals

- `added`: `(busName: string)` emitted when a new TrayItem is added
- `removed`: `(busName: string)` emitted when a TrayItem is removed

## properties

- `items`: `TrayItem[]`

## methods

- `getItem`: `(busName: string) => TrayItem`

## TrayItem

### signals

- `changed`: emitted on any change of the TrayItem
- `removed`: `(busName: string)` emitted when this TrayItem is removed

### properties

- `menu`: [Gtk.Menu](https://gjs-docs.gnome.org/gtk30~3.0/gtk.menu) | `undefined`
- `category`: `string` possible values: `ApplicationStatus`, `Communications`, `SystemServices`, `Hardware`
- `id`: `string`
- `title`: `string`
- `status`: `string` possible values: `Passive`, `Active`, `NeedsAttention`
- `window-id`: `number`
- `is-menu`: `boolean` if true, showing the menu is preferred over activate
- `tooltip-markup`: `string`
- `icon`: `string | GdkPixbuf.Pixbuf`

### methods

- `activate`: `(event: Gdk.Event) => void`
- `secondaryActivate`: `(event: Gdk.Event) => void`
- `scroll`: `(event: Gdk.EventScroll) => void`
- `openMenu`: `(event: Gdk.Event) => void`

## Example Widget

```js
const systemtray = await Service.import('systemtray')

/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = item => Widget.Button({
    child: Widget.Icon().bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
});

const sysTray = Widget.Box({
    children: systemtray.bind('items').transform(i => i.map(SysTrayItem))
})
```
