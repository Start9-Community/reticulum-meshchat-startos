import { sdk } from './sdk'

export const webPort = 8000

export const uiUsername = 'admin'

// One volume carries the whole state surface: /config/.reticulum holds the RNS
// config and its interface definitions, /config/.meshchat the message database
// and the `identity` private key.
export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/config',
  readonly: false,
})
