---
title: Reactivity
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
---

In order for widgets to have dynamic content we pass `Binding`s as properties
or setup a `hook`.
A `Binding` is just an object that holds information for widget constructors
to setup a listener.

:::caution
`Binding` is a regular JavaScript object,
it cannot be used in template strings

```js
const label = Variable("hello")

Label({
    // [Object object] world
    label: `${label.bind()} world`,

    // hello world
    label: label.bind().as(hello => `${hello} world`)
})
```

:::

## Property Bindings

We can make a `Binding` from a Variable

```js
const percent = Variable(0.5)
const slider = Widget.Slider({
    value: percent.bind(),
    onChange: ({ value }) => percent.value = value,
})
```

From a `Service`

```js
const { speaker } = await Service.import("audio")
const slider = Widget.Slider({
    value: speaker.bind("volume"),
    onChange: ({ value }) => speaker.volume = value,
})
```

Merge any number of `Binding`s into another `Binding`

```js
const a = Variable(0.3)
const b = Variable(0.7)
const merged = Utils.merge([a.bind(), b.bind()], (a, b) => {
    return a * b
})

const level = Widget.LevelBar({
    value: merged
})
```

Turn one or multiple Service signals into a `Binding`

```js
const mpris = await Service.import("mpris")

const label = Widget.Label({
    label: Utils.watch("initial-label", mpris, "player-added", (busName) => {
        return `player ${busName} was added`
    })
})

const label = Widget.Label({
    label: Utils.watch("initial-label", [
        [mpris, "player-added"],
        [mpris, "player-removed"],
    ], (busName) => {
        return `player ${busName} was added or removed`
    })
})
```

A `Binding` can be transformed according to need

```js
const num = Variable(0)

const label = Widget.Label({
    // will throw an error, because number is not assignable to string
    label: num.bind(),

    // will have to be transformed
    label: num.bind().as(n => n.toString()),
    label: num.bind().as(String)
})
```

## Hooks

You can call these on any Widget that you have a reference on.
They will return `this` reference, meaning you
can chain them up in any order in any number.

```js
const widget = Widget()
widget.hook()
widget.on()
widget.poll()
widget.keybind()
```

```js
const widget = Widget()
    .hook()
    .on()
```

```js
const widget = Widget({
    setup: self => {
        self.hook()
        self.on()
    }
})
```

```js
const widget = Widget({
    setup: self => self
        .hook()
        .on()
})
```

### Hook

`hook` will setup a listener to a `GObject` and will handle disconnection
when the widget is destroyed. It will connect
to the `changed` signal by default when not specified otherwise.

```js
const battery = await Service.import("battery")

// .hook(GObject, callback, signal?)
const BatteryPercent = () => Label()
    .hook(battery, self => {
        self.label = `${battery.percent}%`
        self.visible = battery.available
    }, "changed")
```

:::caution
A `hook` callback will be executed on startup.
If you are connecting to a signal that has an argument
you will need to check if its defined first

```js
const mpris = await Service.import("mpris")
const label = Widget.Label().hook(mpris, (self, busName) => {
    if (!busName)
        return // skip startup execution

    self.label = busName
}, "player-added")
```

:::

### On

`on` is the same as `connect` but instead of the signal handler id,
it returns a reference to the widget. `on` will setup a callback on a widget signal.

These two are equivalent

```js
function MyButton() {
    const self = Widget.Button()

    self.connect("clicked", () => {
        print(self, "is clicked")
    })

    return self
}
```

```js
const MyButton = () => Widget.Button()
    .on("clicked", self => {
        print(self, "is clicked")
    })
```

:::note
Most signals like `clicked` are available as a property on the widget.
So its rare that `.on` or `.connect` will be needed.

```js
Widget.Button({
    on_clicked: self => print(self, "was clicked")
})
```

:::

### Poll

Avoid using this as much as possible, using this is considered bad practice.

These two are equivalent

```js
function MyLabel() {
    const self = Widget.Label()

    Utils.interval(1000, () => {
        self.label = Utils.exec('date')
    }, self)

    return self
}
```

```js
const MyLabel = () => Widget.Label()
    .poll(1000, self => {
        self.label = Utils.exec('date')
    })
```

### Keybind

It is possible to setup keybindings on focused widgets

```js
// usually this way
Widget.Button().on("key-press-event", (self, event) => {
    // check event for keys
})

// with .keybind()
Widget.Button().keybind(["MOD1", "CONTROL"], "a", (self, event) => {
    print("alt+control+a was pressed")
})
```
