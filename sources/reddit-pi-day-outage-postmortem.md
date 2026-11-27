---
title: Reddit, You Broke Reddit, The Pi-Day Outage
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
aliases: [Reddit Pi-Day outage postmortem]
tags: [postmortem, reddit, calico, kubernetes-upgrade, labels, backup-restore, opa]
---

# Reddit, You Broke Reddit, The Pi-Day Outage

> [!NOTE]
> **Raw file:** `raw/reddit-pi-day-outage-postmortem.md`<br>
> **Kind:** First-party engineering postmortem on r/RedditEng, read in full from a Wayback Machine capture (2026-08-26)<br>
> **Author:** posted by the user grumpimusprime for Reddit's engineering team<br>
> **Incident:** 14 March, a 314-minute outage; the year, 2023, comes from the k8s.af index and the post's age, since the text gives only the month and day<br>
> **Ingested:** 2026-11-26

## Summary

Reddit explains a 314-minute outage that began roughly two minutes after an engineer started a Kubernetes 1.23 to 1.24 upgrade of the cluster that ran its legacy stack. The proximate cause was a Calico route reflector configuration that selected control-plane nodes by the label `node-role.kubernetes.io/master`, which the 1.24 upgrade removed, so every node dropped its routes. The post is also candid about why recovery took hours: Kubernetes has no supported downgrade, the backup restore procedure was old and had never been used on production, and nobody on the team knew the route reflectors existed. This replaces the earlier secondary-only retelling in this wiki.

## Key claims

- The outage lasted 314 minutes on 14 March during US afternoon hours. Reddit's modern service API layers stayed up, but the affected cluster held the most critical legacy node in its dependency graph, so most user flows were affected.
- The engineer began the 1.23 to 1.24 upgrade just after 19:00 UTC. About two minutes later the site halted, the cluster lost all metrics, and DNS failed for Consul and in-cluster names while public DNS still resolved.
- Kubernetes "has no supported downgrade procedure", because upgrades migrate schemas and data automatically, so reverting means restoring from a backup. The restore procedure was several years old, had been tested on pilot clusters, and had never been run on a production cluster, so the team first tried to fix forward. [findings/kubernetes-has-no-supported-downgrade-so-a-failed-control-plane-upgrade-forces-a-backup-restore-and-an-untested-restore-procedure-is-the-risk](../findings/kubernetes-has-no-supported-downgrade-so-a-failed-control-plane-upgrade-forces-a-backup-restore-and-an-untested-restore-procedure-is-the-risk.md)
- About an hour in the team found slow pod starts and image pulls, an unhealthy Calico, and write timeouts in API server logs that came from calling admission webhooks. The only generalized webhook was Open Policy Agent. Deleting its webhook configurations ended the timeouts but did not recover the cluster, so the webhook was a symptom, not the cause.
- After over two hours the team decided to restore from backup. The restore, written for an older Kubernetes version and for Docker, had to be adapted live. Backups could be taken on any control-plane node but the restore had to run on the same node, and control-plane hostnames were AWS defaults, so TLS certificates failed and new nodes could not join etcd until new certificates were generated. AWS capacity for the control-plane instance type was also exhausted for a time.
- Traffic was restored from 1 percent in steps of 5, 10, 20, 35, 55, 80 and 100 percent to avoid a thundering herd on caches.
- Logs, which came from a low-level agent that was unaffected, showed API server log volume rising fivefold at 19:04:49 UTC, OPA logs stopping about five seconds earlier, and Calico nodes dropping routes to the first upgraded control-plane node and then all routes. [examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected](../examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected.md)
- The cause: Calico route reflectors were configured with node and peer selectors on the label `node-role.kubernetes.io/master`. Kubernetes changed the terminology to control-plane in the 1.20 series and removed the "master" references, even from running clusters, in 1.24. The systemic cause named in the post was inconsistency across bespoke clusters. [findings/hand-edited-calico-route-reflector-configuration-that-was-committed-nowhere-outlived-everyone-who-knew-about-it](../findings/hand-edited-calico-route-reflector-configuration-that-was-committed-nowhere-outlived-everyone-who-knew-about-it.md)

## Limits of this source

The capture holds the article text only. The YAML that showed the faulty selectors was an image and was not captured, so the selector wording is known from the prose. The post does not state user counts. The year and the 52 million user figure in the secondary Kubezilla retelling are not confirmed by this post.
