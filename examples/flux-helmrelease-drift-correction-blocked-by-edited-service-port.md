---
title: Flux HelmRelease drift correction blocked by an edited Service port
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [flux, helm, drift, server-side-apply, debugging]
---

# Flux HelmRelease drift correction blocked by an edited Service port

## Scenario

A user runs Flux's helm-controller with `driftDetection.mode: enabled` on a HelmRelease that installs the Flux operator itself. Someone edits a Service port by hand with `kubectl edit`. The expectation is that the next reconcile reverts the edit. The community discussion at https://github.com/fluxcd/flux2/discussions/6068 shows that it does not. [[sources/research-self-healing-and-drift-detection]]

## What goes wrong

Drift detection works by a server-side dry-run apply of the stored Helm manifest. `Service.spec.ports` is a list-map keyed by port and protocol, and the `kubectl-edit` field manager still owns the edited entry, so the dry-run fails with duplicate port names. helm-controller stops at "unable to determine cluster state" and never corrects anything. Setting `driftDetection.ignore` does not help, because ignore rules are applied after the dry-run.

## The reported fix

The community answer is to run helm-controller with `--override-manager=kubectl-edit`, stated as available since helm-controller v1.5.0, which transfers those fields to the controller before diffing. The thread links the same class of bug in Argo CD server-side diff (issue 17717) and Kubernetes issue 130292. The answer is from a community member, but the flag and version are now confirmed: the helm-controller CHANGELOG lists `--override-manager` in its 1.5.0 section, dated 2026-02-20, and says drift correction is unrelated to Helm v4 server-side apply ([[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]], [[sources/research-gap-b1-unverified-claims]]). The kustomize-controller flags are separate: `--override-manager` after the dry-run and `--override-manager-before-dry-run` since v1.10.0 ([[sources/research-gap-g3-flux-ssa-helm]], [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]]). Whether the helm-controller flag acts before or after its dry-run was not checked. See [[open-knowledge-gaps]].

## Lesson

Self-healing depends on the diff succeeding, and the diff depends on clean field ownership. A manual edit can therefore disable correction instead of being corrected. See [[findings/field-ownership-blocks-drift-correction]], [[concepts/server-side-apply-and-field-ownership]], and [[entities/flux]].
