---
title: No named postmortem or production comparison was found for leaked resources or adopt-or-create versus explicit import
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [evidence-gap, postmortem, adoption, idempotency, issue-level-evidence]
---

# No named postmortem or production comparison was found for leaked resources or adopt-or-create versus explicit import

## Observation

The 2026-11-26 dossier found no named, dated, organization-authored postmortem and no conference talk about leaked or duplicated cloud resources from Crossplane, ACK, or Config Connector. It found no adopter write-up comparing `adopt-or-create`, Config Connector acquisition, or Crossplane Observe-then-manage in production. [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## What exists instead

The public record is maintainer analysis and user-reported issues, most of them with reporter-measured figures. Examples are [examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours](../examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours.md), [examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days](../examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days.md), and [examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it](../examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it.md). Cost and scale figures are the issue authors' own.

## Consequence for the adoption decision

Because no production frequencies exist, the choice between `adopt-or-create` and explicit import remains a judgment. The dossier's reading is that explicit adopt or import fails closed and loud, `adopt-or-create` fails open and quiet, and strict create-only duplicates resources when the create result is lost. See [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md).

## Caveats

Absence is weak evidence. One web search returned no results, so blogs and talks are under-sampled, and GitHub through the gh CLI was the main channel. The Crossplane docs page on the create annotations was not read, and the upjet controller template was not read. Most late-2026 ACK adoption reports come from one reporter. Earlier related gaps are in [findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found](no-formal-organization-authored-postmortem-of-an-operator-failure-was-found.md) and [findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification](no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification.md).

## Related

[concepts/idempotency](../concepts/idempotency.md), [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md), [findings/adopt-or-create-can-take-over-a-look-alike-resource](adopt-or-create-can-take-over-a-look-alike-resource.md)
