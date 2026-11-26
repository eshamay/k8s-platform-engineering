---
title: "Research dossier: primary reports for the Skyscanner, Reddit, Jetstack, and Spotify incidents (g1-named-incident-reports)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: []
tags: [postmortem, jetstack, reddit, skyscanner, spotify, k8s-af, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: primary reports for the Skyscanner, Reddit, Jetstack, and Spotify incidents (g1-named-incident-reports)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-named-incident-reports.md` (sha256 prefix 3c7df7bb12f1)<br>
> **Kind:** Verified research dossier for gap cluster g1-named-incident-reports, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the existing Jetstack, webhook, and pitfalls pages<br>
> **Caveat:** Only the Jetstack post was read in full, through a Wayback Machine capture. The Reddit, Skyscanner, and Spotify primaries were unreadable with every available tool, and several fetch routes were blocked by the permission classifier and not retried.

## Summary

The dossier set out to read the primary reports behind four incidents that the wiki knew only as one-line k8s.af summaries. It reached one: the Jetstack admission webhook post of 2019-09-05, through a Wayback capture of the Venafi-hosted copy. It confirms every claim the wiki already made about that incident and adds two details: Jetstack considered and rejected disabling GKE node auto-repair, and the post does not mention `failurePolicy`. The Reddit post, the Skyscanner Medium post, and the Spotify KubeCon talk could not be read. For Reddit the only body text was a third-party retelling, which is secondary-only and partly reconstructed. For Skyscanner and Spotify nothing beyond the k8s.af index entries was obtained.

## Key claims

### Jetstack, 2019-09-05 (self-reported, VERIFIED)

- The outage was a regional GKE cluster in europe-west1, and the Terraform pipeline had a 20 minute timeout. Quote: "This was a regional cluster running in europe-west1 on Google Kubernetes Engine (GKE)." https://web.archive.org/web/2023/https://blog.jetstack.io/blog/gke-webhook-outage/
- The `ca-registration` PostStartHook update to a ConfigMap timed out. Quote: "This operation timed out as the backend for the validating Open Policy Agent (OPA) webhook we had configured was not responding."
- Node auto-repair amplified the outage. Quote: "all the nodes started to be destroyed and recreated in an endless loop."
- Recovery was deleting the webhook resource. Quote: "we were able to delete this `ValidatingAdmissionWebhook` resource to restore the cluster service." Afterwards the webhook was scoped to specific namespaces and to Ingress and Service, and OPA got a liveness probe.
- Jetstack rejected disabling node auto-repair. Quote: "We also considered but decided against disabling GKE node auto-repair."
- Lessons: alert on API server response times and probe all workloads. Quote: "It also hammers home the value of configuring probes for all workloads." The upstream issue kubernetes/kubernetes#54522 was open in the captured copy (captured 2023-09-30).
- The post does not mention `failurePolicy`. No `failurePolicy` recommendation is attributable to Jetstack.

### Reddit Pi-Day outage (SECONDARY-ONLY)

- The k8s.af index lists the incident as "involved: Calico CNI, Upgrades, labels" with global outage impact. The primary is https://www.reddit.com/r/RedditEng/comments/11xx5o0/you_broke_reddit_the_piday_outage/ and it was unreadable.
- A Kubezilla retelling dates it 14 March 2023 and describes a 1.23 to 1.24 upgrade in which a Calico route reflector selected nodes by the `node-role.kubernetes.io/master` label, which the upgrade removed. The 1.24 label detail is not confirmed in Reddit's post. https://kubezilla.io/kubernetes-horror-story-reddits-314-minute-pi-day-outage/
- The retelling's 314 minute duration and 52 million user figure are unconfirmed against Reddit. Its pod listings, command output, and minute-by-minute narrative are UNVERIFIED and are not copied into the wiki.

### Skyscanner and Spotify (index-only, SECONDARY-ONLY)

- Skyscanner's 2021 post is listed as "involved: Gitops, templating, namespace deletion" with global outage impact. Its mechanism, date, and recovery are UNVERIFIED. Primary: https://medium.com/@SkyscannerEng/how-a-couple-of-characters-brought-down-our-site-356ccaf1fbc3
- Spotify's incident, from David Xia's KubeCon Europe 2019 talk, is listed as accidental deletion of GKE clusters with "impact: no impact on end users", involving Terraform, a global state file, and browser tabs. The detailed sequence is UNVERIFIED. Primary: https://www.youtube.com/watch?v=ix0Tw8uinWs

## Not found

Reddit primary text, Skyscanner primary text, any written Spotify postmortem, and a readable original blog.jetstack.io page were not obtained. Not checked: Skyscanner's 2019 HAProxy templating post, a Skyscanner-hosted mirror of the 2021 post, a redditinc.com mirror of the Pi-Day post, and third-party transcripts of the Spotify talk. Reading the three unread primaries needs a permission change or a different access path chosen by the user.

## Pages updated or created from this source

New example: [[examples/reddit-s-march-2023-pi-day-outage-is-known-only-from-the-k8s-af-index-and-a-secondary-retelling]]. Updated: [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]], [[findings/admission-webhook-outages-are-a-recurring-failure-class]], [[findings/intermittent-api-server-downtime-can-send-node-auto-repair-into-an-endless-recreate-loop]], [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]], [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]], and [[open-knowledge-gaps]].
