import { i18n } from './i18n'
import { sdk } from './sdk'
import { mount, webPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Reticulum MeshChat!'))

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'meshchat' },
      mount,
      'meshchat-sub',
    ),
    exec: {
      command: [
        'python',
        '/app/meshchat.py',
        '--host=0.0.0.0',
        `--port=${webPort}`,
        '--reticulum-config-dir=/config/.reticulum',
        '--storage-dir=/config/.meshchat',
        '--headless',
      ],
    },
    ready: {
      display: i18n('Web UI'),
      // First boot generates the identity keypair and the RNS config before the
      // web server binds.
      gracePeriod: 60000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, webPort, {
          successMessage: i18n('MeshChat is serving its web interface'),
          errorMessage: i18n(
            'MeshChat is not yet listening. Check the service logs.',
          ),
        }),
    },
    requires: [],
  })
})
