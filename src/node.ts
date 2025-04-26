import WebSocket from 'ws'

import * as core from './core.js'

/**
 * Connects to a WebSocket server and sets up the necessary event handlers for
 * reloading FXRs.
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function connect(portOrURL: number | string = 24621) {
  return core.connect(WebSocket, portOrURL)
}

/**
 * Reloads an FXR and respawns the lantern SpEffectVfx and updates its
 * midstSfxId.
 * @param fxr An FXR object, or an ArrayBuffer or ArrayBufferView containing
 * the contents of the FXR file.
 * @param dummyPoly The ID of the dummy poly to attach the SFX to.
 * 
 * **Default**: 160
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function reloadLanternFXR(
  fxr: ArrayBuffer | ArrayBufferView | core.FXRLike,
  dummyPoly?: number,
  portOrURL?: number | string,
) {
  return core.reloadLanternFXR(WebSocket, fxr, dummyPoly, portOrURL)
}

/**
 * Reload an FXR, and optionally respawn it as a resident SFX of a given
 * weapon.
 * @param fxr An FXR object, or an ArrayBuffer or ArrayBufferView containing
 * the contents of the FXR file.
 * @param respawn If set to true, this will disable the resident SFX on a
 * {@link weapon} for a short time and then enable it again, effectively
 * respawning the SFX. This allows an SFX attached to a weapon to automatically
 * update without manual interaction with the game.
 * 
 * **Default**: false
 * @param weapon When {@link respawn} is enabled, this is the numerical ID for
 * the weapon to change the resident SFX of. Use the {@link core.Weapon Weapon}
 * and {@link core.Affinity Affinity} enums to select a weapon easily.
 * 
 * **Default**: {@link core.Weapon.ShortSword Weapon.ShortSword}
 * @param dummyPoly When {@link respawn} is enabled, this is the ID of the
 * dummy poly to attach the SFX to.
 * 
 * **Default**: 120
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export default function reloadFXR(
  fxr: ArrayBuffer | ArrayBufferView | core.FXRLike,
  respawn?: boolean,
  weapon?: number,
  dummyPoly?: number,
  portOrURL?: number | string,
): Promise<void>;

/**
 * Reload multiple FXRs.
 * @param fxr An array of FXR objects, or ArrayBuffers or ArrayBufferViews
 * containing the contents of FXR files.
 */
export default function reloadFXR(
  fxrs: (ArrayBuffer | ArrayBufferView | core.FXRLike)[]
): Promise<void>;

export default function reloadFXR(
  fxrs: ArrayBuffer | ArrayBufferView | core.FXRLike | (ArrayBuffer | ArrayBufferView | core.FXRLike)[],
  respawn?: boolean,
  weapon?: number,
  dummyPoly?: number,
  portOrURL?: number | string,
): Promise<void> {
  return core.default(WebSocket, fxrs, respawn, weapon, dummyPoly, portOrURL)
}

export { reloadFXR }

export {
  Weapon,
  Affinity,
  GameName,
  RequestType,
  ReloaderResponse,
  ReloaderError,
  SingleReloadParams,
  MultiReloadParams,
  ReloadParams,
  WSLikeWebSocket,
  WSLikeWebSocketConstructor,
  FXRReloader,
  FXRLike,
  request,
} from './core.js'
