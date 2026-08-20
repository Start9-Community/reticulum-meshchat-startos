import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'reticulum-meshchat',
  title: 'Reticulum MeshChat',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/reticulum-meshchat-startos',
  upstreamRepo: 'https://github.com/liamcottle/reticulum-meshchat',
  marketingUrl: 'https://reticulum.network/',
  donationUrl: 'https://liamcottle.com',
  description: { short, long },
  volumes: ['main'],
  images: {
    meshchat: {
      source: {
        dockerTag: 'ghcr.io/liamcottle/reticulum-meshchat:v2.4.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
