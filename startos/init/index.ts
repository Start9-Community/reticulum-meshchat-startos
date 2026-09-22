import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { seedAutoAnnounce } from './seedAutoAnnounce'
import { watchPassword } from './watchPassword'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  seedAutoAnnounce,
  watchPassword,
)

export const uninit = sdk.setupUninit(versionGraph)
