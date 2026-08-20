import { sdk } from '../sdk'
import { resetInterfaces } from './resetInterfaces'

export const actions = sdk.Actions.of().addAction(resetInterfaces)
