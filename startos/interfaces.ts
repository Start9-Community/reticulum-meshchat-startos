import { i18n } from './i18n'
import { sdk } from './sdk'
import { webPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const webMulti = sdk.MultiHost.of(effects, 'web')
  const webOrigin = await webMulti.bindPort(webPort, {
    protocol: 'http',
    preferredExternalPort: webPort,
  })
  const webInterface = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'web',
    description: i18n(
      'The MeshChat web interface — messages, network interfaces, and settings',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const webReceipt = await webOrigin.export([webInterface])

  return [webReceipt]
})
