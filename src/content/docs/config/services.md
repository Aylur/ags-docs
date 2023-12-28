---
title: Services
---

A Service is an instance of a [GObject.Object](https://gjs-docs.gnome.org/gobject20~2.0/gobject.object)
that emits signals when its state changes.
Widgets can connect to them and execute a callback function on their signals
which are usually functions that updates the widget's properties.

```js
const widget = Widget.Label()
    // the signal is 'changed' if not specified
    // [Service, callback, signal = 'changed']
    .hook(SomeService, function(self, ...args) {
        // there can be other arguments based on signals
        self.label = 'new label';
    }, 'changed')

    // [prop, Service, targetProp, transfrom = out => out]
    .bind('label', SomeService, 'service-prop', function(serviceProp) {
        return `transformed ${serviceProp}`
    })
```

```js
Widget.Label({
    label: SomeService.bind('service-prop').transfrom(serviceProp => {
        return `transformed ${serviceProp}`;
    }),
})
```

Services can be also connected outside of widgets

```js
SomeService.connect('changed', (service, ...args) => {
    print(service, ...args);
})
```

## List of builtin services

:::caution
Import `default` and don't import the service class from the module,
unless you need the type when using typescript.

```js
// this is the service singleton instance
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';

// this is also the service singleton instance
import { battery } from 'resource:///com/github/Aylur/ags/service/battery.js';

// DON'T import it this way, this is the class
import { Battery } from 'resource:///com/github/Aylur/ags/service/battery.js';
```

:::

:::tip
Every service has a `"changed"` signal which is emitted
on any kind of state change, unless stated otherwise.
:::

* [Applications](../services/applications)
* [Audio](../services/audio)
* [Battery](../services/battery)
* [Bluetooth](../services/bluetooth)
* [Hyprland](../services/hyprland)
* [Mpris](../services/mpris)
* [Network](../services/network)
* [Notifications](../services/notifications)
* [Power Profle](../services/power-profiles)
* [System Tray](../services/systemtray)
