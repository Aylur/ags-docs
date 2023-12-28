---
title: Power Profiles
---

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
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PowerProfiles from 'resource:///com/github/Aylur/ags/service/powerprofiles.js';

const label = Widget.Label({
    label: PowerProfiles.bind('active-profile'),
});

const button = Widget.Button({
    on_clicked: () => {
        switch (PowerProfiles.active_profile) {
        case 'balanced':
            PowerProfiles.active_profile = 'performance';
            break;
        default:
            PowerProfiles.active_profile = 'balanced';
            break;
        };
    },
});
```
