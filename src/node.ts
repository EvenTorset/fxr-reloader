import WebSocket from 'ws'

import createAPI from './core.js'

export const {
  connect,
  reloadLanternFXR,
  reloadFXR,
  getFXR,
  listFXRs,
} = createAPI(WebSocket)
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
