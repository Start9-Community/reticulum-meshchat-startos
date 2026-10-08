import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.0:3',
  releaseNotes: {
    en_US: `StartOS package improvements. Backups include your identity, conversations and settings, but not the messages your Local Propagation Node holds for other users.`,
    es_ES: `Mejoras en el paquete de StartOS. Las copias de seguridad incluyen tu identidad, tus conversaciones y tus ajustes, pero no los mensajes que tu Local Propagation Node guarda para otros usuarios.`,
    de_DE: `Verbesserungen am StartOS-Paket. Sicherungen enthalten deine Identität, deine Unterhaltungen und deine Einstellungen, aber nicht die Nachrichten, die dein Local Propagation Node für andere Nutzer vorhält.`,
    pl_PL: `Ulepszenia pakietu StartOS. Kopie zapasowe obejmują Twoją tożsamość, rozmowy i ustawienia, ale nie wiadomości, które Twój Local Propagation Node przechowuje dla innych użytkowników.`,
    fr_FR: `Améliorations du paquet StartOS. Les sauvegardes incluent votre identité, vos conversations et vos réglages, mais pas les messages que votre Local Propagation Node conserve pour d’autres utilisateurs.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
