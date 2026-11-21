import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.0:5',
  releaseNotes: {
    en_US:
      'Backups no longer include the announce cache, which the node rebuilds from the network.',
    es_ES:
      'Las copias de seguridad ya no incluyen la caché de anuncios, que el nodo reconstruye desde la red.',
    de_DE:
      'Backups enthalten den Announce-Cache nicht mehr; der Knoten baut ihn aus dem Netzwerk neu auf.',
    pl_PL:
      'Kopie zapasowe nie zawierają już pamięci podręcznej ogłoszeń, którą węzeł odbudowuje z sieci.',
    fr_FR:
      'Les sauvegardes n\'incluent plus le cache des annonces, que le nœud reconstruit depuis le réseau.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
