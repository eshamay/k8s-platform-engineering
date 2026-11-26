---
title: Free text in a condition reason breaks consumers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, conditions, crossplane, conventions]
---

# Free text in a condition reason breaks consumers

## Observation

Crossplane issue 4094 reported that a claim's `Ready` condition put a free-text sentence into `reason`. The API conventions define `reason` as a CamelCase identifier meant for programs and `message` as the human-readable text. A maintainer agreed it was a slip, and it was fixed in v1.13 through PR 4125. The reporter's request was that "what is in the `reason` field right now should be in `message`." [[sources/research-spec-status-split]] URL: https://github.com/crossplane/crossplane/issues/4094.

## Why it matters

Tooling switches on `reason`, so a sentence in that field breaks matching, makes the value unstable across versions, and defeats aggregation. A small convention slip in one controller turns into custom handling in every consumer.

## Mitigations

Keep `reason` to a short stable identifier and put detail in `message`. Reviewers of platform-authored status schemas should check this alongside the condition `type` naming rule that type names describe the current observed state. See [[concepts/conditions]], [[entities/crossplane]], and [[comparisons/health-and-readiness-models-across-tools]].

## Related

[[concepts/spec-status-split]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]
