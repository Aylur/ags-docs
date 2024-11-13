---
title: Audio
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
---

:::note
Gvc, the backend used for audio uses pulseaudio, so make sure `pipewire-pulse` is installed if using pipewire
:::

## signals

* `speaker-changed` default speaker's state changed
* `microphone-changed` default microphone' state changed
* `stream-added`: `(id: number)` new stream appeared
* `stream-removed`: `(id: number)` stream disappeared

## properties

* `control`: [Gvc.MixerControl](https://gjs-docs.gnome.org/gvc10~1.0/gvc.mixercontrol)
* `speaker`: `Stream` writable
* `microphone`: `Stream` writable
* `apps`: `Stream[]` list of streams filtered by sink inputs
* `recorders`: `Stream[]` list of streams filtered by source outputs
* `speakers`: `Stream[]` list of streams filtered by sinks
* `microphones`: `Stream[]` list of streams filtered by sources

## methods

* `getStream`: `(id: number) => Stream`

### Stream

* `stream` [Gvc.MixerStream](https://gjs-docs.gnome.org/gvc10~1.0/gvc.mixerstream) the wrapped stream object
* `name`: `string`
* `application_id`: `string|null`
* `description`: `string|null`
* `icon-name`: `string`
* `id`: `number`
* `is-muted`: `boolean` this returns if volume is 0, setting this to true sets volume to 0. If you want the actual `is-muted`, you can use `Stream.stream.isMuted`
* `volume`: `number`: writable, between 0 and 1

## Example Widgets

### Volume Slider

```js
const audio = await Service.import('audio')

/** @param {'speaker' | 'microphone'} type */
const VolumeSlider = (type = 'speaker') => Widget.Slider({
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => audio[type].volume = value,
    value: audio[type].bind('volume'),
})

const speakerSlider = VolumeSlider('speaker')
const micSlider = VolumeSlider('microphone')
```

### Indicator Icon

```js
const audio = await Service.import('audio')

const volumeIndicator = Widget.Button({
    on_clicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    child: Widget.Icon().hook(audio.speaker, self => {
        const vol = audio.speaker.volume * 100;
        const icon = [
            [101, 'overamplified'],
            [67, 'high'],
            [34, 'medium'],
            [1, 'low'],
            [0, 'muted'],
        ].find(([threshold]) => threshold <= vol)?.[1];

        self.icon = `audio-volume-${icon}-symbolic`;
        self.tooltip_text = `Volume ${Math.floor(vol)}%`;
    }),
})
```
