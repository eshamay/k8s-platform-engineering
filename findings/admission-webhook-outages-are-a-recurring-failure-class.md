---
title: Admission webhook outages are a recurring failure class
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: []
tags: [pitfall, webhooks, postmortems, availability]
---

# Admission webhook outages are a recurring failure class

## Observation

The k8s.af index of public Kubernetes failure stories surfaces several webhook-related postmortems. Its entries include a 2019 Jetstack post about an admission webhook outage and an Airbnb KubeCon NA 2020 talk that cites a mutating admission webhook in outages. One index entry reads "ValidatingWebhookConfiguration caused prolonged downtime, nodes lost, and failed master upgrades." URL: https://k8s.af/. [[sources/research-custom-resource-definition]]

## Limits of the evidence

The dossier did not open the linked posts, so these are index-level descriptions and not verified accounts. The postmortems are also not CRD-specific. They illustrate the same blast-radius pattern as [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], in which a webhook that sits on the request path turns its own outage into a cluster-wide problem. A gap asks for the postmortems to be read directly.

## Update from the Jetstack primary post

Correction, 2026-11-26: the Jetstack post has now been read, through a Wayback capture of the Venafi-hosted copy, so that entry is no longer index-level. A master upgrade stalled because an OPA validating webhook could not answer the API server's own startup write to a `kube-system` ConfigMap, and node auto-repair then recreated nodes in a loop. See [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]], [[findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade]], and [[findings/intermittent-api-server-downtime-can-send-node-auto-repair-into-an-endless-recreate-loop]]. The Airbnb KubeCon NA 2020 talk (tagged MutatingAdmissionWebhook, CPU Limits, OOMKill, kube2iam, HPA) is still unread. The k8s.af index lists 78 entries and only two are webhook-tagged, Jetstack and Airbnb, so "several webhook-related postmortems" overstated the index. [[sources/research-gap-g1-outage-postmortems]]

## Related

[[concepts/admission-webhooks-and-cel]], [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[open-knowledge-gaps]].

## Additions from the admission dossier

The admission dossier did not close the evidence gap: its searches for the Venafi and Jetstack GKE outage post, an InfraForge ConfigMap deadlock post, and a Kyverno and Talos recovery note returned nothing readable. It does supply the mechanism and the official mitigations. See [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]], [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]], and [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]]. [[sources/research-admission-webhooks-and-cel]]

## Update from the named-incident dossier

The Jetstack account was re-verified against a second capture of the post, and the post does not recommend or mention `failurePolicy`, so that recommendation must not be attributed to Jetstack. The Reddit Pi-Day, Skyscanner, and Spotify incidents are not webhook cases and remain index-level, apart from a secondary-only retelling of Reddit's. See [[sources/research-gap-g1-named-incident-reports]] and [[examples/reddit-s-march-2023-pi-day-outage-is-known-only-from-the-k8s-af-index-and-a-secondary-retelling]].

## Reddit's OPA webhook timeouts were a symptom

Reddit's primary postmortem adds a counter-example to the webhook failure class. During the Pi-Day outage the API server logged write timeouts from calling the Open Policy Agent admission webhook, and removing its webhook configurations ended the timeouts instantly without recovering the cluster. The webhook backend had stopped because cluster networking had already failed, so the timeouts were a symptom of the routing failure and not its cause. Treat webhook timeouts during a wider outage as a lead to check, not as proof of the root cause. See [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]].
