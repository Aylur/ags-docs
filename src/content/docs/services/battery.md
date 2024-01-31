---
title: Battery
---

:::note
package dependency: `upower`
on NixOS enable `services.upower`
:::

## properties

* `available`: `boolean` whether a battery is available or not
* `percent`: `number` round number from 0 to 100
* `charging`: `boolean`
* `charged`: `boolean` fully charged or percent == 100 and charging
* `icon-name`: `string`
* `time-remaining`: `number` time in seconds until fully charged (when charging) or until it fully drains (when discharging)
* `energy`: `number` - current energy in W
* `energy-full`: `number` capacity in W
* `energy-rate`: `number` - drain rate in W (positive if not charging, negative if charging)

## Example Widgets

```js
const battery = await Service.import('battery')

const batteryProgress = Widget.CircularProgress({
    child: Widget.Icon({
        icon: battery.bind('icon_name')
    }),
    visible: battery.bind('available'),
    value: battery.bind('percent').transform(p => p > 0 ? p / 100 : 0),
    class_name: battery.bind('charging').transform(ch => ch ? 'charging' : ''),
})
```
