---
title: An OpenAI outage shows many API clients can overload the control plane
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [outage, api-server, postmortem, scale]
---

# An OpenAI outage shows many API clients can overload the control plane

## Scenario

A public OpenAI postmortem describes an outage in which a newly deployed telemetry service made expensive API calls from every node. Ahmet Alp Balkan's commentary is the only account the dossier read. [[sources/research-informers-reflectors-and-workqueues]]

## What happened

The calls overloaded the Kubernetes API servers, which blocked the remediation the operators needed. DNS-based service discovery depended on the control plane, so cached records expiring cascaded into data-plane failure. The commentary draws lessons about slower staged rollouts, problems that appear only at large cluster size, API Priority and Fairness so that administrators keep access, and right-sizing control planes. URL: https://ahmet.im/blog/openai-kubernetes-incident/.

## Why it belongs here

The root cause was telemetry load and not an informer bug, so the relevance is indirect. The case shows why informers exist: one cache-backed watch per process is cheap, while many clients that list and watch independently are not. The primary postmortem was not read, and the quotation about DNS is as extracted and should be verified. See [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]], [[findings/etcd-scale-limits-of-the-shared-store]], and [[concepts/informers-reflectors-and-workqueues]].
