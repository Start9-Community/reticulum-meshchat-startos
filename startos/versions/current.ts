import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.0:1',
  releaseNotes: {
    en_US:
      'This update turns automatic announces on, even if you had set them to Disabled. Your node now announces itself every hour; the dropdown beside Announce Now changes the interval or turns them off, and later updates leave your choice alone.',
    es_ES:
      'Esta actualización activa los anuncios automáticos, aunque los hubieras puesto en Disabled. Tu nodo ahora se anuncia cada hora; el desplegable junto a Announce Now cambia el intervalo o los desactiva, y las próximas actualizaciones respetarán tu elección.',
    de_DE:
      'Dieses Update schaltet automatische Ankündigungen ein, auch wenn du sie auf Disabled gesetzt hattest. Dein Knoten kündigt sich jetzt stündlich an; das Auswahlmenü neben Announce Now ändert das Intervall oder schaltet sie ab, und spätere Updates lassen deine Wahl unangetastet.',
    pl_PL:
      'Ta aktualizacja włącza automatyczne ogłoszenia, nawet jeśli ustawiono je na Disabled. Twój węzeł ogłasza się teraz co godzinę; lista obok Announce Now zmienia interwał lub je wyłącza, a kolejne aktualizacje nie zmienią Twojego wyboru.',
    fr_FR:
      'Cette mise à jour active les annonces automatiques, même si vous les aviez réglées sur Disabled. Votre nœud s’annonce désormais toutes les heures ; le menu à côté d’Announce Now modifie l’intervalle ou les désactive, et les mises à jour suivantes respecteront votre choix.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
