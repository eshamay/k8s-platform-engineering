---
title: Client-side apply versus server-side apply
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [comparison, server-side-apply, kubectl, three-way-merge]
---

# Client-side apply versus server-side apply

| Aspect | Client-side apply | Server-side apply |
|---|---|---|
| Where the merge runs | In the client, as a three-way merge of the new manifest, the last-applied annotation, and the live object | In the API server, which merges a partial object into the live object |
| Memory of what was applied | The `kubectl.kubernetes.io/last-applied-configuration` annotation | Per-field managers in `metadata.managedFields` |
| Conflicts | Last writer wins silently | The later apply errors, and the applier forces, drops the field, or shares ownership |
| Large objects | The annotation is capped at 262,144 bytes, which large CRDs exceed | No annotation copy is needed |
| Patch format | Strategic merge patch, tied to client version | A PATCH with a special content type, usable from any HTTP client |
| Admission | The client may see no diff and skip the server | The server always runs admission controllers |
| Lists and maps | Strategic merge keys | Schema markers such as `listType` and `listMapKey`, with atomic lists for unmarked CRDs |

[sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Why the change

KEP-555 lists the surprises of client-side apply: applying after a `kubectl edit`, GET-edit-apply, and two users applying in turn. It also depended on client version and on a strategic merge patch format that grew organically. The goals of the replacement include robustness to other writers and mutating webhooks and no dependence on earlier CI/CD steps. Server-side apply reached GA in Kubernetes 1.22. See [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md) and [comparisons/kubectl-object-management-techniques](kubectl-object-management-techniques.md).

## Migration

The supported path is `kubectl apply --server-side`, but fields changed outside client-side apply, for example by `kubectl scale`, then conflict. The old managers also keep co-owning fields and block pruning. See [findings/client-side-to-server-side-migration-leaves-stale-co-owners](../findings/client-side-to-server-side-migration-leaves-stale-co-owners.md) and [findings/large-crds-exceed-the-client-side-apply-annotation-limit](../findings/large-crds-exceed-the-client-side-apply-annotation-limit.md).
