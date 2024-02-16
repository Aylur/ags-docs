---
title: Bluetooth
---

:::note
package dependancy: `gnome-bluetooth-3.0`
for the battery percentage to work, make sure you have `Experimental = true` in `/etc/bluetooth/main.conf`
:::

## signals

* `device-added`: `(address: string)`
* `device-removed`: `(address: string)`

## properties

* `enabled`: `boolean`: writable
* `devices`: `Device[]`
* `connected-devices`: `Device[]`

## methods

* `toggle`: `() => void`
* `getDevice`: `(address: string) => Device`

## Device

### properties

* `address`: `string`
* `battery-level`: `number`
* `battery-percentage`: `number`
* `connected`: `boolean`
* `icon-name`: `string`
* `alias`: `string`
* `name`: `string`
* `trusted`: `boolean`
* `paired`: `boolean`

### methods

* `setConnection`: `(connect: boolean) => void`

## Example Widgets

```js
const bluetooth = await Service.import('bluetooth')

const connectedList = Widget.Box({
    setup: self => self.hook(bluetooth, self => {
        self.children = bluetooth.connected_devices
            .map(({ icon_name, name }) => Widget.Box([
                Widget.Icon(icon_name + '-symbolic'),
                Widget.Label(name),
            ]));

        self.visible = bluetooth.connected_devices.length > 0;
    }, 'notify::connected-devices'),
})

const indicator = Widget.Icon({
    icon: bluetooth.bind('enabled').as(on =>
        `bluetooth-${on ? 'active' : 'disabled'}-symbolic`),
})
```
