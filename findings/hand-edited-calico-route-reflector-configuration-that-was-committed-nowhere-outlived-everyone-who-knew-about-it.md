---
title: Hand-edited Calico route reflector configuration that was committed nowhere outlived everyone who knew about it
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
aliases: []
tags: [configuration-as-code, calico, drift, knowledge-loss, reddit, upgrade]
---

# Hand-edited Calico route reflector configuration that was committed nowhere outlived everyone who knew about it

## Observation

Reddit's route reflector setup was created years earlier by the predecessor of the current Compute team. Over time everyone who knew it existed moved on, and only the largest legacy clusters still used it. Calico's route reflector configuration is not managed through the standard Kubernetes API: it has to be fetched through Calico's own command-line interface, edited by hand, and uploaded again. Reddit had not written the custom tooling that would have made this manageable as code, so the configuration was committed nowhere, left no record, and gave engineers no breadcrumbs. One engineer happened to remember the feature and found the cause during the postmortem. [[sources/reddit-pi-day-outage-postmortem]]

## Why it matters

The faulty selectors targeted the `node-role.kubernetes.io/master` label that Kubernetes 1.24 removed, so the upgrade silently invalidated a setting nobody was watching. A declarative platform only protects what is declared. Anything configured outside the Kubernetes API and outside Git is invisible to review, to drift detection, and to upgrade checks. This is the same lesson as the GitOps and Crossplane pitfalls in the wiki, seen from the opposite side. See [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]] and [[concepts/declarative-vs-imperative]].

## Reddit's stated response

The post describes standardizing components across clusters, adding pre-production clusters for realistic testing, building tooling to manage the lifecycle of whole clusters, and codifying everything possible, with detailed documentation where codification is not possible. [[sources/reddit-pi-day-outage-postmortem]]

## Related pages

[[concepts/self-healing-and-drift-detection]], [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]].
