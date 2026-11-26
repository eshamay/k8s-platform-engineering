---
title: Observe-based import has manual copy steps, ambiguous names, and relaxed validation
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, import, observe, management-policies]
---

# Observe-based import has manual copy steps, ambiguous names, and relaxed validation

## Observation

The dossier collects several import hazards from three sources. First, moving from observation to control is manual: the user copies needed values from `status.atProvider` into `spec.forProvider` before changing the policies to `["*"]`. Second, names can be ambiguous across regions, so the guide tells users to add a disambiguating `forProvider` field such as the region. Third, the design document says required-field validation has to be relaxed for observed objects (through CEL) and that late initialization is disabled under Observe, which can confuse users who expect a normal managed resource. Fourth, a consultancy blog warns that importing a resource that is not yet fully provisioned can fail, and that manual drift will be reverted once full control is on. URLs: https://docs.crossplane.io/latest/guides/import-existing-resources/, https://github.com/crossplane/crossplane/blob/main/design/design-doc-observe-only-resources.md, https://www.cloudkeeper.com/insights/blog/onboarding-aws-crossplane-importing-rds-s3-and-eks-safely. [[sources/research-managed-resource]]

## Why it matters

A wrong copy or a wrong disambiguator can make the promoted object disagree with the real resource, and the first full-control reconcile will then change the real resource to match the object. That is the risky step of the whole import.

## Mitigations

Rehearse on non-critical resources first, which the consultancy blog recommends, compare `atProvider` with the intended `forProvider` before promotion, and consider keeping Delete out of the policy list until the object has proven stable. See [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]], [[decisions/choose-management-policies-for-an-imported-resource]], [[findings/late-initialized-fields-create-false-drift]], and [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].
