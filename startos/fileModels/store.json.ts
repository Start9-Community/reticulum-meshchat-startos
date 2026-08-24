import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Credential for the reverse-proxy auth gate in interfaces.ts.
const shape = z.object({
  uiPassword: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
