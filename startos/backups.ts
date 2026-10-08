import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main').setOptions({
    // LXMF's propagation-node store: messages relayed for other users.
    exclude: ['/.meshchat/identities/*/lxmf_router/lxmf/messagestore/'],
  }),
)
