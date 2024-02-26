---
title: Power Profiles
---

:::note
package dependancy: `power-profiles-daemon`
on NixOS enable `services.power-profiles-daemon`
:::

## signals

* `profile-released` `(id: number)`

## properties

* `active-profile`: `string` writable, e.g Balanced
* `performance-inhibited`: `string`
* `performance-degraded`: `string`
* `profiles`: `string[]` list of possible `active-profile`
* `actions`: `string[]`
* `active-profile-holds`: `Array<Record<string, string>>`
* `icon-name`: `string`

## Example Widgets

```js
const powerProfiles = await Service.import('powerprofiles')

const label = Widget.Label({
    label: powerProfiles.bind('active_profile'),
})

const button = Widget.Button({
    on_clicked: () => {
        switch (powerProfiles.active_profile) {
            case 'balanced':
                powerProfiles.active_profile = 'performance';
                break;
            default:
                powerProfiles.active_profile = 'balanced';
                break;
        };
    },
})
```
