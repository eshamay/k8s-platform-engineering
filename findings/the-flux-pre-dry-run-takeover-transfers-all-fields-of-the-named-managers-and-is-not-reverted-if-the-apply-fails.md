---
title: The Flux pre-dry-run takeover transfers all fields of the named managers and is not reverted if the apply fails
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, kustomize-controller, server-side-apply, field-manager, recovery]
---

# The Flux pre-dry-run takeover transfers all fields of the named managers and is not reverted if the apply fails

## Observation

The `--override-manager-before-dry-run` flag, first shipped in kustomize-controller v1.10.0 and bundled in Flux v2.10.0, is a recovery tool with sharp edges. The documentation section "Override managers before dry-run" says the takeover transfers all fields owned by the listed managers and prunes fields that are missing from the source. It also says "The managedFields change is not reverted if the apply fails." [sources/research-gap-g3-flux-ssa-helm](../sources/research-gap-g3-flux-ssa-helm.md) URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/docs/README.md.

## Consequences

If the dry-run then fails for an unrelated reason, ownership has already moved and stays moved. Because the takeover covers every field of the named manager, not only the field that wedged the dry-run, it can change more than the operator intended.

## Safe use

- Names are matched exactly, not by prefix, so list each manager name in full. The code builds an Apply entry and an Update entry per name with `ExactMatch: true`.
- The default managers (kubectl, before-first-apply, and the controller's own Update manager) are not included and stay on the post-dry-run path.
- The documentation says to "Use it only to recover stuck objects and remove it once they have reconciled", so it is not a standing policy.

## Related

[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation](the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation.md), [examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag](../examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag.md), [findings/forcing-conflicts-hides-disagreements-between-writers](forcing-conflicts-hides-disagreements-between-writers.md), [entities/flux](../entities/flux.md)
