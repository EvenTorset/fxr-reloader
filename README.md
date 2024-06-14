# FXR Reloader
This is a library for controlling the [FXR WebSocket Reloader](https://github.com/EvenTorset/fxr-ws-reloader) DLL mod for Elden Ring from JavaScript.

The primary purpose of it is to allow scripts using the [@cccode/fxr](https://www.npmjs.com/package/@cccode/fxr) library to directly put the FXR that is being created or edited into the game and respawn it so that it can be viewed without any manual interaction with the game. This effectively makes the game an almost live preview of the effect while you're working on it.

## Installation
```bash
npm i fxr-reloader
```

Note that this library does not do anything on its own. It requires the [FXR WebSocket Reloader](https://github.com/EvenTorset/fxr-ws-reloader) DLL mod for Elden Ring to be installed and running. See the README for that on how to install it.

## Usage
This library exports a default function that should be all you need in most cases. It simply takes an ArrayBuffer or typed array of the contents of the FXR file, and optionally some extra settings for controlling if and how the SFX is respawned, and what WebSocket address to connect to.

### Example
```js
import { BasicNode, BillboardEx, FXR, Game } from '@cccode/fxr'
import reloadFXR from 'fxr-reloader'

// Use @cccode/fxr to create a new FXR with a big red square
const fxr = new FXR(402030)
fxr.root.nodes = [
  new BasicNode([
    new BillboardEx({
      color1: [1, 0, 0, 1]
    })
  ])
]
const buffer = fxr.toArrayBuffer(Game.EldenRing)

// Reload the FXR and respawn it by attaching it to weapon 24050000 (Ghostflame
// Torch) at dummy poly 206
await reloadFXR(buffer, true, 24050000, 206)
```
The weapon and dummy poly IDs used there are the defaults, so this would be equivalent in this case:
```js
await reloadFXR(buffer, true)
```
You can also just reload the effect without respawning it:
```js
await reloadFXR(buffer)
```
If you also provide a port number or URL, it will try to connect to that WebSocket server instead of the default (ws://localhost:24621). The DLL mod's port can be changed by editing its JSON config file.
```js
// Try to connect to ws://localhost:9003
await reloadFXR(buffer, true, 24050000, 206, 9003)

// Try to connect to ws://example.com:9003
await reloadFXR(buffer, true, 24050000, 206, 'ws://example.com:9003')
```

### Advanced usage
The default function should be good enough for most cases, but there are some cases where it would have poor performance compared to other methods. This is why the library also has named exports for all of the functions used by the default function.

If you need to use these functions for some reason, I recommend just checking out the source code in this repo. It's nice and short, and decently documented with JSDoc comments.

Here's a very brief overview of the named exports:
- `connect`: This function takes a port number or a URL string and uses that to try to connect to a WebSocket server. It returns a promise that resolves with a reloader object containing the WebSocket object, a request function, and a reload function.
- `request`: This function makes a request to a given WebSocket. It automatically handles the request ID, and it returns a promise that resolves when it has received a response from the server. If the request did not succeed, the returned promise rejects with the status from the response.
- `reload`: This is pretty much the same as the default function, but it takes a WebSocket object directly, which means you can use this with your own WebSocket client.

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
npx reload-fxr f000402030.fxr 24050000 206

# Reload and respawn f000402030.fxr using port 9003 for the WebSocket
npx reload-fxr f000402030.fxr 24050000 206 9003
```
If you want to use the command from any folder, install the library globally:
```bash
npm i -g fxr-reloader
```
This allows you to use it from anywhere, and without `npx`:
```bash
reload-fxr f000402030.fxr 24050000 206
```
