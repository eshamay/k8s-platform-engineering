---
title: Idempotency
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: []
tags: [controllers]
---

# Idempotency

## Definition

Ensuring that running the same reconciliation logic multiple times produces the same result, without duplicating resources or causing errors. [[sources/krm-platform-vocabulary]]

## Why it matters

Because a level-triggered loop can run at any time and any number of times, a non-idempotent reconcile creates duplicates or fails on the second run. External APIs that lack natural idempotency (for example, creating a resource with a generated ID) need extra bookkeeping.

## Related

[[concepts/reconciliation-loop]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/provider]]

## To research

Patterns for idempotent creates against cloud APIs, such as external-name annotations in Crossplane.
