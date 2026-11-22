import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.0:6',
  releaseNotes: {
    en_US:
      'From the moment it is installed, the web interface accepts no sign-in until you set its password.',
    es_ES:
      'Desde el momento de la instalación, la interfaz web no acepta ningún inicio de sesión hasta que establezcas su contraseña.',
    de_DE:
      'Ab der Installation akzeptiert die Weboberfläche keine Anmeldung, bis du ihr Passwort festlegst.',
    pl_PL:
      'Od chwili instalacji interfejs webowy nie przyjmuje żadnego logowania, dopóki nie ustawisz jego hasła.',
    fr_FR:
      "Dès l'installation, l'interface web n'accepte aucune connexion tant que vous n'avez pas défini son mot de passe.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
