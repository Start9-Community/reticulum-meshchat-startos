<p align="center">
  <img src="icon.png" alt="Reticulum MeshChat Logo" width="21%">
</p>

# Reticulum MeshChat on StartOS

> Everything not listed in this document should behave the same as upstream
> Reticulum MeshChat. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) is a web interface for messaging over the Reticulum Network Stack: an encrypted, delay-tolerant mesh that carries LXMF messages over TCP, I2P, LoRa radios, serial links, or any mix of them at once. A node's identity is a private key on disk rather than an account, so the keypair this package generates on first start _is_ the user's address on the mesh.

- **Upstream repo:** <https://github.com/liamcottle/reticulum-meshchat>
- **Wrapper repo:** <https://github.com/Start9-Community/reticulum-meshchat-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Upstream's own multi-arch image, unmodified. The package builds no Dockerfile of its own; the manifest references the published tag directly.

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Image         | `ghcr.io/liamcottle/reticulum-meshchat`   |
| Architectures | x86_64, aarch64                           |
| Command       | `python /app/meshchat.py` (see below)     |
| User          | root                                      |

| Subcontainer   | Purpose                                       |
| -------------- | --------------------------------------------- |
| `meshchat-sub` | The `primary` daemon — the one to `attach` to |

The package replaces the image's default command so it can pin the listen port and both state directories. The flags it supplies are `--host=0.0.0.0`, `--port`, `--reticulum-config-dir=/config/.reticulum`, `--storage-dir=/config/.meshchat` and `--headless`. `--headless` matters: without it the app tries to open a desktop browser at startup.

Upstream publishes this image from a **manually triggered** workflow, so a release tag does not imply an image tag. `UPDATING.md` carries the probe to run before a version bump.

## Volume and Data Layout

One volume holds everything the node is. Nothing is stored outside it.

| Volume | Mount Point | Purpose                                              |
| ------ | ----------- | ---------------------------------------------------- |
| `main` | `/config`   | RNS configuration and all MeshChat application state |

| Path inside the volume  | Contents                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `.reticulum/config`     | RNS configuration, including every network interface definition |
| `.meshchat/identity`    | The node's private key — its LXMF address                       |
| `.meshchat/`            | The message database and MeshChat's own settings                |

Splitting or re-scoping this mount would give the node a **new identity**, which is unrecoverable for anyone who has already announced the old one. The package keeps no `store.json`; there is no StartOS-side state.

## File Models

One model, and the package is the junior writer of it.

| Model       | File                | Format    |
| ----------- | ------------------- | --------- |
| `rnsConfig` | `.reticulum/config` | Raw text  |

**MeshChat's own Interfaces page owns this file.** RNS writes it on first start and the app rewrites it whenever the user adds, edits, or removes a network interface. The package seeds nothing and re-asserts nothing, so every hand edit and every value set through the app survives a restart and an update.

The one exception is the `reset-interfaces` action, which rewrites the `[interfaces]` section — and only that section — back to a lone `AutoInterface`. Everything above and below it is preserved verbatim. It is handled as raw text rather than a structured model precisely so that a round-trip cannot reformat or drop keys the package does not understand.

## Dependencies

None.

## Network Access and Interfaces

One interface, serving both the web UI and the HTTP API behind it.

| Interface | Id    | Type | Port | Description                                                       |
| --------- | ----- | ---- | ---- | ----------------------------------------------------------------- |
| Web UI    | `web` | ui   | 8000 | Messages, network interface management, and MeshChat's settings   |

The port is bound on the `web` MultiHost over plain HTTP and is not masked. Reticulum's own peer traffic does **not** run through a StartOS binding: outbound TCP entry points are dialed by the app from inside the container, so adding a peer requires no port to be opened here.

## Installation and First-Run Flow

Nothing is seeded and nothing is configured at install time. On first start the app generates the RNS configuration and the identity keypair itself, which is why the health check carries a grace period — the web server does not bind until that work finishes.

A fresh node comes up with a single `AutoInterface`, which reaches Reticulum peers on the local network only. Reaching the wider mesh means adding a TCP entry point from the app's own Interfaces page, and **interface changes take effect only after a service restart**.

## Actions

One action, and it exists for a failure mode rather than for configuration.

### `reset-interfaces` — Reset Network Interfaces

- **When to run it:** the service will not start, or restarts in a loop, after a network interface was added or edited. A malformed or conflicting definition (a duplicate `AutoInterface`, a TCP interface on a port already in use) makes RNS initialization throw before the web server binds — so the app's own Interfaces page, which is where the definition would normally be corrected, is unreachable.
- **What it changes:** the `[interfaces]` section of `.reticulum/config`, replaced with a lone `AutoInterface`. Identity, messages, and every other section of the file are untouched.
- **Cost:** instant, and it does not stop or start the service.
- **Repeat safety:** idempotent. Running it on a config that already holds only the default rewrites the same content; running it when no config file exists at all reports that and changes nothing.
- **What happens next:** restart the service for the change to take effect, then re-add the interface with corrected settings.
- **Outputs:** none.

It runs at any service status by design, since the situation that calls for it is one where the service cannot stay up.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the only daemon.

| Check     | Displayed | Method                 | Grace period |
| --------- | --------- | ---------------------- | ------------ |
| `primary` | "Web UI"  | Port 8000 is listening | 60 s         |

The check is deliberately **local only**. Mesh reachability depends on peers this server does not control, so a check that dialed an entry point would report the service as unhealthy during someone else's outage.

A failure after the grace period means the process is not serving. The two causes worth separating: a first start on slow storage that simply needs longer, and an RNS interface definition that aborts startup — the latter shows the process exiting and restarting in the service logs, and `reset-interfaces` is the way out of it.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. Nothing is excluded and nothing is dumped, so a restore returns the node exactly as it was.

That includes **the identity private key**, which is the intended behavior: restoring a backup restores being the same node on the mesh, with the same LXMF address and the same message history. It also means the backup medium holds the key that _is_ that identity.

A restored instance needs nothing rebuilt and no resync. It reconnects to its configured interfaces on start.

## Limitations and Differences

1. **The web UI has no authentication.** This is upstream's design, not a packaging choice: whoever can reach the interface can read every message and send as this identity. Over Tor the address is unguessable and effectively acts as the credential; a LAN address exposes the node to every device on the network.
2. **Radio hardware is not available.** RNode, LoRa and serial interfaces need a host device passed into the container, which this package does not do. Network interfaces — `AutoInterface`, TCP, I2P — work normally.
3. **Interface changes require a service restart.** The app writes the config immediately but RNS reads it only at startup.
4. **The node is self-contained.** It runs its own Reticulum instance against this service's volume, so other Reticulum software on the same server has a separate identity and does not share this one's transport.
5. **riscv64 is not supported**, because upstream publishes no riscv64 image.

---

## Quick Reference for AI Consumers

```yaml
package_id: reticulum-meshchat
image: ghcr.io/liamcottle/reticulum-meshchat
architectures:
  - x86_64
  - aarch64
subcontainers:
  - meshchat-sub # the only container
volumes:
  main: /config
file_models:
  - .reticulum/config # raw text; owned by the app's Interfaces page
startos_managed_env_vars: []
dependencies: []
interfaces:
  web: { type: ui, port: 8000 }
actions:
  - reset-interfaces
tasks: []
health_checks:
  - primary # displayed "Web UI"
```
