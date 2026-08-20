# Updating the upstream version

This package runs upstream's own pre-built multi-arch image, `ghcr.io/liamcottle/reticulum-meshchat`. "Upstream" is [liamcottle/reticulum-meshchat](https://github.com/liamcottle/reticulum-meshchat).

## Determining the upstream version

- Fetch the latest release tag:

  ```sh
  gh release view -R liamcottle/reticulum-meshchat --json tagName -q .tagName
  ```

- Upstream's image-publish workflow is manual-trigger, so a release tag does not guarantee an image. Confirm the tag exists, and that it carries both `linux/amd64` and `linux/arm64`, before bumping:

  ```sh
  token=$(curl -s 'https://ghcr.io/token?scope=repository:liamcottle/reticulum-meshchat:pull&service=ghcr.io' | jq -r .token)
  curl -s -H "Authorization: Bearer $token" \
    -H 'Accept: application/vnd.oci.image.index.v1+json' \
    https://ghcr.io/v2/liamcottle/reticulum-meshchat/manifests/<tag> | jq '.manifests[].platform'
  ```

  If a tag is missing an architecture, hold the bump — the manifest declares both.

The current pin lives in `startos/manifest/index.ts` at `images.meshchat.source.dockerTag`.

## Applying the bump

- Bump `dockerTag` in `startos/manifest/index.ts` to the new tag (upstream tags carry a leading `v`).
- Bump `version` in `startos/versions/current.ts` to `<upstream version>:0` and write release notes for every locale in `startos/i18n/dictionaries/translations.ts`.
