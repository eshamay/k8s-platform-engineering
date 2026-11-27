---
title: ACK referencing resources wait on backoff after the referenced resource syncs, according to issue 3131
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [ack, references, backoff, kro, ordering, latency]
---

# ACK referencing resources wait on backoff after the referenced resource syncs, according to issue 3131

## Observation

ACK issue 3131 (open, 2026-11-05) says that "Referenced kinds are not watched." The reporter's reading of runtime v0.67.0 is that a custom resource using a `*Ref` field is not re-reconciled when the referenced resource becomes Synced, and instead waits for its exponential backoff, which can reach about 16 minutes 40 seconds. URL: https://github.com/aws-controllers-k8s/community/issues/3131. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Why it matters under GitOps and graphs

If the reading is right, any graph that relies on `*Ref` fields adds latency while the referencing object sits in `ACK.ReferencesResolved=False`. Argo CD sync waves and Flux `dependsOn` gate on health, so a slow reference resolution lengthens the wait. A kro graph can avoid the wait by ordering with `readyWhen` and passing values through CEL instead of `*Ref` fields, though the dossier did not test that. Whether `ACK.ReferencesResolved` waits interact with kro dependency ordering is not settled.

## Evidence limits

The claim is a reporter's reading of code and is not maintainer-confirmed, so the page is draft.

## Related

[entities/ack](../entities/ack.md), [findings/ordering-and-dependency-failures](ordering-and-dependency-failures.md), [findings/retry-storms-and-unbounded-retries](retry-storms-and-unbounded-retries.md), [examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources](../examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources.md)
