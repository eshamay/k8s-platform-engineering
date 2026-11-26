---
title: "The Kratix GitStateStore insecure field defaults to true when unset in the Go type"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [GitStateStore insecure default]
tags: [kratix, gitstatestore, tls, defaults, pitfall]
---

# The Kratix GitStateStore insecure field defaults to true when unset in the Go type

## Observation

A GitStateStore is a cluster-scoped record of a Git repository that Kratix writes to. Its fields are `url`, `branch` (default main), `path`, `authMethod` (`basicAuth` by default, with `ssh` and `githubApp` as the other values), `secretRef`, `gitAuthor` (name defaults to `kratix`), and `insecure`. The Go type in `api/v1alpha1/gitstatestore_types.go` (https://github.com/syntasso/kratix/blob/main/api/v1alpha1/gitstatestore_types.go, read 2026-11-26) comments on `insecure`, the TLS verification skip, with "Defaults to true when unset." The dossier called this a notable default. [[sources/research-gap-o6-platform-landscape]]

## Why it matters

A field that disables certificate verification and defaults to on is the opposite of the usual safe default. A platform team that writes a GitStateStore without an explicit `insecure: false` may be pushing Destination output over a connection that skips TLS verification. The finding rests on a code comment in the type file, and the dossier did not read the controller code or run a store without the field, so the actual runtime behavior is unverified. The safe practice that follows from the comment alone is to set the field explicitly. [[sources/research-gap-o6-platform-landscape]]

## GitHub App tokens

The same documentation says a `githubApp` auth method issues short-lived tokens and that Kratix "automatically refreshes this token before expiry", which avoids a long-lived static credential in the secret. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/kratix]], [[decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops]], [[findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match]]
