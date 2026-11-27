---
title: "A Kratix Destination writes dependencies and resources directories, and its filepath mode is immutable"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Kratix Destination layout]
tags: [kratix, destinations, gitops, state-store, immutability]
---

# A Kratix Destination writes dependencies and resources directories, and its filepath mode is immutable

## Observation

The Kratix reference (https://docs.kratix.io/main/reference/destinations/intro, 2026) describes a Destination as a cluster-scoped "representation of a system that Kratix can write documents to", which an external tool then reconciles. Examples are Kubernetes clusters with Flux or Argo CD pulling manifests, Terraform, Ansible, and a Backstage catalog "filled from a Git repository". Kratix does not apply the documents. It writes them to a state store, either a GitStateStore (Git repositories) or a BucketStateStore (S3-compatible buckets), and the agent on the Destination reads them. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Fields and layout

Under `<statestore.path>/<destination.path>/` Kratix writes two top-level directories, one for `dependencies` (Promise-level items such as CRDs) and one for `resources` (per Resource request). The `path` field is required. Defaults are `strictMatchLabels` false, `filepath.mode` `nestedByMetadata` (other values `aggregatedYAML` and `none`), and `cleanup` `none` (the other value is `all`). In `none` mode Kratix writes a state file for each WorkPlacement into a `.kratix` directory so that it can clean up. The documentation says the filepath mode "is **immutable** once the Destination is created", so changing the layout means creating a new Destination. The `aggregatedYAML` mode cannot be combined with a state store that has a delivery mode, and Kratix refuses to create or update the Destination or the store in that case. That restriction concerns a vendor product feature. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Related

[entities/kratix](../entities/kratix.md), [findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match](kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match.md), [findings/the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type](the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type.md), [entities/backstage](../entities/backstage.md)
