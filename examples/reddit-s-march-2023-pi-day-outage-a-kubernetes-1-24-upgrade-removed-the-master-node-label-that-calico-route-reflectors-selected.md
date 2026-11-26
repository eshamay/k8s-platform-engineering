---
title: Reddit's March 2023 Pi-Day outage, a Kubernetes 1.24 upgrade removed the master node label that Calico route reflectors selected
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
aliases: [Reddit Pi-Day outage]
tags: [postmortem, reddit, calico, upgrade, labels, backup-restore, control-plane]
---

# Reddit's March 2023 Pi-Day outage, a Kubernetes 1.24 upgrade removed the master node label that Calico route reflectors selected

## Scenario

Reddit runs bespoke kubeadm-built clusters, accumulated over years, and one of its largest and most critical clusters ran the legacy part of its stack. Upgrades were tested on a dedicated set of clusters and then rolled to production from lowest to highest criticality. On 14 March the Compute team began upgrading that legacy cluster from Kubernetes 1.23 to 1.24 just after 19:00 UTC. [[sources/reddit-pi-day-outage-postmortem]]

## What happened

About two minutes after the upgrade started, the site stopped. The cluster lost all metrics, so responders were blind, and DNS failed for Consul and in-cluster names while public names still resolved. Because Kubernetes has no supported downgrade, rolling back meant restoring a backup, which the team feared because the procedure was old and untested against production, so they chose to fix forward for about two hours. During that time they found slow pod starts and image pulls, an unhealthy Calico, and API server write timeouts caused by calls to admission webhooks. They removed the Open Policy Agent webhook configurations, which ended the timeouts without recovering the cluster. [[sources/reddit-pi-day-outage-postmortem]]

## Recovery

The team terminated the worker nodes, which took about 20 minutes of API calls, then restored etcd to the first control-plane node by a procedure written for an older Kubernetes and for Docker. New control-plane nodes would not join because the TLS certificates on the restored node did not match its default AWS hostname, and AWS capacity for the instance type was briefly exhausted. After new certificates were generated, a high-availability control plane returned and traffic was brought back from 1 percent through 100 percent in stages to avoid a thundering herd. The outage lasted 314 minutes. [[sources/reddit-pi-day-outage-postmortem]]

## Cause

Logs from an agent that had not been affected showed API server logging jump fivefold at 19:04:49 UTC, OPA logs stop about five seconds before that, and Calico nodes drop routes to the upgraded control-plane node and then all routes. Calico runs a full mesh by default, and Reddit's large clusters used route reflectors whose node and peer selectors targeted the label `node-role.kubernetes.io/master`. Kubernetes 1.24 removed that label from running clusters, so the selectors matched nothing and routing collapsed. The post names inconsistency across bespoke clusters as the underlying cause and describes a program to standardize and codify them. See [[findings/hand-edited-calico-route-reflector-configuration-that-was-committed-nowhere-outlived-everyone-who-knew-about-it]] and [[findings/kubernetes-has-no-supported-downgrade-so-a-failed-control-plane-upgrade-forces-a-backup-restore-and-an-untested-restore-procedure-is-the-risk]].

## What the earlier secondary account got right and what it did not establish

The earlier Kubezilla retelling matched the main mechanism (the 1.24 label change and a Calico route reflector selector) and the 314-minute figure. Its reconstructed command output and timeline, and its 52 million user figure, are not in Reddit's post and are not carried here. This page supersedes [[examples/reddit-s-march-2023-pi-day-outage-is-known-only-from-the-k8s-af-index-and-a-secondary-retelling]].

## Related

[[findings/admission-webhook-outages-are-a-recurring-failure-class]] (the webhook here was a symptom, not the cause), [[concepts/pitfalls-and-case-studies]].
