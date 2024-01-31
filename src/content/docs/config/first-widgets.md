---
title: Your First Widget
description: Starting point to understanding how AGS works
---

Start by creating `~/.config/ags/config.js` with the following contents:

```js
// ~/.config/ags/config.js
export default {
    windows: [
        // this is where window definitions will go
    ]
}
```

then run `ags` in the terminal

```bash
ags
```

You will see nothing happen, just AGS hanging,
this is because you have an empty config.
Running `ags` will execute the config like a regular script,
it is just a library over GTK, and its on **you** to program your windows and widgets.

:::tip
run `ags --init` to generate a `tsconfig.json` and **symlink** the generated types,
that will provide typesafety and autosuggestions
:::

## Top Level: Window

The top level container is a Window that will hold widgets.

```js
const myLabel = Widget.Label({
    label: 'some example content',
})

const myBar = Widget.Window({
    name: 'bar',
    anchor: ['top', 'left', 'right'],
    child: myLabel,
})

export default { windows: [myBar] }
```

:::tip
GObject properties can be accessed or set in multiple ways:
with `camelCase`, `snake_case`, and `kebab-case`

```js
const w = Widget({
    className: 'my-label',
    class_name: 'my-label',
    'class-name': 'my-label',
})

w.className = ''
w.class_name = ''
w['class-name'] = ''

w['className'] = ''
w['class_name'] = ''
```

:::

## Reusable Widgets

Both `myLabel` and `myBar` constants we declared are a **single instance**
of a `Gtk.Widget`. What if you have two monitors and want to have
a bar for each? Make a function that returns a `Gtk.Widget` instance.

```js
function Bar(monitor = 0) {
    const myLabel = Widget.Label({
        label: 'some example content',
    })

    return Widget.Window({
        monitor,
        name: `bar${monitor}`, // this name has to be unique
        anchor: ['top', 'left', 'right'],
        child: myLabel,
    })
}

export default {
    windows: [
        Bar(0), // can be instantiated for each monitor
        Bar(1),
    ],
}
```

:::note
The `name` attribute only has to be unique,
if it is passed to `windows` in the exported object.

Calling `Widget.Window` will create and show the window by default.
It is not necessary to pass a reference to `windows` in
the exported object, but if it is not,
it can't be toggled with `ags --toggle-window` or through `App.toggleWindow`
:::

## Dynamic Content

Alright, but **static** text is boring, let's make it **dynamically** change by updating the label every second with a `date`.

```js
function Bar(monitor = 0) {
    const myLabel = Widget.Label({
        label: 'some example content',
    })

    Utils.interval(1000, () => {
        myLabel.label = Utils.exec('date')
    })

    return Widget.Window({
        monitor,
        name: `bar${monitor}`,
        anchor: ['top', 'left', 'right'],
        child: myLabel,
    })
}
```

:::note
JavaScript is **single threaded** and `exec` is a **blocking operation**,
for a `date` call it's fine, but usually you want to use its **async** version: `execAsync`.
:::

Looking great, but that code has too much boilerplate.
Let's use a [fat arrow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
instead of the `function` keyword, and instead of calling `interval`
let's use the `poll` method.

```js
const Bar = (monitor = 0) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    child: Widget.Label()
        .poll(1000, label => label.label = exec('date')),
})
```

:::tip
That is still not the best solution, because when you instantiate multiple
instances of `Bar` each will call `exec` separately.
What you want to do is move the date into a `Variable` and `bind` it.

```js
const date = Variable('', {
    poll: [1000, 'date'],
})

const Bar = () => Widget.Window({
    child: Widget.Label({ label: date.bind() })
})
```

:::

## Signals

Usually it is best to avoid polling. Rule of thumb: the less intervals the better.
This is where `GObject` shines. We can use **signals** for pretty much everything.

anytime `myVariable.value` changes it will send a signal
and things can react to it

```js
const myVariable = Variable(0)
```

for example execute a callback

```js
myVariable.connect('changed', ({ value }) => {
    print('myVariable changed to ' + `${value}`)
})
```

**bind** its value to a widget's property

```js
const bar = Widget.Window({
    name: 'bar',
    child: Widget.Label({
        label: myVariable.bind().transform(v => `value: ${v}`)
    }),
})

```

incrementing the `value` causes the label to update and the callback to execute

```js
myVariable.value++
```

For example with `pactl` it is possible to query information about the volume level,
but we don't want to have an interval that checks it periodically.
We want a **signal** that signals every time its **changed**,
so that we only do operations when its needed, and therefore we don't waste resources.
`pactl subscribe` writes to stdout everytime there is a **change**.

```js
const pactl = Variable({ count: 0, msg: '' }, {
    listen: ['pactl subscribe', (msg) => ({
        count: pactl.value.count + 1,
        msg: msg,
    })],
})

pactl.connect('changed', ({ value }) => {
    print(value.msg, value.count)
})

const label = Widget.Label({
    label: pactl.bind().transform(({ count, msg }) => {
        return `${msg} ${count}`
    })),
})

// widgets are GObjects too
label.connect('notify::label', ({ label }) => {
    print('label changed to ', label)
})
```

## Avoiding external scripts

For *most* of your system, you don't have to use external
scripts and binaries to query information.
AGS has builtin [Services](../services).
They are just like [Variables](../variables) but instead
of a single `value` they have more attributes and methods on them.

```js
const battery = await Service.import('battery')

const batteryProgress = Widget.CircularProgress({
    value: battery.bind('percent').transform(p => p / 100),
    child: Widget.Icon({
        icon: battery.bind('icon_name'),
    }),
})
```
