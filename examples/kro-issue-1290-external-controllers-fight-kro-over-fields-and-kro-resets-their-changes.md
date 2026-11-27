---
title: kro issue 1290 reports external controllers fighting kro over fields and kro resetting their changes
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: [kro issue 1290]
tags: [use-case, kro, server-side-apply, field-ownership, incident]
---

# kro issue 1290 reports external controllers fighting kro over fields and kro resetting their changes

## Scenario

Issue 1290 in kubernetes-sigs/kro, still open when the dossier read it on 2026-11-26, describes external controllers that change fields on resources kro manages. The issue says "kro resets those changes on the next reconciliation", so the two writers repeat the change and the reset. URL: https://github.com/kubernetes-sigs/kro/issues/1290. [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

## Scope of the evidence

The dossier reads the issue as a server-side apply ownership problem and not as a Flux problem, and it found no Flux-specific report. It is relevant to Flux users because a Flux Kustomization that also sets fields on a resource a kro instance creates would be one of those external writers. That reading is an application of the issue, and no source describes the combination. The general mechanism is covered in [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md) and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Related

[entities/kro](../entities/kro.md), [entities/flux](../entities/flux.md), [findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance](../findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance.md)
