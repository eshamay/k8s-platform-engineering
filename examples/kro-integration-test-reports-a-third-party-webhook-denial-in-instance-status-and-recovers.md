---
title: "A kro integration test reports a third-party webhook denial in instance status and recovers when the policy is removed"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [kro, webhooks, admission, status, test, verified]
---

# A kro integration test reports a third-party webhook denial in instance status and recovers when the policy is removed

## Scenario

kro's integration suite includes a test titled "should report webhook denial in status and recover when policy is removed". It shows kro acting as a client of other people's admission: a denial from a policy or webhook outside kro is surfaced in the instance status. https://raw.githubusercontent.com/kubernetes-sigs/kro/main/test/integration/suites/core/webhook_denial_test.go [[sources/research-gap-m6-admission-crds]]

## Reliability

VERIFIED for the test title. The test body and how the status message is worded were not read.

## Related

[[findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only]] and [[entities/kro]].
