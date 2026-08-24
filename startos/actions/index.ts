import { sdk } from '../sdk'
import { resetInterfaces } from './resetInterfaces'
import { setPassword } from './setPassword'

export const actions = sdk.Actions.of()
  .addAction(setPassword)
  .addAction(resetInterfaces)
