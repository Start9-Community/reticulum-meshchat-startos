import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  // Credential for the reverse-proxy auth gate in interfaces.ts.
  uiPassword: z.string().optional().catch(undefined),
  // Write-once: re-seeding would overrule a user who turned auto-announce off.
  autoAnnounceSeeded: z.boolean().catch(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
