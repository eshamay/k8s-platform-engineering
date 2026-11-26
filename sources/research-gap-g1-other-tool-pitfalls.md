---
title: "Research dossier: first-party pitfall evidence for kro, Config Connector, ACK, and Cluster API (g1-other-tool-pitfalls)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [kro, config-connector, ack, cluster-api, pitfalls, deletion, adoption, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: first-party pitfall evidence for kro, Config Connector, ACK, and Cluster API (g1-other-tool-pitfalls)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-other-tool-pitfalls.md` (sha256 prefix a942f0ae1b1b)<br>
> **Kind:** Verified research dossier for gap cluster g1-other-tool-pitfalls, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing kro, Config Connector, ACK, Cluster API, and pitfall pages<br>
> **Caveat:** Every item is a GitHub issue or release note read through the gh CLI. None is a named-organization postmortem. Reporters are individuals, the issues are reproductions or near-misses, and almost all are still open with no maintainer root-cause confirmation.

## Summary

The dossier looked for first-party evidence (project issues, release notes, maintainer-authored text) of pitfalls in kro, Config Connector (KCC), ACK, and Cluster API (CAPI). The strongest evidence is for ACK and Config Connector, where detailed, reproduction-backed issues were filed between September and November 2026. kro evidence is thinner and comes from a fault-injection tool and two user reports. Cluster API produced release-note breaking changes and a webhook-availability issue but no deletion or data-loss incident. The kro repository now lives at kubernetes-sigs/kro, formerly kro-run/kro.

Several ACK issues were filed on 2026-11-09 by one reporter (gecube), so they are one person's audit and not independent corroboration. Issue 3122 is by a different reporter (sapphirew) and was filed on 2026-10-31.

## Key claims

### kro

- kro v0.8.0 (published 2026-01-28) blocks breaking CRD schema changes by default, and the `kro.run/allow-breaking-changes` annotation overrides the block. VERIFIED. Release notes: "blocks incompatible changes (like removing fields, changing types, or adding required properties) by default". https://github.com/kubernetes-sigs/kro/releases/tag/v0.8.0
- Issue 1395 (2026-09-04, JacobGabrielson, open) says the block error did not name the override annotation, so operators were led toward deleting and recreating the RGD, which the reporter said was unsafe because the RGD drove per-AZ ENIConfig. VERIFIED as the reporter's claim. https://github.com/kubernetes-sigs/kro/issues/1395
- Issue 1391 (2026-09-03, open) says adding an `enum=` or CEL `validation=` marker to an existing RGD field is accepted as Ready but never patched into the live CRD, so the CRD keeps accepting values the RGD now forbids. VERIFIED as the reporter's claim, with a code reference. The reporter's handle (`dmarquez-splunk`) suggests a Splunk affiliation, which the issue does not state. https://github.com/kubernetes-sigs/kro/issues/1391
- Issue 886 (2025-12-05, toweroy, open when read) says one misconfigured RGD blocked updates to every other RGD until the bad one was deleted and the controller pod restarted. VERIFIED as the reporter's claim: "all new changes to every `ResourceGraphDefinition` will be blocked". https://github.com/kubernetes-sigs/kro/issues/886
- Issue 1171 (2026-03-19, kro v0.8.4, open) comes from the fault-injection tool kamera and not from production. It reports that a controller crash mid-deletion can leave the instance with its finalizer and its children alive, and, per the reporter, delete the CRD despite `allowCRDDeletion=false`. VERIFIED as an open, unconfirmed report; it had only triage-bot comments and two reporter comments. https://github.com/kubernetes-sigs/kro/issues/1171
- kro v0.10.0 (2026-11-10) lists graph-cleanup fixes ("Fix Graph cleanup after partial apply failures", "Fix Graph cleanup when child UIDs are missing") and adds a per-resource deletion policy. VERIFIED from the release notes only. The dossier did not tie these fixes to issue 1171 and makes no claim that they close it. https://github.com/kubernetes-sigs/kro/releases/tag/v0.10.0

### Config Connector

- KCC v1.162.0 (2026-11-23) was the latest release read. VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/releases
- Issue 16444 (2026-11-25, acpana, open) says that with multi-cluster leader election, deleting objects on a standby that previously led leaves them Terminating, and when that cluster leads again it executes the stale deletion against GCP, "silently deleting live resources". VERIFIED as issue text. https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/16444
- Issue 15930 (2026-11-17, open) says Direct-controller resources stick in Terminating when a referenced or parent object is deleted first, and `deletion-policy: abandon` "does not release the object either", because reference resolution and the GCP read run before the deletion check. VERIFIED as the reporter's claim, reproduced on v1.161.0 per the reporter. https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/15930
- Issue 13335 (2026-09-20, open) says `deletion-policy: abandon` leaves `managed-by-cnrm` and `cnrm-lease` labels on the Google Cloud resource. SECONDARY-ONLY: the reporter says they did not reproduce it against a current release and took the description from older issue 146, which was closed as not planned. https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/13335
- Issue 12944 (2026-09-15, KCC 1.155.1 in the reporter's setup) says StorageBucket `spec.location` edits reconcile to Ready and UpToDate while the bucket stays put, because the immutability check was removed in 1.132.0, which the reporter calls "silent drift with a green status". VERIFIED as the reporter's claim. https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/12944

### ACK

- Issue 3142 (2026-11-09, gecube, open) says ACK records ownership only in the CR status and "there is no owner check before an update or a delete", so a restored cluster copy, two controller installs, or a rollout overlap can give one AWS resource two owners, and deleting a CR in one deletes the other's resource. VERIFIED as the reporter's claim. https://github.com/aws-controllers-k8s/community/issues/3142
- Issue 3152 (2026-11-09, open) says adoption under Argo CD or Flux overwrites the adopted AWS resource with the spec in git: "every spec field that is in git goes back to its value in git". VERIFIED as the reporter's claim, reproduced on iam-controller v1.11.3 per the reporter. https://github.com/aws-controllers-k8s/community/issues/3152
- Issue 3153 (2026-11-09, open feature request) says pruning an ACK CR from git deletes the AWS resource, which cannot be undone once the API server accepts the DELETE: "Deleting an ACK custom resource deletes the AWS resource. That is the documented default". VERIFIED. https://github.com/aws-controllers-k8s/community/issues/3153
- Issue 3154 (2026-11-09, open) says the namespace deletion-policy annotation is ignored in single `--watch-namespace` installs, so "a namespace set to `retain` still has its AWS resources deleted". VERIFIED as the reporter's claim, with source links. https://github.com/aws-controllers-k8s/community/issues/3154
- Issue 3136 (2026-11-09, open) says that if the spec patch fails during adoption, the next reconcile updates AWS with the CR's stub spec. VERIFIED as the reporter's claim. The IAM consequences (detached policies, replaced trust policy) come from the reporter's code reading and were "not reproduced end to end". https://github.com/aws-controllers-k8s/community/issues/3136
- Issue 3122 (2026-10-31, sapphirew, open) says EC2 controller create calls, shown for `CreateVpcEndpoint`, lack a stable ClientToken, so "overlapping controller pods create duplicate (orphaned) resources". VERIFIED. The evidence is a CI run on 2026-10-30 where a rollout with leader election off left an orphaned VPC endpoint, and the title's "Create calls" generalizes from `CreateVpcEndpoint`. https://github.com/aws-controllers-k8s/community/issues/3122

### Cluster API

- CAPI v1.14.0 (published 2026-08-11) lists 4 breaking changes, including a controller-runtime v0.24 bump and "Fix version validation in webhooks" (PR 13874, merged 2026-07-03), which tightens validation that allowed invalid pre-release or build tags. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.14.0
- The same release notes say v1beta1 is "on track to be unserved in CAPI v1.16" and that Docker* resources are removed in v1.15. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.14.0
- Issue 10522 (2024-04-26, maintainer chrischdi, open when read) says cert-manager certificate rotation can make conversion and validating webhooks unreachable for up to 90 seconds, and a clusterctl upgrade test (v0.4 to v1.6) failed because "a validating webhook was not available due to x509 errors". VERIFIED. https://github.com/kubernetes-sigs/cluster-api/issues/10522
- Issue 11387 (2024-11-06, closed) says the `random` MachineSet delete policy ignored the `cluster.x-k8s.io/delete-machine` annotation. VERIFIED as a minor behavioral inconsistency and not an incident. https://github.com/kubernetes-sigs/cluster-api/issues/11387
- The latest stable CAPI releases read were v1.14.4 and v1.13.8 (2026-11-03), and v1.15.0-rc.0 is a pre-release. VERIFIED.

## Not found

- Named-organization production postmortems (company, date, outage impact) for kro, Config Connector, ACK, or Cluster API.
- ACK release-note breaking changes or upgrade-ordering notes: a search of the community repo for "upgrade breaking" had no hits, and per-controller release notes were not read.
- Cluster API deletion or data-loss incidents from the last two years. Hits were from 2020 to 2021 or unrelated.
- Maintainer fixes or root-cause confirmations for the ACK November 2026 issues, kro 1171, and KCC 16444 and 15930. All were open.
- The official KCC deletion-policy documentation and the ACK adoption documentation were not read directly, and no maintainer blog or conference talks on pitfalls were searched.

## Related wiki pages

[[entities/kro]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[concepts/pitfalls-and-case-studies]], [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]]
