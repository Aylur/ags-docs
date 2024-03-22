---
title: Network
---

:::note
package dependency: `network-manager`
This service is somewhat incomplete, feel free to open a PR to improve it
:::

## properties

* `connectivity`: `"unknown" | "none" | "portal" | "limited" | "full"`
* `primary`: `"wifi" | "wired"`
* `wired`: `Wired`
* `wifi`: `Wifi`

## methods

* `toggleWifi`: `() => void`

## Wifi

### properties

* `ssid`: `string`
* `strength`: `number` 0..100
* `frequency`: `number`
* `internet`: `"connected" | "connecting" | "disconnected"`
* `enabled`: `boolean`
* `access-points`: `AccessPoint`
* `icon-name`: `string`
* `state`: `string`: [NM.DeviceState](https://gjs-docs.gnome.org/nm10~1.0/nm.devicestate) as lowercase string

### methods

* `scan`: `() => void`

## AccessPoint

access points are not a GObjects, just a regular js objects
meaning you can't bind to it or use notify::prop signal

### properties

* `bssid`: `string`
* `address`: `string`
* `lastSeen`: `number`
* `ssid`: `string`
* `active`: `boolean`
* `strength`: `number`
* `frequency`: `number`
* `iconName`: `string` icon name representing its signal strength

## Wired

* `internet`: `"connected" | "connecting" | "disconnected"`
* `state`: `"enabled" | "disabled" | "unknown"`
* `state`: `string`: [NM.DeviceState](https://gjs-docs.gnome.org/nm10~1.0/nm.devicestate) as lowercase string
* `icon-name`: `string`

## Example Widget

```js
const network = await Service.import('network')

const WifiIndicator = () => Widget.Box({
    children: [
        Widget.Icon({
            icon: network.wifi.bind('icon_name'),
        }),
        Widget.Label({
            label: network.wifi.bind('ssid')
                .as(ssid => ssid || 'Unknown'),
        }),
    ],
})

const WiredIndicator = () => Widget.Icon({
    icon: network.wired.bind('icon_name'),
})

const NetworkIndicator = () => Widget.Stack({
    children: {
        wifi: WifiIndicator(),
        wired, WiredIndicator(),
    },
    shown: network.bind('primary').as(p => p || 'wifi'),
})
```
