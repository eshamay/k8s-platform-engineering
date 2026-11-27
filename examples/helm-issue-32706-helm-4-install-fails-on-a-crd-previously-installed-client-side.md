---
title: Helm issue 32706, Helm 4 install fails on a CRD previously installed client-side
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Helm issue 32706]
tags: [helm, helm-4, server-side-apply, crd, conflict]
---

# Helm issue 32706, Helm 4 install fails on a CRD previously installed client-side

## Scenario

A user installs a chart with Helm 4, whose install defaults to server-side apply, onto a cluster where a CRD already exists because an earlier client-side apply created it. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## What the issue says

Helm issue 32706 is titled "Helm 4: install fails on an existing CRD previously installed client-side ("conflict with "helm"")", and it was open on 2026-11-26. URL: https://github.com/helm/helm/issues/32706. Only the title and open state were read, so the cause, the reproduction steps, and any maintainer reply are not recorded here.

## Why it is still useful

The title is consistent with what source shows. Helm 4 installs with server-side apply by default, does not force conflicts unless `--force-conflicts` is set, and uses a manager named after the binary, normally `helm`. An existing object whose fields were last written by a different `helm` Update-type or client-side entry can then conflict with the new apply. That reading is an inference from the title and the source, not a stated diagnosis. See [findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked](../findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked.md) and [findings/client-side-to-server-side-migration-leaves-stale-co-owners](../findings/client-side-to-server-side-migration-leaves-stale-co-owners.md).

## Related

[entities/helm](../entities/helm.md), [findings/helm-does-not-upgrade-or-delete-crds](../findings/helm-does-not-upgrade-or-delete-crds.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)
