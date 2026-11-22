import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const webPort = 8000

export const rnsPort = 4242

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

// `--headless` suppresses the desktop browser launch the app otherwise attempts.
// The service listens on every address so the reverse proxy can reach it; the
// install seed listens on loopback only, since it talks to itself and nothing
// else should reach it before the web UI has a password.
export const daemonCommand = (host: '0.0.0.0' | '127.0.0.1'): T.CommandType => [
  'python',
  '/app/meshchat.py',
  `--host=${host}`,
  `--port=${webPort}`,
  '--reticulum-config-dir=/config/.reticulum',
  '--storage-dir=/config/.meshchat',
  '--headless',
]
