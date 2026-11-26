---
title: The kro docs disagree on whether an instance state of FAILED exists
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, status, documentation]
---

# The kro docs disagree on whether an instance state of FAILED exists

## Observation

At release v0.10.0, the kro Instances page lists the instance `state` values as ACTIVE, IN_PROGRESS, DELETING, and ERROR. The Schema page, in the same documentation set, lists them as ACTIVE, IN_PROGRESS, FAILED, DELETING, and ERROR. The schema page example reads `state: ACTIVE  # ACTIVE | IN_PROGRESS | FAILED | DELETING | ERROR`. The dossier read only the documentation and not the Go source, so it could not say which list matches the code. [[sources/research-gap-g3-kro]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/02-schema.md

## Why it matters

A dashboard, alert rule, or script that switches on `status.state` needs the complete list of values. Code written from the Instances page would not handle FAILED, and code written from the Schema page would wait for a value that may never appear. The same page set also says that `state` is a reserved field that kro overrides, so a platform author cannot redefine it to settle the question.

## Mitigations

The instance documentation tells readers to rely on the `Ready` condition rather than on sub-conditions, see [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]]. Until the Go source is read, treat any value other than ACTIVE as not healthy, and treat ERROR and FAILED alike. See [[entities/kro]] and [[concepts/conditions]].
