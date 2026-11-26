---
title: Late-initialized fields create false drift
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, defaulting, drift]
---

# Late-initialized fields create false drift

## Observation

External providers fill in default values the user never set. If those defaults are compared against a spec that does not mention them, the controller sees a difference and tries to "fix" it. Crossplane's managed-resource design keeps provider-defaulted fields optional in `spec` and offers a `LateInitialize` management policy, so the controller can copy the provider's value into spec without treating it as drift. The design one-pager also separates `forProvider` (desired) from `atProvider` (observed). [[sources/research-self-healing-and-drift-detection]]

## Interpretation

Drift detection needs a rule for fields the user did not declare. Crossplane's answer is to fill them in deliberately, while Config Connector's legacy Merge mode did so implicitly and produced endless reconcile loops. See [[findings/defaulting-and-drift-reconcile-loops]] and [[concepts/spec-status-split]].

## Mitigations

Make provider-defaulted fields optional, use `LateInitialize` where available, and avoid copying live values into the spec for fields the user never meant to own. See [[comparisons/exemption-and-ignore-controls-across-tools]].

## Related

[[entities/crossplane]], [[concepts/managed-resource]], [[concepts/self-healing-and-drift-detection]]
