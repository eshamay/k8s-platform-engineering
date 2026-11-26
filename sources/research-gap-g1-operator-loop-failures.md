---
title: "Research dossier: operator loop failures, lost events, and status bugs (g1-operator-loop-failures)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [operators, reconcile-loop, hot-loop, informers, lost-events, observedgeneration, readiness, postmortem, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: operator loop failures, lost events, and status bugs (g1-operator-loop-failures)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-operator-loop-failures.md` (sha256 prefix baca2cdf965d)<br>
> **Kind:** Verified research dossier for gap cluster g1-operator-loop-failures, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing reconcile-loop, informer, status, and operator pages<br>
> **Caveat:** The evidence is GitHub issues with root-cause analysis, filed by users or contributors and not by a vendor incident process. Every impact figure is self-reported by the issue author, and no formal organization-authored operator postmortem was found.

## Summary

The dossier looked for named, published evidence of operator and controller failures: formal postmortems, hot or self-triggered reconcile loops, incidents from lost events or edge-triggered design, and status bugs such as a missing `observedGeneration` or an early `Ready`. Its headline is negative on formal postmortems and positive on issue-level root causes. No organization-authored postmortem about a Kubernetes operator was found, and the k8s.af failure index has no entry whose stated involvement is an operator bug.

The strongest material is on runaway reconcile loops. Four independent issues show the same mechanism of a controller that writes status or re-applies an object on every pass even when nothing changed, so each write produces a watch event that re-enqueues the object. A fifth issue shows the resource cost of a retry loop with no backoff. For lost events the best primary evidence is a client-go informer bug, fixed upstream, and a restart-gap case in NVIDIA NVSentinel. For status problems three open 2026 issues show `Ready` or `Healthy` reported for a spec generation the controller had not yet seen.

## Key claims

### Runaway reconcile loops

- Rancher cluster-api-provider-rke2 v0.22.0 onward: the RKE2ControlPlane controller defers a status patch with no equality check, which the reporter measured at about 10 reconciles per second, indefinitely, even after the external trigger was removed. The reporter attributes the regression to a commit adding the v1beta2 status path, and v0.21.0 was quiet. VERIFIED as the reporter's account (issue 905, reporter pydeepzp, 2026-05-18, open when read). The 409 conflicts were reported only for CAAPF, a correction made in the dossier's verification. https://github.com/rancher/cluster-api-provider-rke2/issues/905
- Longhorn issue 13831 (reporter 0byte-coding, 2026-08-24, Longhorn v1.10.1, open): the BackupTargetController stores the raw backup-store error, with S3 request IDs and RFC3339 timestamps, in a condition message, so `reflect.DeepEqual` never matches and each failure triggers a status update and a re-enqueue that bypasses `PollInterval`. Measured at about 6 reconciles per second with invalid B2 credentials. VERIFIED. https://github.com/longhorn/longhorn/issues/13831
- Konflux kube-shard issue 121 (reporter gbenhaim, opened and closed 2026-09-07): `applyOTelCollector` server-side-applies one hashed ConfigMap twice with the same field manager but different label sets, each apply bumps the resource version, and the controller owns ConfigMaps with no predicate, giving about 13 APIShard reconciles per second while the shard is Ready. VERIFIED, with fix details beyond the first 2,000 characters unread. https://github.com/konflux-ci/kube-shard/issues/121
- Crossplane issue 7221 (filed by tgoodwin using the kamera reconcile-ordering tool, 2026-03-19, closed 2026-05-13): the CompositionRevision and composite reconcilers call `Status().Update()` on every pass regardless of change, so test scenarios never converge, and in production the rate limiter dampens it to slow churn. A maintainer acknowledged it. VERIFIED for the report and closure, and the fix content is UNVERIFIED. https://github.com/crossplane/crossplane/issues/7221
- Argo CD issue 18151 (reporter diranged, 2024-05-09, closed 2024-08-01): after upgrading to 2.11 the application controller's PATCH rate to Application objects jumped across about 10 clusters, and the reporter rolled back to 2.10.9. Later comments blame custom Lua health checks on Crossplane resources and a stale `.path` in `status.sync.comparedTo`, which are user diagnoses and not maintainer-confirmed. VERIFIED for the symptom, and the cause is UNVERIFIED. https://github.com/argoproj/argo-cd/issues/18151
- Argo Rollouts issue 4140 (2025-02-19, v1.7.2, `--rollout-resync=60`, about 800 Rollouts across 4 clusters): constant high workqueue add rates for DestinationRules, Services, and Rollouts after promotions, reported as 2 to 4 times the expected events. VERIFIED for the symptom, open, and no root cause stated. https://github.com/argoproj/argo-rollouts/issues/4140
- Longhorn issue 14121 (reporter brianramseyau, 2026-09-28, open): during an S3 backup-target outage `longhorn-manager` memory grew about 25 times on every node, followed by an OOM kill at about 5.5 GiB and node Ready flaps. The reporter's diagnosis is "No exponential backoff or target-health gate appears to suppress these reconcile attempts while the target is down". Two managers that were not killed returned to about 240 MiB without a restart once the target recovered. VERIFIED as the issue text, with the causal diagnosis being the reporter's. https://github.com/longhorn/longhorn/issues/14121

### Lost events and edge-triggered design

- Kubernetes issue 115658 (reporter odinuge, opened 2023-02-09, closed 2023-03-20): if a watch ends and a relist runs while a CREATE for a short-lived object is still queued in DeltaFIFO, no DELETED event is generated, so the consumer leaks the object. The reporter saw controllers drift out of sync with queues over 1000 elements and resync disabled. VERIFIED, with impact figures self-reported and the reporter's employer not stated. https://github.com/kubernetes/kubernetes/issues/115658
- The fix is pull request 115620 "client-go/cache: fix missing delete event on replace", merged 2023-02-17. A maintainer (liggitt) said pull request 116623 (merged 2023-03-16, "change where transformers are called") resolved the issue for 1.27, and backports were held from 2023-03-01 to 2023-03-20 over a transformer-related regression concern. VERIFIED. https://github.com/kubernetes/kubernetes/pull/115620
- NVIDIA NVSentinel issue 1542 (2026-07-27, closed 2026-10-21): if the kubernetes-object-monitor is down when a watched object is deleted, the delete is never delivered to the new informer instance, no healthy event is sent, and the node stays cordoned until manually unquarantined. The report says "Most controllers workaround this issue by leveraging a finalizer". VERIFIED for the report, and the fix is UNVERIFIED. https://github.com/NVIDIA/NVSentinel/issues/1542
- A user in Argo Rollouts issue 4140 says operators run `--rollout-resync=60` "to prevent rollouts from getting stuck due to missed events". SECONDARY-ONLY, because it is a user statement about the flag's purpose and the flag documentation was not read.
- KubeFleet issue 635 (2026-04-23) quotes a hardcoded 30-minute safety resync in the placement controller: "We use a safety resync period to requeue all the finished request just in case there is a bug in the system." VERIFIED as a code comment quoted in the issue, and it is design intent and not an incident. https://github.com/kubefleet-dev/kubefleet/issues/635

### Status problems

- CloudNativePG 1.30.0 issue 11390 (reporter GellertBabel, 2026-09-01, Kubernetes 1.36, open): after patching `spec.instances`, `kubectl wait --for=condition=Ready` returns immediately on a Ready condition produced before the change, and `Cluster.status` has no field to tell the difference. The reporter wrote "I can get Ready=True that was produced before my change was ever looked at." VERIFIED. https://github.com/cloudnative-pg/cloudnative-pg/issues/11390
- restate-operator 3.1.0 issue 216 (reporter we2beast, 2026-10-12, open): RestateCluster reports Ready=True before a StatefulSet rollout finishes and the status has no `observedGeneration`. Flux with `wait: true` marked the release healthy at 14:16:53, about 37 seconds before the last pod became Ready. VERIFIED, with the timing self-reported. https://github.com/restatedev/restate-operator/issues/216
- Argo CD issue 30373 (2026-10-23, open): the built-in ACK health check, added in v3.6.0-rc1, reports Healthy before the ACK controller has observed a spec change, because ACK resources lack `observedGeneration`. The reporter's watch (iam-controller v1.10.1, EKS 1.35) shows conditions unchanged at generation 2 to 3 until the controller re-stamped about 2 seconds later. VERIFIED for the timeline. The reporter's statement that ACK issue 1583 has been open since 2022 is SECONDARY-ONLY. https://github.com/argoproj/argo-cd/issues/30373

### Formal postmortems

- The k8s.af index (about 60 public stories, newest entry 2023) has no entry whose stated involvement is an operator or custom controller bug. The nearest are Jetstack's admission webhook outage and Xing's talk listing "stuck controllers", neither read in full. VERIFIED for the index contents, and the linked stories are UNVERIFIED. https://k8s.af/
- The Render informer post could not be retrieved (the scrape was empty and the fetch was blocked), and its search title concerns a DNS dependency, so it may not be about informers. The ondemandenv.dev Thermostat article was not retried. No named-company outage caused by edge-triggered controller design was found.

## Mechanism summary

Two causes recur in the loop cases. Cause A is an unconditional status write on every pass. Cause B is a write that is idempotent in meaning but not in bytes, either because volatile text lands in a status field or because two applies of one object differ. In both, the write's resource version change reaches the controller's own watch and re-enqueues the object.

## Not found

- Formal, organization-authored postmortems of a Kubernetes operator failure (stuck finalizers, CRD upgrade breakage, reconcile storm).
- Conference talks on operator failures or status handling.
- A named-company outage caused specifically by edge-triggered controller design.
- Fix details for Crossplane 7221, NVSentinel 1542, and kube-shard 121 beyond the first 2,000 characters of each issue.

## How the wiki used it

New example pages record each named issue, and new finding pages record the mechanisms: [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm]], [[findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version]], [[findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage]], [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]], [[findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it]], [[findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs]], [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]], and [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]].
