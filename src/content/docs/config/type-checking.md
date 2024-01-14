---
title: Type Checking
---

To have auto suggestions and type checking while working on the configuration,
you will need to setup a TypeScript LSP in your IDE.

:::note
dependencies for the setup script: `typescript`, `npm`
:::

:::caution
Bluetooth doesn't have type definitions yet.
:::

Copy the starter config

```bash
git clone https://github.com/Aylur/ags.git /tmp/starter-config
mkdir -p ~/.config/ags
cp /tmp/starter-config/ags/example/starter-config/* ~/.config/ags
```

Setup types

```bash
cd ~/.config/ags
./setup.sh
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
import App from 'resource:///com/github/Aylur/ags/app.js'
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'

const entry = App.configDir + '/ts/main.ts'
const outdir = '/tmp/ags/js'

try {
    await execAsync([
        'bun', 'build', entry,
        '--outdir', outdir,
        '--external', 'resource://*',
        '--external', 'gi://*',
    ])
} catch (error) {
    console.error(error)
}

const main = await import(`file://${outdir}/main.js`)

export default main.default
```

```ts
// ts/main.ts
import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const Bar = (monitor: number) => Widget.Window({
    name: `bar-${monitor}`,
})

export default {
    windows: [Bar(0)]
}
```
