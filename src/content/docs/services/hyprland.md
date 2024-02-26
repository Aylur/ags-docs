---
title: Hyprland
---

## signals

* `event`: `(name: string, data: string)`: [hyprland ipc events](https://wiki.hyprland.org/IPC/#events-list)
* `urgent-window`: `(windowaddress: string)`
* `keyboard-layout`: `(keyboardname: string, layoutname: string)`
* `submap`: `(name: string)`
* `monitor-added`: `(name: number)`
* `monitor-removed`: `(name: number)`
* `workspace-added`: `(name: number)`
* `workspace-removed`: `(name: number)`
* `client-added`: `(address: string)`
* `client-removed`: `(address: string)`

## properties

* `active`: `Active` see below
* `monitors`: `Monitor[]` a Monitor is the object you would get with `hyprctl monitors -j`
* `workspaces`: `Workspace[]` a Workspace is the object you would get with `hyprctl workspaces -j`
* `clients`: `Client[]` a Client is the object you would get with `hyprctl clients -j`

## methods

* `getMonitor`: `(id: number) => Monitor`
* `getWorkspace`: `(id: number) => Workspace`
* `getClient`: `(address: string) => Client`
* `message`: `(msg: string) => string`: send a message to the [hyprland socket](https://wiki.hyprland.org/IPC/#tmphyprhissocketsock)
* `messageAsync`: `(msg: string) => Promise<string>`: async version of message

## Active

```ts
interface Active {
    monitor: {
        id: number
        name: string
    },
    workspace: {
        id: number
        name: string
    },
    client: {
        address: string
        title: string
        class: string
    },
}
```

The `active` property is composed by subservices, meaning you connect to any sub prop

```js
const widget = Widget({
    setup: self => self
        .hook(hyprland, self => {})
        .hook(hyprland.active, self => {})
        .hook(hyprland.active.monitor, self => {})
        .hook(hyprland.active.workspace, self => {})
        .hook(hyprland.active.client, self => {})

        .bind('prop', hyprland, 'active', active => {})
        .bind('prop', hyprland.active, 'monitor', monitor => {})
        .bind('prop', hyprland.active, 'workspace', ws => {})
        .bind('prop', hyprland.active, 'client', client => {})
        .bind('prop', hyprland.active.monitor, 'id', id => {})
        .bind('prop', hyprland.active.workspace, 'id', id => {})
        .bind('prop', hyprland.active.client, 'address', address => {}),
})
```

## Example Widget

```js
const hyprland = await Service.import('hyprland')

const focusedTitle = Widget.Label({
    label: hyprland.active.client.bind('title'),
    visible: hyprland.active.client.bind('address')
        .as(addr => !!addr),
})

const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);

const Workspaces = () => Widget.EventBox({
    onScrollUp: () => dispatch('+1'),
    onScrollDown: () => dispatch('-1'),
    child: Widget.Box({
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
            attribute: i,
            label: `${i}`,
            onClicked: () => dispatch(i),
        })),

        // remove this setup hook if you want fixed number of buttons
        setup: self => self.hook(hyprland, () => self.children.forEach(btn => {
            btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute);
        })),
    }),
})
```
