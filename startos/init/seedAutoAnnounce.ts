import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { daemonCommand, mount, webPort } from '../utils'

// Non-zero is what enables MeshChat's announce loop; the loop fires only once the
// interval has elapsed, never on startup, so this also bounds post-update recovery.
const intervalSeconds = 3600

// MeshChat keeps this in a SQLite table under an identity-hash directory that does
// not exist until it has run once, so its own API is the only writer.
const patchConfig = `import json,urllib.request
urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:${webPort}/api/v1/config',method='PATCH',data=json.dumps({'auto_announce_interval_seconds':${intervalSeconds}}).encode(),headers={'Content-Type':'application/json'}),timeout=30).read()`

export const seedAutoAnnounce = sdk.setupOnInit(
  async (effects, kind, progress) => {
    if (kind !== 'install' && kind !== 'update') return
    if (await storeJson.read((s) => s?.autoAnnounceSeeded).once()) return

    const seedSub = sdk.SubContainer.of(
      effects,
      { imageId: 'meshchat' },
      mount,
      'meshchat-seed',
    )

    const phase = progress.addPhase(i18n('Enabling automatic announces'))
    phase.start()
    await sdk.Daemons.of(effects)
      .addDaemon('app', {
        subcontainer: seedSub,
        exec: { command: daemonCommand },
        ready: {
          display: null,
          gracePeriod: 60000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, webPort, {
              successMessage: 'MeshChat is up',
              errorMessage: 'MeshChat is not up yet',
            }),
        },
        requires: [],
      })
      .addOneshot('seed', {
        subcontainer: seedSub,
        exec: { command: ['python', '-c', patchConfig] },
        requires: ['app'],
      })
      .runUntilSuccess(300_000)
    phase.complete()

    await storeJson.merge(effects, { autoAnnounceSeeded: true })
  },
)
