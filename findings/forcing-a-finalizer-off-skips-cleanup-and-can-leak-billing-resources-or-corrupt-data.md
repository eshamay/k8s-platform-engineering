---
title: "Forcing a finalizer off skips cleanup and can leak billing resources or corrupt data"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, deletion, safety]
---

# Forcing a finalizer off skips cleanup and can leak billing resources or corrupt data

## Observation

Patching `metadata.finalizers` to empty, or editing a namespace's `/finalize` subresource, makes the object disappear, but it does not perform the cleanup that the finalizer guarded. Martin Heinz lists the consequences: backing storage in the cloud or other infrastructure may not get deleted and keeps billing, StatefulSets on shared storage risk data corruption, pods can keep running after the API object is gone, and namespaces can hang. Red Hat's guide says the same about the namespace procedure, and the Kubernetes documentation advises against manual removal unless the purpose is understood and met another way. [[sources/research-finalizers]]

## Why it keeps happening

The Terminating state looks like a defect, and the quickest way to clear it is to remove the finalizer. The finalizer is usually the only record that something outside the object still needs releasing, so removing it erases the reminder. The pitfall is a consequence of the design in [[concepts/finalizers]].

## Mitigations

Find the blocking finalizer, read the owning controller's source or logs to learn its purpose, and repair the underlying condition. If a force removal is unavoidable, clean up the external resource by hand afterward. See [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]].

## Evidence quality

The sources are practitioner and vendor blogs plus the official documentation. No named-company postmortem was found. See [[open-knowledge-gaps]].

## Related

[[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]], [[findings/destructive-deletion-of-external-resources]], [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]]
