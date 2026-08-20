# Reticulum MeshChat

## Documentation

- [Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) — the upstream project README.
- [The Reticulum Manual](https://reticulum.network/manual/) — the full reference for the network stack MeshChat runs on.
- [Interface types](https://reticulum.network/manual/interfaces.html) — every kind of connection you can add, and the settings each one takes.

## What you get on StartOS

An always-on Reticulum node with a web interface. Your identity — the keypair that _is_ your address on the mesh — is generated on this server on first start and never leaves it, and your whole message history is stored here rather than with a provider.

Because the node stays running, messages sent to you while your phone or laptop is closed still arrive. Reticulum is delay-tolerant, so a peer that is offline now can collect its messages later.

## Getting set up

1. **Start the service and open the Web UI.** The first start generates your identity keypair and initial configuration, so give it up to a minute before the interface answers.

2. **Set your display name** in the _My Identity_ panel at the top of the sidebar. The **LXMF Address** shown there is what other people use to reach you — copy it out and share it.

3. **Connect to the wider mesh.** A new node starts with only `AutoInterface`, which finds Reticulum peers on your local network and nothing beyond it. To reach people over the internet, add a TCP entry point: **Interfaces → Add Interface → TCP Client**, then enter the host and port of a public entry point. Community-run entry points are listed at [directory.rns.recipes](https://directory.rns.recipes); they come and go, so pick a current one rather than reusing an address from an old guide.

4. **Restart the service.** Interface changes are saved immediately but only take effect on the next start — MeshChat shows a banner telling you the same thing.

5. **Announce yourself,** using _Announce Now_, so peers can discover your address. Then open a conversation by pasting someone's LXMF address.

If the service stops coming up after you add an interface, see **Reset Network Interfaces** below.

## Using Reticulum MeshChat

### Web interface

Everything happens here: conversations, your identity, and the list of network interfaces the node connects through. There is no separate configuration screen in StartOS — the app manages its own settings, and they persist across restarts, updates and backups.

### Actions

**Reset Network Interfaces** — removes every network interface you have added and leaves the default local-network one. Use it when the service will not stay running after an interface change: a wrong address, a port already in use, or a duplicate interface can stop the node from starting at all, which also puts the Interfaces page out of reach. Your identity and your messages are not affected. Restart afterwards, then re-add the interface with corrected settings.

## Backups

A backup of this service contains your **identity private key** along with your messages. That is what makes a restore put you back on the mesh as the same person — and it means anyone holding your backup can become you. Store backup media accordingly.

## Limitations

- **The web interface has no login.** Anyone who can open it can read your messages and send as you. Over Tor this is reasonably safe, because the address is unguessable — treat it as a secret and don't share it. A LAN address is the real exposure: every device on your network can reach it, including ones you don't control. If your network isn't trusted, don't enable a LAN address for this service.

- **Radio hardware is not supported.** RNode, LoRa and serial connections need physical hardware attached to the node, which this package cannot reach. Network-based interfaces work normally.
