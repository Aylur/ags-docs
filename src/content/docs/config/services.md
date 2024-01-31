---
title: Services
description: Builtig services to query system information
---

A Service is an instance of a [GObject.Object](https://gjs-docs.gnome.org/gobject20~2.0/gobject.object)
that emits signals when its state changes.
Widgets can connect to them and execute a callback function on their signals
which are usually functions that updates the widget's properties.

```js
const widget = Widget.Label()
    // the signal is 'changed' if not specified
    // [Service, callback, signal = 'changed']
    .hook(someService, function(self, ...args) {
        // there can be other arguments based on signals
        self.label = 'new label'
    }, 'changed')

    // [prop, Service, targetProp, transfrom = out => out]
    .bind('label', SomeService, 'service-prop', function(serviceProp) {
        return `transformed ${serviceProp}`
    })
```

```js
Widget.Label({
    label: someService.bind('service-prop').transfrom(serviceProp => {
        return `transformed ${serviceProp}`
    }),
})
```

Services can be also connected outside of widgets

```js
someService.connect('changed', (service, ...args) => {
    print(service, ...args)
})
```

:::caution
If you reference a widget inside `someService.connect`, make sure to
handle disconnection aswell if that widget is destroyed
:::

## List of builtin services

use `Service.import`

```js
const battery = await Service.import('battery')
```

or if you prefer static import

```js
import { battery } from 'resource:///com/github/Aylur/ags/service/battery.js';
```

:::caution
Import `default` and don't import the service class from the module,
unless you need the type when using typescript.

```js
// this is the service singleton instance
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';

// this is also the service singleton instance
import { battery } from 'resource:///com/github/Aylur/ags/service/battery.js';

Battery === battery // true
```

```js
// DON'T import it this way, this is the class
import { Battery } from 'resource:///com/github/Aylur/ags/service/battery.js';
```

:::

:::tip
Every service has a `"changed"` signal which is emitted
on any kind of state change, unless stated otherwise.
:::

* [applications](../../services/applications)
* [audio](../../services/audio)
* [battery](../../services/battery)
* [bluetooth](../../services/bluetooth)
* [greetd](../../services/greetd)
* [hyprland](../../services/hyprland)
* [mpris](../../services/mpris)
* [network](../../services/network)
* [notifications](../../services/notifications)
* [power Profle](../../services/power-profiles)
* [system Tray](../../services/systemtray)
