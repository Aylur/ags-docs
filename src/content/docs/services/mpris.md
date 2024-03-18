---
title: Mpris
---

:::note
dependency: `gvfs` for cover art caching
NixOS: `services.gvfs`
:::

:::note
Not every media player supports `position`, `volume` and other functionality. Support varies from player to player. 
:::

## signals

* `changed`: emits on any state change except position change
* `player-changed`: `(busName: string)`
* `player-closed`: `(busName: string)`
* `player-added`: `(busName: string)`

## properties

* `players`: `Player[]` see below
* `cacheCoverArt`: `boolean` wether to cache `track-cover-url`, default: `true`

## methods

* `getPlayer`: `(string) => Player` returns Player that has given string in its busName

## Player

### signals

* `position`: `(position: number)` this is signaled when the position is set explicitly
* `closed`

### properties

* `bus-name`: `string` the dbus name that starts with `org.mpris.MediaPlayer2`
* `name`: `string` stripped from busName like `spotify` or `firefox`
* `identity`: `string` name of the player like `Spotify` or `Mozilla Firefox`
* `entry`: `string` .desktop entry without the extension
* `trackid`: `string`
* `track-artists`: `string[]` list of artists
* `track-title`: `string`
* `track-album`: `string`
* `track-cover-url`: `string` url to the cover art
* `cover-path`: `string` path to the cached cover art
* `metadata`: `{ [key: string]: unknown }` metadata object, see [freedesktop.org](https://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/) for known keys
* `play-back-status`: `"Playing" | "Paused" | "Stopped"`
* `can-go-next`: `boolean`
* `can-go-prev`: `boolean`
* `can-play`: `boolean`
* `shuffle-status`: `boolean | null` null if unsupported by the player
* `loop-status`: `"None" | "Track" | "Playlist" | null` null if unsupported by the player
* `volume`: `number` -1 if unsupported by the player
* `length`: `number` -1 if unsupported by the player
* `position`: `number` -1 if unsupported by the player

### methods

* `playPause`: `() => void`
* `play`: `() => void`
* `stop`: `() => void`
* `next`: `() => void`
* `previous`: `() => void`
* `shuffle`: `() => void`
* `loop`: `() => void`

## Example Widget

```js
const mpris = await Service.import('mpris')

/** @param {import('types/service/mpris').MprisPlayer} player */
const Player = player => Widget.Button({
    onClicked: () => player.playPause(),
    child: Widget.Label().hook(player, label => {
        const { track_artists, track_title } = player;
        label.label = `${track_artists.join(', ')} - ${track_title}`;
    }),
})

const players = Widget.Box({
    children: mpris.bind('players').as(p => p.map(Player))
})
```

## [Example Media Widget](https://github.com/Aylur/ags/tree/main/example/media-widget)

![media-widget](../../../assets/mpris.png)
