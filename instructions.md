# Reticulum MeshChat

## Documentation

- [Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) — the upstream project README.
- [The Reticulum Manual](https://reticulum.network/manual/) — the full reference for the network stack MeshChat runs on.
- [Interface types](https://reticulum.network/manual/interfaces.html) — every kind of connection you can add, and the settings each one takes.

## What you get on StartOS

An always-on Reticulum node with a web interface. Your identity — the keypair that _is_ your address on the mesh — is generated on this server on first start and never leaves it, and your whole message history is stored here rather than with a provider.

Because the node stays running, messages sent to you while your phone or laptop is closed still arrive. Reticulum is delay-tolerant, so a peer that is offline now can collect its messages later.

## Getting set up

1. **Set the web UI password.** StartOS will not start the service until you have. Run **Set Web UI Password** and save what it shows you — the username is always `admin`, and the password is not shown again. Your browser asks for both the first time you open the web interface.

2. **Start the service and open the Web UI.** The first start generates your identity keypair and initial configuration, so give it up to a minute before the interface answers.

3. **Set your display name** in the _My Identity_ panel at the top of the sidebar. The **LXMF Address** shown there is what other people use to reach you — copy it out and share it.

4. **Connect to the wider mesh.** A new node starts with only `AutoInterface`, which finds Reticulum peers on your local network and nothing beyond it. To reach people over the internet, add a TCP entry point: **Interfaces → Add Interface → TCP Client**, then enter the host and port of a public entry point. Community-run entry points are listed at [directory.rns.recipes](https://directory.rns.recipes); they come and go, so pick a current one rather than reusing an address from an old guide.

5. **Restart the service.** Interface changes are saved immediately but only take effect on the next start — MeshChat shows a banner telling you the same thing.

6. **Announce yourself,** using _Announce Now_, so peers can discover your address. Then open a conversation by pasting someone's LXMF address.

If the service stops coming up after you add an interface, see **Reset Network Interfaces** below.

## Using Reticulum MeshChat

### Web interface

Everything happens here: conversations, your identity, and the list of network interfaces the node connects through. There is no separate configuration screen in StartOS — the app manages its own settings, and they persist across restarts, updates and backups.

### Actions

**Set Web UI Password** — generates the password your browser asks for when you open the web interface. Run it once before the first start; run it again any time you want to change the password. The username is always `admin`. Each run replaces the previous password, so anyone still using the old one is locked out immediately.

**Reset Network Interfaces** — removes every network interface you have added and leaves the default local-network one. Use it when the service will not stay running after an interface change: a wrong address, a port already in use, or a duplicate interface can stop the node from starting at all, which also puts the Interfaces page out of reach. Your identity and your messages are not affected. Restart afterwards, then re-add the interface with corrected settings.

### Announcing

Announcing is how other people's nodes learn the route to your address. This server announces itself every hour on its own; the dropdown beside _Announce Now_ changes that interval or turns it off.

A message only gets through once the receiving node has announced. If one you send sits retrying, the other person's node hasn't announced recently: ask them to press _Announce Now_, and it goes through on its own once they do. After an update or a reinstall this can happen in both directions — messages to you start getting through again within the hour, since this server announces itself, or sooner if you press _Announce Now_ here.

## Backups

A backup of this service contains your **identity private key** along with your messages. That is what makes a restore put you back on the mesh as the same person — and it means anyone holding your backup can become you. Store backup media accordingly.

## Limitations

- **One password, shared by everyone.** The web interface is protected by a single username and password, checked before anything reaches MeshChat. There are no separate accounts and no way to sign one person out: whoever has the password can read your messages and send as you, and the only way to cut someone off is to run **Set Web UI Password** again, which changes it for everybody.

- **Radio hardware is not supported.** RNode, LoRa and serial connections need physical hardware attached to the node, which this package cannot reach. Network-based interfaces work normally.
