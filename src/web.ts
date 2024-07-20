import * as core from './core.js'

class WSLikeWebSocket extends WebSocket implements core.WSLikeWebSocket {
  constructor(url: string) {
    super(url)
  }
  on(type: keyof WebSocketEventMap, listener: (event: any) => any): void {
    this.addEventListener(type, (event: MessageEvent<any> | Event | CloseEvent) => {
      if ('data' in event) {
        listener(event.data)
      } else {
        listener(event)
      }
    })
  }
}

/**
 * Connects to a WebSocket server and sets up the necessary event handlers for
 * reloading FXRs.
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function connect(portOrURL: number | string = 24621) {
  return core.connect(WSLikeWebSocket, portOrURL)
}

/**
 * Updates a list of params with new field values for any number of rows.
 * @param params Object where the keys are param names and the values are
 * objects where the keys are row IDs and the values are objects where the keys
 * are field names and the values are field values.
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function setParams(
  params: core.Params,
  portOrURL?: number | string,
) {
  return core.setParams(WSLikeWebSocket, params, portOrURL)
}

/**
 * Reloads an FXR and respawns the lantern SpEffectVfx and updates its
 * midstSfxId.
 * @param buffer An ArrayBuffer or ArrayBufferView containing the contents of
 * the FXR file.
 * @param dummyPoly The ID of the dummy poly to attach the SFX to.
 * 
 * **Default**: 160
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function reloadLanternFXR(
  buffer: ArrayBuffer | ArrayBufferView,
  dummyPoly?: number,
  portOrURL?: number | string,
) {
  return core.reloadLanternFXR(WSLikeWebSocket, buffer, dummyPoly, portOrURL)
}

/**
 * Reload an FXR, and optionally respawn it as a resident SFX of a given
 * weapon.
 * @param buffer An ArrayBuffer or ArrayBufferView containing the contents of
 * the FXR file.
 * @param respawn If set to true, this will disable the resident SFX on a
 * {@link weapon} for a short time and then enable it again, effectively
 * respawning the SFX. This allows an SFX attached to a weapon to automatically
 * update without manual interaction with the game.
 * 
 * **Default**: false
 * @param weapon When {@link respawn} is enabled, this is the numerical ID for
 * the weapon to change the resident SFX of. Use the {@link core.Weapon Weapon}
 * enum to select a weapon easily.
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
  buffer: ArrayBuffer | ArrayBufferView,
  respawn?: boolean,
  weapon?: core.Weapon,
  dummyPoly?: number,
  portOrURL?: number | string,
) {
  return core.default(WSLikeWebSocket, buffer, respawn, weapon, dummyPoly, portOrURL)
}

export { reloadFXR }

export {
  Weapon,
  Affinity,
  RequestType,
  ReloaderResponse,
  ReloadParams,
  WSLikeWebSocket,
  WSLikeWebSocketConstructor,
  Params,
  ParamRow,
  FXRReloader,
  request,
} from './core.js'
