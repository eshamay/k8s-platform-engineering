---
title: Jetstack's 2019 GKE master upgrade stalled on an unresponsive OPA validating webhook
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: [Jetstack GKE webhook outage]
tags: [postmortem, admission-webhook, gke, opa, node-auto-repair, jetstack]
---

# Jetstack's 2019 GKE master upgrade stalled on an unresponsive OPA validating webhook

## Scenario

Jetstack published a post on 2019-09-05 about an outage on a shared dev cluster. The cluster was a regional GKE cluster in europe-west1 used by many teams, and its master upgrade ran through a Terraform pipeline with a 20 minute timeout. The post is self-reported. The wiki read it through a Wayback Machine capture of the Venafi-hosted copy at https://web.archive.org/web/20230930170348/https://venafi.com/blog/gke-webhook-outage/, because the original https://blog.jetstack.io/blog/gke-webhook-outage returned an empty page. [[sources/research-gap-g1-outage-postmortems]]

## What happened

While the second master was upgrading, the API server tried to update the ConfigMap `extension-apiserver-authentication` in `kube-system` as part of its `ca-registration` post-start hook. That write was subject to an OPA validating webhook whose backend was not responding, so it timed out. The post says "This operation must complete for a master to pass a health check", so the master failed its health check, crash-looped, and the upgrade halted. Intermittent API downtime then stopped kubelets from reporting node health, and GKE node auto-repair began recreating nodes in an endless loop, which caused loss of service for every tenant. The mechanism was established with Google Support.

The fix was to delete the validating webhook resource, which worked only because the API server answered intermittently. The follow-ups were to scope the webhook to the namespaces where policy applies and where teams have access, to enable it only for Ingress and Service resources, to add a livenessProbe to OPA, and to update the OPA documentation (pull requests 1435 and 1605). They kept node auto-repair on. Their stated lessons were to alert on API server response times for CREATE and UPDATE and to use a Helm chart that encodes the probes. The upstream issue kubernetes/kubernetes#54522 was cited as open when the page was captured and was not read.

## Why it belongs here

This is the first primary read of a k8s.af webhook postmortem in the wiki, and it turns the index-level description "ValidatingWebhookConfiguration, GKE node auto-repair" into a mechanism. It is the concrete case behind [[findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade]] and [[findings/intermittent-api-server-downtime-can-send-node-auto-repair-into-an-endless-recreate-loop]]. It also supports the general pattern in [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]] and the trade-off in [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]]. See also [[findings/admission-webhook-outages-are-a-recurring-failure-class]] and [[concepts/admission-webhooks-and-cel]].

## Confirmation from a second read

A later dossier re-read the same post through another Wayback capture of the original URL, https://web.archive.org/web/2023/https://blog.jetstack.io/blog/gke-webhook-outage/ (captured 2023-09-30), and confirmed the mechanism above. It adds two details. Jetstack states "We also considered but decided against disabling GKE node auto-repair", so keeping auto-repair on was a deliberate choice. The post also never mentions `failurePolicy`, so its fixes were scoping, a liveness probe, and alerting, not a change of failure policy. Its closing lesson is "It also hammers home the value of configuring probes for all workloads." [[sources/research-gap-g1-named-incident-reports]]
