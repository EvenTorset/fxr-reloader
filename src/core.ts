export enum RequestType {
  ReloadFXR = 0,
  SetResidentSFX = 1,
}

export type ReloaderResponse = {
  requestID: string
  status: string
}

export interface ReloadParams {
  /**
   * An ArrayBuffer or typed array containing the contents of the FXR file.
   */
  buffer: ArrayBuffer | ArrayBufferView
  /**
   * If set to true, this will disable the resident SFX on a {@link weapon}
   * for a short time and then enable it again, effectively respawning the SFX.
   * This allows an SFX attached to a weapon to automatically update without
   * manual interaction with the game.
   * 
   * **Default**: false
   */
  respawn?: boolean
  /**
   * When {@link respawn} is enabled, this is the numerical ID for the weapon
   * to change the resident SFX of.
   * 
   * **Default**: 24050000 (Ghostflame Torch)
   */
  weapon?: number
  /**
   * When {@link respawn} is enabled, this is the ID of the dummy poly to
   * attach the SFX to.
   * 
   * **Default**: 206
   */
  dummyPoly?: number
  /**
   * When {@link respawn} is enabled, this is the number of milliseconds to
   * wait after disabling the resident SFX before setting it back to the SFX
   * ID.
   * 
   * **Default**: 100
   */
  wait?: number
}

export interface WSLikeWebSocket {
  on(type: keyof WebSocketEventMap, listener: (data: string) => void): void
  on(type: 'error', listener: (err: any) => void): void
  send(msg: string): void
  close(): void
}

export interface WSLikeWebSocketConstructor {
  new(url: string): WSLikeWebSocket
}

export type FXRReloader = {
  /**
   * A WebSocket connected to fxr-ws-reloader.dll.
   */
  readonly ws: WSLikeWebSocket
  /**
   * Makes a request to fxr-ws-reloader.dll to do something. This is used
   * internally to make the necessary requests to reload FXRs.
   */
  request(obj: any): Promise<void>
  /**
   * Reload an FXR, and optionally respawn it as a resident SFX of a given
   * weapon.
   */
  reload(obj: ReloadParams): Promise<void>
}

const requestMap = new Map<string, (res: ReloaderResponse) => void>

/**
 * Connects to a WebSocket server and sets up the necessary event handlers for
 * reloading FXRs.
 * @param portOrURL The port number or URL string to connect to. By default, it
 * will try to connect to `ws://localhost:24621`, and setting only the port
 * will just replace the port number.
 */
export function connect(WebSocketClass: WSLikeWebSocketConstructor, portOrURL: number | string = 24621) {
  const url = typeof portOrURL === 'number' ?
    `ws://localhost:${portOrURL}` :
    portOrURL
  const ws = new WebSocketClass(url)
  ws.on('message', (data: string) => {
    const res: ReloaderResponse = JSON.parse(data)
    if (requestMap.has(res.requestID)) {
      ;(requestMap.get(res.requestID) as (res: ReloaderResponse) => void)(res)
      requestMap.delete(res.requestID)
    }
  })
  return new Promise<FXRReloader>((fulfil, reject) => {
    ws.on('error', (err: any) => {
      console.error(
        'Failed to connect to WebSocket server!',
        'Is the game running, and is the DLL mod installed?'
      )
      reject(err)
    })
    ws.on('open', () => {
      fulfil({
        ws,
        request(obj: any) { return request(ws, obj) },
        reload(obj: ReloadParams) { return reload(ws, obj) }
      })
    })
  })
}

function randomString(length: number) {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map(n =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[n%62]
    )
    .join('')
}

/**
 * Makes a request to fxr-ws-reloader.dll to do something. This is used
 * internally to make the necessary requests to reload FXRs.
 */
export function request(ws: WSLikeWebSocket, obj: any) {
  let id = randomString(32)
  while (requestMap.has(id)) {
    id = randomString(32)
  }
  ws.send(JSON.stringify(Object.assign({}, obj, { requestID: id })))
  return new Promise<void>((fulfil, reject) =>
    requestMap.set(id, (res: ReloaderResponse) => {
      if (res.status === 'success') {
        fulfil()
      } else {
        reject(res.status)
      }
    })
  )
}

async function bufferToBase64(buffer: ArrayBuffer | ArrayBufferView) {
  try {
    if (ArrayBuffer.isView(buffer)) {
      return Buffer.from(buffer.buffer).toString('base64')
    }
    return Buffer.from(buffer).toString('base64')
  } catch {
    const base64url = await new Promise<string>(fulfil => {
      const reader = new FileReader()
      reader.onload = () => fulfil(reader.result as string)
      reader.readAsDataURL(new Blob([ buffer ]))
    })
    return base64url.slice(base64url.indexOf(',') + 1)
  }
}

/**
 * Reload an FXR, and optionally respawn it as a resident SFX of a given
 * weapon.
 * @param ws A WebSocket connected to fxr-ws-reloader.dll.
 */
export async function reload(ws: WSLikeWebSocket, {
  buffer,
  respawn,
  wait = 100,
  weapon = 24050000,
  dummyPoly = 206
}: ReloadParams) {
  // Reload the FXR
  await request(ws, {
    type: RequestType.ReloadFXR,
    file: await bufferToBase64(buffer)
  })

  if (respawn) {
    // Remove the weapon's resident SFX
    await request(ws, {
      type: RequestType.SetResidentSFX,
      weapon,
      sfx: -1,
      dmy: -1,
    })

    // Wait for a short while before setting the SFX ID
    await new Promise(f => setTimeout(f, wait))

    // Set the resident SFX ID to the ID in the FXR
    const dv = new DataView(
      buffer instanceof ArrayBuffer ? buffer : buffer.buffer
    )
    await request(ws, {
      type: RequestType.SetResidentSFX,
      weapon,
      sfx: dv.getInt32(12, true),
      dmy: dummyPoly,
    })
  }
}

export default async function reloadFXR(
  WebSocketClass: WSLikeWebSocketConstructor,
  buffer: ArrayBuffer | ArrayBufferView,
  respawn?: boolean,
  weapon?: number,
  dummyPoly?: number,
  portOrURL?: number | string,
) {
  const reloader = await connect(WebSocketClass, portOrURL)
  await reloader.reload({
    buffer,
    respawn,
    weapon,
    dummyPoly,
  })
  reloader.ws.close()
}
