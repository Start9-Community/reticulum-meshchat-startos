import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiUsername, webPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // MeshChat ships no authentication of its own, so the StartOS reverse proxy
  // gates the port with HTTP basic auth. Read reactively so the gate follows the
  // credential the moment the set-password action writes it. TEMPORARY: delete
  // the gate, uiPassword, actions/setPassword.ts and init/watchPassword.ts once
  // upstream ships auth — liamcottle/reticulum-meshchat#8.
  const password = await storeJson.read((s) => s?.uiPassword).const(effects)

  const webMulti = sdk.MultiHost.of(effects, 'web')
  const webOrigin = await webMulti.bindPort(webPort, {
    protocol: 'http',
    preferredExternalPort: webPort,
    addSsl: password
      ? {
          auth: {
            type: 'basic',
            credentials: [{ username: uiUsername, password }],
            realm: null,
          },
        }
      : undefined,
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
    // Leave null even though the gate has a username: the SDK would fold it into
    // the address as `admin@<host>`, and Chromium refuses userinfo in top-level
    // navigations, breaking the launch link. The gate still prompts for it.
    username: null,
    path: '',
    query: {},
  })
  const webReceipt = await webOrigin.export([webInterface])

  return [webReceipt]
})
