---
title: Subclassing GTK Widgets
description: Using GTK widgets not builtin
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
---

## Using Gtk.Widgets not builtin

Use them like regular GTK widgets

```js
import Gtk from 'gi://Gtk'

const calendar = new Gtk.Calendar({
    showDayNames: false,
    showHeading: true,
})
```

You can subclass Gtk.Widget not builtin to behave like AGS widgets.

```js
const Calendar = Widget.subclass(Gtk.Calendar)

const myCalendar = Calendar({
    showDayNames: false,
    showHeading: true,

    // now you can set AGS props
    className: 'my-calendar',
    setup(self) {
        self.bind()
    }
})
```

:::tip
Calendar is available on `Widget`
:::
:::note
Open up an issue/PR if you want to see a widget to be available on `Widget` by default.
:::

## Custom Subclassing

Usually in GTK custom widgets are achieved by subclassing.
The idea behind AGS is to use functions that create widgets
and utilize [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

```js
function CounterButton(({ color = 'aqua', ...rest })) {
    const count = Variable(0)

    const label = Widget.Label({
        label: count.bind().as(v => `count: ${v}`),
        style: `color: ${color}`,
    })

    return Widget.Button({
        ...rest, // spread passed parameters
        child: label,
        onClicked: () => count++,
    })
}

// then simply call it
const button = CounterButton({
    color: 'blue',
    className: 'my-widget',
})
```

This approach comes with the limitation that parameters passed to these
functions are that, just parameters and not `GObject` properties.
If you still want to subclass, you can do so by subclassing
a Gtk.WIdget and registering it `Widget.register`.

```js
class CounterButton extends Gtk.Button {
    static {
        Widget.register(this, {
            properties: {
                'count': ['int', 'rw']
            }
        })
    }

    // the super constructor will take care of setting the count prop
    // so you don't have to explicitly set count in the constructor
    constructor(props) {
        super(props)

        const label = new Gtk.Label({
            label: `${this.count}`,
        })

        this.add(label)

        this.connect('clicked', () => {
            this.count++
            label.label = `${this.count}`
        })
    }

    get count() {
        return this._count || 0
    }

    set count(num) {
        this._count = num
        this.notify('count')
    }
}
```

You can now construct it like any other Gtk.Widget with the `new` keyword.

```js
const counterButton = new CounterButton({
    count: 0,

    // you can set AGS widget props on it
    className: '',
})

counterButton.connect('notify::count', ({ count }) => {
    print(count);
})

counterButton.count += 1
```

:::tip
You will never actually need to subclass, you can *fake* gobject props using Variables

```js
function CounterButton({ count, ...props }) {
    const counter = Variable(count)

    const button = Widget.Button({
        on_clicked: () => counter.value += 1,
        child: Widget.Label({
            label: counter.bind().as(c => `${c}`),
        }),
        ...props,
    })

    return Object.assign(button, {
        count: counter,
    })
}

const counterButton = CounterButton({
    count: 0,
})

counterButton.count.connect("changed", ({ value }) => {
    print(value)
})

counterButton.count.value += 1
```

:::
