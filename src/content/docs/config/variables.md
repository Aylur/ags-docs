---
title: Variables
description: Reactive variables
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
---

Variable is just a simple `GObject` that holds a value.

:::tip
The global `Variable` is a function that returns an instance
If you want to subclass this instead of `Service` import the class

```js
import { Variable as Var } from 'resource:///com/github/Aylur/ags/variable.js'
class MyVar extends Var {
    static { Service.register(this) }
}
```

:::

### Polling and Listening to executables

```js
const myVar = Variable('initial-value', {
    // listen is what will be passed to Utils.subprocess, so either a string or string[]
    listen: App.configDir + '/script.sh',
    listen: 'bash -c "some-command"',
    listen: ['bash', '-c', 'some-command'],

    // can also take a transform function
    listen: [App.configDir + '/script.sh', out => JSON.parse(out)],
    listen: [['bash', '-c', 'some-command'], out => JSON.parse(out)],

    // poll is a [interval: number, cmd: string[] | string, transform: (string) => any]
    // cmd is what gets passed to Utils.execAsync
    poll: [1000, 'some-command'],
    poll: [1000, 'some-command', out => 'transformed output: ' + out],
    poll: [1000, ['bash', '-c', 'some-command'], out => 'transformed output: ' + out],

    // or [number, function]
    poll: [1000, () => { return new Date(); }],
    poll: [1000, Math.random],
});
```

### Updating its value

```js
myVar.value = 'new-value'
myVar.setValue('new-value')
```

:::caution
using `setValue` will force a new value and thus signal `changed`,
while setting `value` only signal if it gets a new value

```js
const myVar = Variable({ key: "value" })
const value = myVar.value
value["new-key"] = "value"
myVar.value = value // won't emit, because its still the same object
myVar.setValue(value) // will emit the signal
```

:::

### Getting its value

```js
print(myVar.value)
print(myVar.getValue())
```

### Temporarily stopping it

```js
variable.stopListen() // this kills the subprocess
variable.stopPoll()
```

### Starting it

It will start on construction, no need to explicitly call this.

```js
variable.startListen() // launches the subprocess again 
variable.startPoll()
```

### Getting if its active

```js
print(variable.isListening)
print(variable.isPolling)
```

### Usage with widgets

```js
const label = Widget.Label({
    label: myVar.bind(),

    // optional transform method
    label: myVar.bind().as(value => value.toString()),

    // hook to do more than an assignment on changed
    setup: self => self.hook(myVar, () => {
        self.label = myVar.value.toString();
    })
})
```

### Connecting to it directly

```js
myVar.connect('changed', ({ value }) => {
    console.log(value);
});
```

### Dispose if no longer needed

This will stop the interval and force exit the subprocess

```js
myVar.dispose();
```

### Example RAM and CPU usage

```js
const divide = ([total, free]) => free / total

const cpu = Variable(0, {
    poll: [2000, 'top -b -n 1', out => divide([100, out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        .split(/\s+/)[1]
        .replace(',', '.')])],
})

const ram = Variable(0, {
    poll: [2000, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(1, 2))],
})

const cpuProgress = Widget.CircularProgress({
    value: cpu.bind()
})

const ramProgress = Widget.CircularProgress({
    value: ram.bind()
})
```

## Derived Variables

```js
const a = Variable(2)
const b = Variable(3)

// first argument is a list of dependencies
// second argument is a transform function
const c = Utils.derive([a, b], (a, b) => {
    return a * b
})
```
