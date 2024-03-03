---
title: Type Checking
---

To have auto suggestions and type checking while working on the configuration,
you will need to setup a TypeScript LSP in your IDE.

:::caution
Bluetooth doesn't have type definitions yet.
:::

Use the `--init` cli flag that will setup a tsconfig.ts and
symlink the installed type definitions

```sh
ags --init
ags --init --config /path/to/config.js
```

If you don't want typechecking only suggestions in js files unset it in `tsconfig.json`

```json
"checkJs": false
```

## Using TypeScript

If you want to use TypeScript, you will need to handle the build step yourself.

Here is an example using `bun build`

```js
// config.js
const entry = App.configDir + '/ts/main.ts'
const outdir = '/tmp/ags/js'

try {
    await Utils.execAsync([
        'bun', 'build', entry,
        '--outdir', outdir,
        '--external', 'resource://*',
        '--external', 'gi://*',
    ])
    await import(`file://${outdir}/main.js`)
} catch (error) {
    console.error(error)
}
```

```ts
// ts/main.ts
const Bar = (monitor: number) => Widget.Window({
    name: `bar-${monitor}`,
    child: Widget.Label('hello'),
})

App.config({
    windows: [Bar(0)]
})
```
