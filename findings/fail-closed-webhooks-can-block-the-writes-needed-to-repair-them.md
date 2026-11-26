---
title: Fail-closed webhooks can block the writes needed to repair them
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, webhooks, failure-policy, availability, deadlock]
---

# Fail-closed webhooks can block the writes needed to repair them

## Observation

Because the API server calls webhooks synchronously, an unreachable backend with `failurePolicy: Fail` blocks every matching write. That includes the writes needed to repair the webhook, such as the Deployment or ConfigMap that runs it, which creates a deadlock. The official good-practices guidance is to scope matches narrowly, exclude `kube-system` and similar namespaces, keep timeouts short, run multiple replicas, and use `Fail` only for security-critical checks. URL: https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/ and https://oneuptime.com/blog/post/2026-02-09-webhook-failurepolicy-ha/view. [[sources/research-admission-webhooks-and-cel]]

## Limits of the evidence

The dossier searched for named incident write-ups, including a Venafi and Jetstack GKE outage post, an InfraForge ConfigMap deadlock post, and a Kyverno and Talos recovery note, but none could be read. The deadlock pattern therefore rests on official guidance and a vendor blog, not on a verified postmortem. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]] and the gap on postmortem contents in [[open-knowledge-gaps]].

## Update from the Jetstack primary post

Correction, 2026-11-26: a verified postmortem now exists for this deadlock. In Jetstack's 2019 outage the unresponsive OPA validating webhook blocked the API server's own write to `extension-apiserver-authentication` in `kube-system`, so the master failed its health check. Jetstack recovered by deleting the webhook configuration while the API answered intermittently, then scoped the webhook to Ingress and Service resources and added a livenessProbe. See [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]]. [[sources/research-gap-g1-outage-postmortems]]

## Mitigations named in the sources

Run the backend with several replicas behind a load balancer, add pod anti-affinity, use short timeouts, exempt system namespaces, monitor the webhook, and prefer in-process CEL policies where they suffice. The `Fail` versus `Ignore` choice is covered in [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]].

## Related

[[concepts/admission-webhooks-and-cel]], [[findings/remediation-can-amplify-an-outage]], and [[findings/blast-radius-and-privilege-centralization]].

## Additions from the admission and CRD dossier

Gatekeeper and Kyverno both document the emergency exit of deleting the webhook configuration ([[findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration]], [[findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded]]). [[sources/research-gap-m6-admission-crds]]
