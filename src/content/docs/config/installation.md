---
title: Installation
description: How to install AGS
banner:
  content: You are looking at the legacy documentation of AGS v1. Go to <a href="https://aylur.github.io/ags/">aylur.github.io/ags</a> for AGS v2.
---

## Nix

maintainer: [@Aylur](https://github.com/Aylur)

The recommended way is the [Home Manager module](../home-manager)

you can try it without installing

```bash
nix run github:Aylur/ags
```

for activating binary cache add this lines to your configuration:

```nix
{
  nix.settings = {
    substituters = [
      "https://ags.cachix.org"
    ];
    trusted-public-keys = [
      "hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="
    ];
  };
}
```

## Arch

maintainer: [@kotontrion](https://github.com/kotontrion)

```bash
yay -S aylurs-gtk-shell # or aylurs-gtk-shell-git
```

## Fedora

maintainer: [@solopasha](https://github.com/solopasha)

```bash
sudo dnf copr enable solopasha/hyprland
sudo dnf install aylurs-gtk-shell
```

## From source

```bash
# Arch
sudo pacman -S typescript npm meson gjs gtk3 gtk-layer-shell gnome-bluetooth-3.0 upower networkmanager gobject-introspection libdbusmenu-gtk3 libsoup3
```

```bash
# Fedora
sudo dnf install typescript npm meson gjs-devel gtk3-devel gtk-layer-shell gnome-bluetooth upower NetworkManager pulseaudio-libs-devel libdbusmenu-gtk3 libsoup3
```

```bash
# Ubuntu
sudo apt install node-typescript npm meson libgjs-dev gjs libgtk-layer-shell-dev libgtk-3-dev libpulse-dev network-manager-dev libgnome-bluetooth-3.0-dev libdbusmenu-gtk3-dev libsoup-3.0-dev
```

```bash
# clone, build, install
git clone --recursive https://github.com/Aylur/ags.git
cd ags
npm install
meson setup build
meson install -C build
```

## Running

```bash
ags --help
```
