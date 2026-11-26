---
title: "Diagnosing a pod stuck Terminating, from finalizer to force delete"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, troubleshooting, runbook, pods]
---

# Diagnosing a pod stuck Terminating, from finalizer to force delete

## Scenario

A pod stays in Terminating long after a delete. The OneUptime runbook gives a command-level sequence, from reading the cause to removing it. [[sources/research-finalizers]]

## How it works

The runbook lists the Terminating pods, inspects `metadata.finalizers`, and finds the operator that owns each finalizer and reads its logs. As a last resort it patches the finalizers to an empty list or removes one entry with a JSON patch, and after that it uses `--force --grace-period=0`. It advises operators to add timeout logic and monitoring so that cleanup cannot hang silently.

## Caveats

The dossier marks this source as a vendor blog and calls it practical but not authoritative. Pods rarely carry custom finalizers, and the claim that a Terminating pod shows a Running status is a simplification. Treat the force steps as the last item in the sequence, which the Kubernetes documentation also says to avoid unless the finalizer's purpose is understood.

## Related

[[concepts/finalizers]], [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]], [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]]
