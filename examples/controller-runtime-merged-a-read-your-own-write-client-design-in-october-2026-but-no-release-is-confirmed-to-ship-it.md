---
title: "controller-runtime merged a read-your-own-write client design in October 2026, but no release is confirmed to ship it"
type: example
status: contradicted
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: [controller-runtime read-your-writes]
tags: [controller-runtime, staleness, read-your-writes, design, v0-25]
---

# controller-runtime merged a read-your-own-write client design in October 2026, but no release is confirmed to ship it

## Contradictions

> [!WARNING]
> This page's title and body say no controller-runtime release is confirmed to ship read-your-writes behavior. The v0.25.0 release notes say otherwise.

The page says: "It does not claim that any controller-runtime release gives controllers read-your-own-writes behavior" and "No release ... is confirmed to ship it". The 2026-11-26 recheck says: v0.25.0 (2026-09-03) "introduces a new experimental `ReadYourWritesConsistency` feature", enabled with `Client.EnableReadYourWritesConsistency`. The release notes are the primary source, so the later claim stands: an experimental, opt-in implementation shipped in v0.25.0. Suggested resolution: treat the body below as the history of the design pull request only, and cite [[findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client]] for the shipped behavior. [[sources/research-gap-b1-unverified-claims]]

## Scenario

The Kubernetes v1.36 staleness work protects only the built-in controllers in kube-controller-manager. Most operators are written with controller-runtime, whose cache-backed client can return data older than the controller's own last write. The v1.36 blog says the project is working with controller-runtime so that all controller-runtime controllers get read-your-own-writes semantics "without having to implement the logic themselves." [[sources/research-gap-g3-k8s-and-controller-runtime]]

## What exists on 2026-11-26

- Pull request 3473, "Read your own write client design", merged on 2026-10-05. URL: https://github.com/kubernetes-sigs/controller-runtime/pull/3473
- Issue 3320, "Feature: ReadYourWritesConsistency", was still open when the dossier read it. URL: https://github.com/kubernetes-sigs/controller-runtime/issues/3320
- The newest release the dossier saw, v0.25.3 (published 2026-11-16), was not checked for a shipped implementation beyond the PR title.

The wiki therefore records a merged design and an open feature issue. It does not claim that any controller-runtime release gives controllers read-your-own-writes behavior, and that remains an open question. Until it ships, controller authors still rely on deterministic names, expectations, and explicit uncached reads, as described in [[findings/stale-cache-and-double-action]].

## Related

[[entities/controller-runtime]], [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]], [[concepts/informers-reflectors-and-workqueues]]
