---
title: kubectl object-management techniques
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [kubectl, declarative, imperative]
---

# kubectl object-management techniques

| Technique | Example | Suited to | Strengths | Weaknesses |
|---|---|---|---|---|
| Imperative commands | `kubectl create`, `kubectl scale` | Development and one-offs | Lowest learning curve | No review or audit trail |
| Imperative object configuration | `kubectl replace -f` | Single-writer production | Files can be reviewed and stored | Explicit verbs; replacing drops other writers' changes |
| Declarative object configuration | `kubectl apply -f dir/` | Multiple writers | Retains writes made to live objects; works on directories | Harder to debug because of merge and patch logic |

## Reading the comparison

The three techniques trade simplicity against reviewability, auditability, and tolerance of multiple writers. The official page warns not to mix techniques on the same object. Declarative configuration relies on a three-way merge between the file, the live object, and the last-applied annotation, which server-side apply later replaced with field ownership. See [concepts/declarative-vs-imperative](../concepts/declarative-vs-imperative.md), [entities/kubectl](../entities/kubectl.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md), [findings/mixing-management-techniques-on-one-object](../findings/mixing-management-techniques-on-one-object.md), and [decisions/choosing-an-object-management-technique](../decisions/choosing-an-object-management-technique.md). [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)
