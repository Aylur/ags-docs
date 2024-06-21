---
title: Greetd
description: Login Manager
---

Look up how to enable and configure greetd for your distro.

## methods

* `login`: `(username: string, password: string, cmd: string | string[], env?: string[]) => Promise<Response>`: combines `createSession`, `postAuth`, `startSession`, `cancelSession`
* `createSession`: `(username: string) => Promise<Response>`
* `postAuth`: `(response: string) => Promise<Response>`
* `startSession`: `(cmd: string | string[], env?: string[]) => Promise<Response>`
* `cancelSession`: `() => Promise<Response>`

## Response

```ts
type Response = {
    type: 'success'
} | {
    type: 'error'
    error_type: 'auth_error' | 'error'
    description: string
} | {
    type: 'auth_message'
    auth_message_type: 'visible' | 'secret' | 'info' | 'error'
    auth_message: string
}
```

## Example

```js
// /etc/greetd/greeter.js
const greetd = await Service.import('greetd');

const name = Widget.Entry({
    placeholder_text: 'Username',
    on_accept: () => password.grab_focus(),
})

const password = Widget.Entry({
    placeholder_text: 'Password',
    visibility: false,
    on_accept: () => {
        greetd.login(name.text || '', password.text || '', 'Hyprland')
            .catch(err => response.label = JSON.stringify(err))
    },
})

const response = Widget.Label()

const win = Widget.Window({
    css: 'background-color: transparent;',
    anchor: ['top', 'left', 'right', 'bottom'],
    keymode: 'exclusive',
    child: Widget.Box({
        vertical: true,
        hpack: 'center',
        vpack: 'center',
        hexpand: true,
        vexpand: true,
        children: [
            name,
            password,
            response,
        ],
    }),
})

App.config({ windows: [win] })
```

```hypr
# /etc/greetd/hyprland.conf
exec-once = ags --config /etc/greetd/greeter.js; hyprctl dispatch exit
```

```toml
# /etc/greetd/config.toml
[default_session]
command = "Hyprland --config /etc/greetd/hyprland.conf"
```
