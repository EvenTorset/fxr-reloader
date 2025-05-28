# FXR Reloader
This is a library for controlling the [FXR WebSocket Reloader](https://github.com/EvenTorset/fxr-ws-reloader) DLL mod for Elden Ring from JavaScript.

The primary purpose of it is to allow scripts using the [@cccode/fxr](https://www.npmjs.com/package/@cccode/fxr) library to directly put the FXR that is being created or edited into the game and respawn it so that it can be viewed without any manual interaction with the game. This effectively makes the game an almost live preview of the effect while you're working on it.

## Installation
```bash
npm i fxr-reloader
```

Note that this library does not do anything on its own. It requires the [FXR WebSocket Reloader](https://github.com/EvenTorset/fxr-ws-reloader) DLL mod for Elden Ring to be installed and running. See the README for that on how to install it.

## Usage
This library exports a default function that should be all you need in most cases. It simply takes an FXR object from the `@cccode/fxr` library, or an ArrayBuffer or ArrayBufferView of the contents of the FXR file, and optionally some extra settings for controlling if and how the SFX is respawned, and what WebSocket address to connect to.

### Example
```js
import { BasicNode, BillboardEx, FXR, Game } from '@cccode/fxr'
import reloadFXR, { Weapon, Affinity } from 'fxr-reloader'

// Use @cccode/fxr to create a new FXR with a big red square
const fxr = new FXR(1, true, [
  new BasicNode([
    new BillboardEx({
      color1: [1, 0, 0, 1]
    })
  ])
])

// Reload the FXR and respawn it by attaching it to the Short Sword (with
// standard affinity) at dummy poly 120
await reloadFXR(fxr, true, Weapon.ShortSword + Affinity.Standard, 120)
```
The weapon and dummy poly IDs used there are the defaults, so this would be equivalent in this case:
```js
await reloadFXR(fxr, true)
```
You can also just reload the effect without respawning it:
```js
await reloadFXR(fxr)
```
Multiple FXR files can be reloaded at once by passing an array of FXR objects:
```js
await reloadFXR([fxr1, fxr2, fxr3])
```
If you also provide a port number or URL, it will try to connect to that WebSocket server instead of the default (ws://localhost:24621). The DLL mod's port can be changed by editing its JSON config file.
```js
// Try to connect to ws://localhost:9003
await reloadFXR(fxr, true, Weapon.ShortSword, 120, 9003)

// Try to connect to ws://example.com:9003
await reloadFXR(fxr, true, Weapon.ShortSword, 120, 'ws://example.com:9003')
```

### Advanced usage
The default function should be all you need for most cases, but there are some cases where it would have poor performance compared to other methods, or you may want to do something else than just reloading and respawning a weapon effect.

If you need to use these functions, I recommend just checking out the source code in this repo. It's nice and short, and decently documented with JSDoc comments.

Here's a very brief overview of the named exports:
- `Weapon`: An enum with IDs for all weapons in Elden Ring.
- `Affinity`: An enum with ID offsets for all weapon affinities in Elden Ring.
- `connect`: This function takes a port number or a URL string and uses that to try to connect to a WebSocket server. It returns a promise that resolves with a reloader object containing information about the reloader DLL and the game, as well as functions for interacting with the DLL.
- `reloadFXR`: This is the same as the default export.
- `reloadLanternFXR`: Reloads an effect and respawns it by replacing the lantern effect instead of a weapon effect.
- `fetchFXR`: Fetches an FXR file from the game's memory and returns it as a Uint8Array.
- `listFXRs`: Lists all loaded FXR files in the game's memory by their ID.

## Command line
This package also provides a command that can reload an FXR file:
```
npx reload-fxr <file path> [<weapon ID>] [<dummy poly ID>] [<port or URL>]
```
Examples:
```bash
# Reload f000402030.fxr
npx reload-fxr f000402030.fxr

# Reload and respawn f000402030.fxr
npx reload-fxr f000402030.fxr ShortSword 120

# Using the raw weapon ID instead of the name
npx reload-fxr f000402030.fxr 2010000 120

# Using a different weapon affinity than standard
npx reload-fxr f000402030.fxr ShortSword+Keen 120

# Reload and respawn f000402030.fxr using port 9003 for the WebSocket
npx reload-fxr f000402030.fxr ShortSword 120 9003
```
If you want to use the command from any folder, install the library globally:
```bash
npm i -g fxr-reloader
```
This allows you to use it from anywhere, and without `npx`:
```bash
reload-fxr f000402030.fxr ShortSword 120
```
