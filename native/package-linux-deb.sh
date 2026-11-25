#!/usr/bin/env bash
set -euo pipefail
target=native/linux-package
mkdir -p "$target/DEBIAN" "$target/opt" "$target/usr/bin" "$target/usr/share/applications" "$target/usr/share/icons/hicolor/512x512/apps"
cp -a native/dist/puzzle-orbis-linux-x64 "$target/opt/puzzle-orbis"
find "$target" -type d -exec chmod 0755 {} +
chmod 4755 "$target/opt/puzzle-orbis/chrome-sandbox"
ln -s /opt/puzzle-orbis/puzzle-orbis "$target/usr/bin/puzzle-orbis"
cp icons/icon-512.png "$target/usr/share/icons/hicolor/512x512/apps/puzzle-orbis.png"
cat >"$target/DEBIAN/control" <<'DEB'
Package: puzzle-orbis
Version: 0.1.0
Section: games
Priority: optional
Architecture: amd64
Depends: libgtk-3-0t64 | libgtk-3-0, libnss3, libgbm1, libasound2t64 | libasound2, libxss1
Maintainer: Puzzle Orbis
Description: Offline image puzzle game
 Solve puzzles with one, two, or three images.
DEB
cat >"$target/usr/share/applications/puzzle-orbis.desktop" <<'DESKTOP'
[Desktop Entry]
Name=Puzzle Orbis
Type=Application
Exec=/usr/bin/puzzle-orbis
Icon=puzzle-orbis
Terminal=false
Categories=Game;LogicGame;
DESKTOP
dpkg-deb --root-owner-group --build "$target" puzzle-orbis-linux-x64-beta.deb
