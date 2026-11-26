---
title: An unresponsive validating webhook can block the API server's own startup write and crash-loop a master upgrade
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: []
tags: [pitfall, webhooks, opa, gke, upgrade, postmortem]
---

# An unresponsive validating webhook can block the API server's own startup write and crash-loop a master upgrade

## Observation

In Jetstack's 2019 outage, the API server's `ca-registration` post-start hook had to update the ConfigMap `extension-apiserver-authentication` in `kube-system`. An OPA validating webhook matched that write and its backend was not responding, so the write timed out. The post states "This operation must complete for a master to pass a health check", so the master crash-looped and the GKE master upgrade halted. The same write was needed for the repair, which makes this a concrete case of the deadlock described in [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]]. Self-reported by Jetstack on 2019-09-05, read through a Wayback capture. [[sources/research-gap-g1-outage-postmortems]]

## What reduced the exposure

Jetstack scoped the webhook to namespaces where policy applies, enabled it only for Ingress and Service resources, added a livenessProbe to OPA, and updated the OPA docs. Its own lesson was that alerting on API server response times for CREATE and UPDATE could have caught the problem earlier. Recovery was possible only because the API server answered intermittently, so the webhook configuration could be deleted. See [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]], [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]], and [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
