---
title: Argo CD issue 15441 removing a namespace manifest under CreateNamespace deleted and recreated the namespace
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Argo CD issue 15441]
tags: [argo-cd, namespace, prune, createnamespace, incident]
---

# Argo CD issue 15441 removing a namespace manifest under CreateNamespace deleted and recreated the namespace

## Scenario

On 2023-09-11 an anonymous reporter described a change in which an explicit Namespace manifest was removed from Git in favor of the `CreateNamespace=true` sync option. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://github.com/argoproj/argo-cd/issues/15441

## What happened

The report says that doing so "actually deletes the namespace and recreates it during the Sync". Because deleting a namespace deletes everything inside it, a tidy-looking refactor of the source becomes a destructive event. The Argo CD version was not recorded in the dossier, and the account is the reporter's.

## Why it belongs here

It is a concrete case of the prune boundary being easy to misjudge, which [[findings/unintended-deletion-through-prune]] had only inferred from documentation warnings. See [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]].

## Related

[[entities/argo-cd]], [[concepts/gitops-pull-based-delivery]]
