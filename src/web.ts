import type { WSLikeWebSocket as WSLWS } from './core.js'
import createAPI from './core.js'

class WSLikeWebSocket extends WebSocket implements WSLWS {
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

export const {
  connect,
  reloadLanternFXR,
  reloadFXR,
  getFXR,
  listFXRs,
} = createAPI(WSLikeWebSocket)
export default reloadFXR

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
  FXRReloader,
  FXRLike,
} from './core.js'
