import { i18n } from '../i18n'
import { rnsConfig, stripCustomInterfaces } from '../fileModels/rnsConfig'

import { sdk } from '../sdk'

export const resetInterfaces = sdk.Action.withoutInput(
  'reset-interfaces',

  async ({ effects }) => ({
    name: i18n('Reset Network Interfaces'),
    description: i18n(
      'Remove all custom RNS interfaces, keeping only the default. Use this if a misconfigured interface prevents MeshChat from starting.',
    ),
    warning: i18n(
      'Custom interface definitions will be deleted. Your identity and messages are untouched.',
    ),
    // A bad interface definition kills RNS init before the web server binds, so
    // the app's own Interfaces page is unreachable exactly when this is needed.
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const current = await rnsConfig.read().once()
    if (!current) {
      return {
        version: '1',
        title: i18n('Interfaces Reset'),
        message: i18n('No RNS config found — nothing to reset.'),
        result: null,
      }
    }
    await rnsConfig.write(effects, stripCustomInterfaces(current))
    return {
      version: '1',
      title: i18n('Interfaces Reset'),
      message: i18n(
        'All custom interfaces removed. Restart the service to apply.',
      ),
      result: null,
    }
  },
)
