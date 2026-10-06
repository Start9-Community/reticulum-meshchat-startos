import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.0:3',
  releaseNotes: {
    en_US: `Other Reticulum nodes can now connect to this one over TCP, at the addresses of the new Reticulum TCP Server interface. To use it, add a TCP Server Interface in MeshChat with Listen IP 0.0.0.0 and Listen Port 4242, then restart the service.

StartOS package improvements.`,
    es_ES: `Otros nodos Reticulum ya pueden conectarse a este por TCP, en las direcciones de la nueva interfaz Servidor TCP de Reticulum. Para usarla, añade en MeshChat una TCP Server Interface con Listen IP 0.0.0.0 y Listen Port 4242, y reinicia el servicio.

Mejoras en el paquete de StartOS.`,
    de_DE: `Andere Reticulum-Knoten können sich jetzt per TCP mit diesem verbinden, über die Adressen der neuen Schnittstelle Reticulum-TCP-Server. Füge dazu in MeshChat eine TCP Server Interface mit Listen IP 0.0.0.0 und Listen Port 4242 hinzu und starte den Dienst neu.

Verbesserungen am StartOS-Paket.`,
    pl_PL: `Inne węzły Reticulum mogą teraz łączyć się z tym przez TCP, pod adresami nowego interfejsu Serwer TCP Reticulum. Aby z niego korzystać, dodaj w MeshChat TCP Server Interface z Listen IP 0.0.0.0 i Listen Port 4242, a następnie uruchom usługę ponownie.

Ulepszenia pakietu StartOS.`,
    fr_FR: `Les autres nœuds Reticulum peuvent désormais se connecter à celui-ci en TCP, aux adresses de la nouvelle interface Serveur TCP Reticulum. Pour l’utiliser, ajoutez dans MeshChat une TCP Server Interface avec Listen IP 0.0.0.0 et Listen Port 4242, puis redémarrez le service.

Améliorations du paquet StartOS.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
