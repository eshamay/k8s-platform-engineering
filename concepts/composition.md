---
title: Composition
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: []
tags: [abstraction, crossplane]
---

# Composition

## Definition

The blueprint or template that defines how a high-level [[concepts/composite-resource]] maps down into specific low-level [[concepts/managed-resource|managed resources]], including how values are patched or transformed between them. [[sources/krm-platform-vocabulary]]

## Why it matters

Compositions hold the platform team's opinions. How they are expressed (patches, functions, resource graphs) is a central design difference between [[entities/crossplane]] and [[entities/kro]], and is tracked as a gap in [[open-knowledge-gaps]].

## Related

[[concepts/provider]], [[concepts/idempotency]], [[concepts/eventual-consistency-and-convergence]]

## To research

Patch-and-transform versus composition functions, testing and debugging compositions, and versioning.
