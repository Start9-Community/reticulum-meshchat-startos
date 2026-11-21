import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main').setOptions({
    exclude: [
      // LXMF's propagation-node store: messages relayed for other users.
      '/.meshchat/identities/*/lxmf_router/lxmf/messagestore/',
      // Reticulum's packet cache, almost all of it announces: one small file per
      // announce heard on the mesh (tens of thousands on a node that has been up
      // a while). It is rebuilt from the network and only slows backups down.
      '/.reticulum/storage/cache/',
    ],
  }),
)
