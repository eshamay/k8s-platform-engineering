---
title: "Research dossier: control-plane outage postmortems (g1-outage-postmortems)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: []
tags: [postmortem, openai, jetstack, neon, admission-webhook, k8s-af, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: control-plane outage postmortems (g1-outage-postmortems)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-outage-postmortems.md` (sha256 prefix 0487bcf071d6)<br>
> **Kind:** Verified research dossier for gap cluster g1-outage-postmortems, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing postmortem, webhook, and control-plane overload pages<br>
> **Caveat:** All incident figures are self-reported by the operators. The Jetstack post was read through a Wayback Machine capture of the Venafi-hosted copy, and the web search tool returned many empty result sets, so the "not found" list is weak evidence of absence.

## Summary

The dossier reads three primary incident write-ups. OpenAI's status-page post-mortem for 2024-12-11 describes a new telemetry service that overwhelmed the Kubernetes control plane, locked engineers out of the API servers, and degraded all services from 3:16 PM to 7:38 PM PST. Jetstack's 2019 post describes a GKE master upgrade that stalled because an OPA validating webhook could not answer the API server's own startup write, after which node auto-repair recreated nodes in a loop. Neon's May 2025 post describes two incidents, 5.5 hours in total, in which a slow control-plane database query stopped idle compute pods from suspending and exhausted subnet IP addresses.

The three share one shape: a component on the critical path of the Kubernetes API degraded the control plane, and the repair needed control-plane access that the failure had removed. The dossier also reads the k8s.af index (78 entries, newest dated 2023) and finds only two webhook-tagged entries, Jetstack and Airbnb. It found no primary postmortem of a CRD deletion cascade or an etcd quota alarm, did not read the Airbnb talk, and found no 2024 to 2026 postmortem for Argo CD, Flux, Crossplane, Karpenter, cert-manager, Kyverno, or Gatekeeper, though its search tool was weak.

## Key claims

### OpenAI, 2024-12-11 (self-reported, VERIFIED)

- The outage was caused by "a new telemetry service deployment that unintentionally overwhelmed the Kubernetes control plane, causing cascading failures across critical systems." https://status.openai.com/incidents/ctrsv3lwd797
- The service's configuration "caused every node in each cluster to execute resource-intensive Kubernetes API operations whose cost scaled with the size of the cluster." The write-up does not say DaemonSet, and it does not say list or watch.
- "Between 3:16 PM PST and 7:38 PM PST on December 11, 2024, all OpenAI services experienced significant degradation."
- "At 3:12 PM PST, we deployed a new telemetry service to collect detailed Kubernetes control plane metrics."
- The impact was "most pronounced in our largest clusters, so our testing didn't catch it." The write-up also says "no precautions were taken to assess Kubernetes API server load."
- "DNS relies on the control plane – services don't know how to contact one another", and "as cached records expired over the following 20 minutes, services began failing."
- Remediation was blocked because "we needed to access the Kubernetes control plane – which we could not do."
- Mitigations ran in parallel: scale down cluster size, block network access to Kubernetes admin APIs ("Prevented new expensive requests"), and scale up API servers.
- The timeline: change merged 2:23pm, applied to all clusters 2:51 to 3:20pm, alerts 3:13pm, "3:40pm: Maximum customer impact", first cluster recovered 4:36pm, all clusters 7:38pm.
- The prevention list includes phased rollouts with cluster-health monitoring, fault injection, break-glass access ("We'll implement break-glass mechanisms to ensure that engineers can access Kubernetes API servers in any circumstances"), decoupling the data plane from the control plane, and faster recovery with caching and dynamic rate limiters. These are commitments, and delivery was not checked.
- "OpenAI operates hundreds of Kubernetes clusters globally."
- The status page shows the incident from Dec 11, 2024, 06:42 PM to Dec 12 01:23 AM, in a display timezone the page does not state.

### Jetstack, 2019-09-05 (self-reported, VERIFIED through a Wayback capture)

- URL read: https://web.archive.org/web/20230930170348/https://venafi.com/blog/gke-webhook-outage/ (original https://blog.jetstack.io/blog/gke-webhook-outage returned an empty page).
- The cluster was a "regional cluster running in europe-west1 on Google Kubernetes Engine (GKE)", a shared dev cluster, upgraded through a Terraform pipeline with a 20 minute timeout.
- During the second master's upgrade, "the API server attempted to update a ConfigMap called extension-apiserver-authentication in kube-system. This operation timed out", because the write was subject to the OPA validating webhook whose backend was not responding.
- "This operation must complete for a master to pass a health check", so the master crash-looped and the upgrade halted.
- Intermittent API downtime stopped kubelets reporting node health, and "all the nodes started to be destroyed and recreated in an endless loop."
- The fix was deleting the webhook resource, possible because the API was intermittently reachable. Follow-ups scoped the webhook by namespace, "only enabled the webhook for Ingress and Service resources", added a livenessProbe to OPA, and updated the OPA docs (PRs 1435 and 1605). They kept node auto-repair on.
- Their lesson: "alerting on API server response times we might have noticed". The upstream issue kubernetes/kubernetes#54522 was cited as open at capture time and was not read.

### Neon, 2025-05-16 and 2025-05-19 (self-reported, VERIFIED on neon.com)

- URL: https://neon.com/blog/postmortem-delayed-start-compute-operations, dated 2025-05-21. Two incidents in AWS us-east-1 left customers unable to create or start inactive databases "for a total period of 5.5 hours."
- The trigger was a changed execution plan on an expensive control-plane database query, "increasing query execution times by 1-2 orders of magnitude (10x-100x)". Suspension of idle compute pods stalled, pods rose to about 8000 against 6000 planned capacity, and IPs ran out in 2 of 3 subnets.
- Mitigation set the AWS CNI `WARM_IP_TARGET` to 1 first (some IPs released, then a ceiling of about 10k pods), then set both `WARM_IP_TARGET` and `WARM_ENI_TARGET` to 0. Neon also upscaled the control-plane database and enabled then disabled proxy rate limiting. "restoring WARM_IP_TARGET to '1' triggered a new outage."
- Neon plans to replace this architecture with a project it calls Cells. A follow-up "triggering event" post was not read.

### k8s.af index (VERIFIED as index text)

- The Codeberg README at https://codeberg.org/hjacobs/kubernetes-failure-stories lists 78 entries, "Most recent publications on top.", with the newest dated entry in 2023 (Reddit).
- The Jetstack entry reads "involved: ValidatingWebhookConfiguration, GKE node auto-repair". The Airbnb KubeCon NA 2020 entry reads "involved: MutatingAdmissionWebhook, CPU Limits, OOMKill, kube2iam, HPA". Those are the only two webhook-tagged entries.

### Secondary only

- The CNCF blog of 2026-03-12 (https://www.cncf.io/blog/2026/03/12/making-etcd-incidents-easier-to-debug-in-production-kubernetes/) says the etcd storage quota "defaults to 2GiB". It is a tooling article and describes no specific incident. SECONDARY-ONLY.

## Not found or unverified

- No primary write-up of a CRD deletion cascade or an etcd quota alarm (NOSPACE) postmortem from 2019 to 2026. UNVERIFIED absence, since search was weak.
- The contents of the Airbnb talk (https://www.youtube.com/watch?v=4CT0cI62YHk) are unread.
- No 2024 to 2026 postmortem for Argo CD, Flux, Crossplane, Karpenter, cert-manager, Kyverno, or Gatekeeper was obtained.
- The claim that OpenAI's exact API calls were list or watch calls is not stated in the primary text.

## Pages updated or created from this source

New examples: [examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook](../examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook.md) and [examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query](../examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query.md). Rewritten from commentary to primary: [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](../examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md). New findings: [findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade](../findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade.md), [findings/intermittent-api-server-downtime-can-send-node-auto-repair-into-an-endless-recreate-loop](../findings/intermittent-api-server-downtime-can-send-node-auto-repair-into-an-endless-recreate-loop.md), [findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load](../findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load.md), [findings/a-staging-test-passed-because-the-failure-scaled-with-cluster-size-and-resource-checks-ignored-api-server-load](../findings/a-staging-test-passed-because-the-failure-scaled-with-cluster-size-and-resource-checks-ignored-api-server-load.md), [findings/a-slow-control-plane-database-stopped-pod-suspension-and-exhausted-subnet-ips-and-a-cni-setting-change-caused-a-second-outage](../findings/a-slow-control-plane-database-stopped-pod-suspension-and-exhausted-subnet-ips-and-a-cni-setting-change-caused-a-second-outage.md), and [findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm](../findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm.md).
