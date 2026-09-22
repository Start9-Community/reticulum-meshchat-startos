<p align="center">
  <img src="icon.png" alt="Reticulum MeshChat Logo" width="21%">
</p>

# Reticulum MeshChat on StartOS

> Everything not listed in this document should behave the same as upstream
> Reticulum MeshChat. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) is a web interface for messaging over the Reticulum Network Stack: an encrypted, delay-tolerant mesh that carries LXMF messages over TCP, I2P, LoRa radios, serial links, or any mix of them at once. A node's identity is a private key on disk rather than an account, so the keypair this package generates at install _is_ the user's address on the mesh.

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
| `store.json`            | The web UI password, and the announce-seed marker               |

Splitting or re-scoping this mount would give the node a **new identity**, which is unrecoverable for anyone who has already announced the old one. The only StartOS-side state is `store.json`: the web UI password and the announce-seed marker.

## File Models

Two models: MeshChat's own RNS configuration, which the package barely touches, and a small store of its own.

| Model       | File                | Format    |
| ----------- | ------------------- | --------- |
| `rnsConfig` | `.reticulum/config` | Raw text  |
| `storeJson` | `store.json`        | JSON      |

**MeshChat's own Interfaces page owns `.reticulum/config`.** RNS writes it at install and the app rewrites it whenever the user adds, edits, or removes a network interface. The package seeds nothing and re-asserts nothing, so every hand edit and every value set through the app survives a restart and an update.

The one exception is the `reset-interfaces` action, which rewrites the `[interfaces]` section — and only that section — back to a lone `AutoInterface`. Everything above and below it is preserved verbatim. It is handled as raw text rather than a structured model precisely so that a round-trip cannot reformat or drop keys the package does not understand.

`store.json` is written only by the package and holds two keys: `uiPassword`, the credential the reverse proxy checks, and `autoAnnounceSeeded`, a write-once marker. Install creates the file; the `set-password` action rewrites `uiPassword` on every run. A hand edit survives — nothing re-asserts it — and a password edit takes effect without a restart, because `setInterfaces` reads the value reactively. MeshChat never sees this file.

## Dependencies

None.

## Network Access and Interfaces

One interface, serving both the web UI and the HTTP API behind it.

| Interface | Id    | Type | Port | Description                                                       |
| --------- | ----- | ---- | ---- | ----------------------------------------------------------------- |
| Web UI    | `web` | ui   | 8000 | Messages, network interface management, and MeshChat's settings   |

The port is bound on the `web` MultiHost over plain HTTP and is not masked. **The StartOS reverse proxy enforces HTTP basic auth on it**, because MeshChat ships no authentication of its own — a request without valid credentials gets `401` and never reaches the container. The username is always `admin` and the password is generated by the `set-password` action; `setInterfaces` reads it reactively, so rotating it re-exports the binding rather than restarting the service. This is a departure from upstream, where the app binds loopback and the desktop user account is the boundary.

Reticulum's own peer traffic does **not** run through a StartOS binding: outbound TCP entry points are dialed by the app from inside the container, so adding a peer requires no port to be opened here.

## Installation and First-Run Flow

Install does two things. It boots MeshChat once in a temporary container to switch on automatic announces through the app's own API — the same boot that generates the identity keypair and the RNS configuration, so both exist before the service is ever started. It then raises a `critical` task pointing at the `set-password` action and holds the service until that has run.

The health check still carries a grace period: RNS re-initializes on every start and the web server does not bind until it finishes.

A fresh node comes up with a single `AutoInterface`, which reaches Reticulum peers on the local network only. Reaching the wider mesh means adding a TCP entry point from the app's own Interfaces page, and **interface changes take effect only after a service restart**.

## Actions

Two actions: one is the first-run setup the service is held on, the other exists for a failure mode. Neither configures the app — MeshChat manages its own settings.

### `set-password` — Set Web UI Password

- **When to run it:** once on a fresh install, because a `critical` task holds the service until it has; afterwards, whenever the web UI password should be rotated. The action's name becomes "Reset Web UI Password" once a password exists.
- **What it changes:** `uiPassword` in `store.json`, which is what the reverse proxy checks. Nothing inside the container changes — MeshChat neither sees nor stores the credential.
- **Cost:** instant, and it does not stop or start the service. A running service keeps running under the new credential.
- **Repeat safety:** safe to repeat, but not idempotent — each run mints a new password and the previous one stops working immediately.
- **What happens next:** the browser is challenged for the new credential on its next request.
- **Outputs:** the username, unmasked and copyable, and the password, masked and copyable. The password is not stored anywhere the user can read it back — running the action again is the only way to recover a known one.

### `reset-interfaces` — Reset Network Interfaces

- **When to run it:** the service will not start, or restarts in a loop, after a network interface was added or edited. A malformed or conflicting definition (a duplicate `AutoInterface`, a TCP interface on a port already in use) makes RNS initialization throw before the web server binds — so the app's own Interfaces page, which is where the definition would normally be corrected, is unreachable.
- **What it changes:** the `[interfaces]` section of `.reticulum/config`, replaced with a lone `AutoInterface`. Identity, messages, and every other section of the file are untouched.
- **Cost:** instant, and it does not stop or start the service.
- **Repeat safety:** idempotent. Running it on a config that already holds only the default rewrites the same content; running it when no config file exists at all reports that and changes nothing.
- **What happens next:** restart the service for the change to take effect, then re-add the interface with corrected settings.
- **Outputs:** none.

It runs at any service status by design, since the situation that calls for it is one where the service cannot stay up.

## Tasks

One task, and it is the reason a fresh install will not start on its own.

### Set Web UI Password — `critical`

- **What raises it:** no `uiPassword` in `store.json`. That is the state of every fresh install, so the task is present from install onward. It is also what a user sees if they delete the key by hand.
- **Severity:** `critical` — the service cannot start while it is open, and the ordinary controls are suspended. This is the answer to "the service will not start and there is nothing to press."
- **What clears it:** running the `set-password` action. It does not come back unless the stored password is removed.
- **Where it appears:** on this service's own page.

## Health Checks

One check, on the only daemon.

| Check     | Displayed | Method                 | Grace period |
| --------- | --------- | ---------------------- | ------------ |
| `primary` | "Web UI"  | Port 8000 is listening | 60 s         |

The check is deliberately **local only**. Mesh reachability depends on peers this server does not control, so a check that dialed an entry point would report the service as unhealthy during someone else's outage.

The check probes the container port directly, so the reverse-proxy auth gate is not in its path: a green check alongside a `401` in the browser means the credential is wrong, not that the service is down.

A failure after the grace period means the process is not serving. The two causes worth separating: a start on slow storage that simply needs longer, and an RNS interface definition that aborts startup — the latter shows the process exiting and restarting in the service logs, and `reset-interfaces` is the way out of it.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. Nothing is excluded and nothing is dumped, so a restore returns the node exactly as it was.

That includes **the identity private key**, which is the intended behavior: restoring a backup restores being the same node on the mesh, with the same LXMF address and the same message history. It also means the backup medium holds the key that _is_ that identity.

`store.json` is inside the volume, so the web UI password comes back with everything else and the restored instance is reachable with the credentials that were in use when the backup was taken.

A restored instance needs nothing rebuilt and no resync. It reconnects to its configured interfaces on start.

## Limitations and Differences

1. **Authentication is the package's, not MeshChat's.** MeshChat has none: every route under its v1 API answers anonymously, including the ones that read conversations and send messages as this identity. The package puts HTTP basic auth in front of the whole port at the reverse proxy, so the interface is protected — but the protection is one shared credential covering the whole app, with no per-user accounts, no sessions, and no way to revoke access to one client without rotating the password for all of them. The gate is the proxy's, so it covers every address StartOS publishes for the interface, LAN included; it does not cover the plaintext bridge address (`10.0.3.1:8000`), reachable only from the server itself and from other packages on it, which answers ungated.
2. **Radio hardware is not available.** RNode, LoRa and serial interfaces need a host device passed into the container, which this package does not do. Network interfaces — `AutoInterface`, TCP, I2P — work normally.
3. **Interface changes require a service restart.** The app writes the config immediately but RNS reads it only at startup.
4. **The node is self-contained.** It runs its own Reticulum instance against this service's volume, so other Reticulum software on the same server has a separate identity and does not share this one's transport.
5. **Automatic announces are on, where upstream ships them off.** Install sets MeshChat's announce interval to one hour through the app's own API. It is seeded once and never re-applied, so changing the interval — or disabling it — in the app sticks. The interval also bounds how long peers can be left without a route to this node after an update, because the app announces once the interval has elapsed and never on startup. It covers only this node's side: a peer that has not announced stays unreachable from here, and messages to it retry silently until it does, after which MeshChat resends them unprompted.
6. **riscv64 is not supported**, because upstream publishes no riscv64 image.

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
  - store.json # json; owned by the package
startos_managed_env_vars: []
dependencies: []
interfaces:
  web: { type: ui, port: 8000 } # basic auth enforced at the OS reverse proxy
actions:
  - set-password
  - reset-interfaces
tasks:
  - { action: set-password, severity: critical }
health_checks:
  - primary # displayed "Web UI"
```
