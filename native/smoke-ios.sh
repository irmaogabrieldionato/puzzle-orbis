#!/usr/bin/env bash
set -euo pipefail
app="${1:?Provide the simulator App.app path}"
id=$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' "$app/Info.plist")
simulator=$(xcrun simctl list devices available -j | python3 -c '
import json, sys
devices = json.load(sys.stdin)["devices"]
def version(value):
    return tuple(int(part) for part in value.rsplit("iOS-", 1)[-1].split("-"))
runtimes = sorted((key for key in devices if ".iOS-26-" in key),key=version,reverse=True)
for runtime in runtimes:
    for device in devices[runtime]:
        if device["isAvailable"] and device["name"].startswith("iPhone"):
            print(device["udid"])
            sys.exit(0)
sys.exit("No available iOS 26 iPhone simulator")
')
cleanup(){ xcrun simctl shutdown "$simulator" >/dev/null 2>&1 || true; }
trap cleanup EXIT
xcrun simctl bootstatus "$simulator" -b
xcrun simctl install "$simulator" "$app"
launch=$(xcrun simctl launch "$simulator" "$id")
printf '%s\n' "$launch"
pid=${launch##*: }
[[ "$pid" =~ ^[0-9]+$ ]]
sleep 5
kill -0 "$pid"
xcrun simctl terminate "$simulator" "$id"
