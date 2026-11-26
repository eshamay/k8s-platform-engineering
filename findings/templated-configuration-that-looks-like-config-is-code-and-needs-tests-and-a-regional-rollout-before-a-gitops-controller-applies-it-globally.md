---
title: Templated configuration that looks like config is code and needs tests and a regional rollout before a GitOps controller applies it globally
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
aliases: []
tags: [gitops, templating, blast-radius, rollout, skyscanner, guardrail]
---

# Templated configuration that looks like config is code and needs tests and a regional rollout before a GitOps controller applies it globally

## Observation

Skyscanner's 2021 outage began with a change to a templating file that had accumulated logic over time. The team had added templating and conditionals to make the configuration easier to manage, yet it never added tests or even linting, because nobody thought of the file as anything but configuration. A change that dropped the template markers passed peer review, merged, and rolled out to every region at once, where Argo CD reconciled the broken output into deleting every service. [[sources/skyscanner-namespace-deletion-postmortem]]

## Why a GitOps controller makes this sharper

A pull-based controller does exactly what the repository says, on every cluster, quickly and without hesitation. When the desired state is wrong, reconciliation is the mechanism that spreads the damage. Skyscanner's own conclusion was "Don't do global config deploys", with the observation that the team had worked hard to avoid global changes but had not recognized that this rarely changed root file was one. See [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]].

## Guardrails the post names

The post lists the mitigations the team adopted or recommends: avoid global configuration deploys (the post does not spell out a staged alternative, so the regional rollout in this page's title is the wiki's reading of that lesson, not Skyscanner's wording), test and lint templated configuration as code, plan for more severe disaster scenarios and rehearse them, verify that backups can actually be fetched and restored, keep runbooks readable for a stressed responder, and weigh whether templating against regions is worth the risk of rolling automation across all of them. The post also notes the trade-off honestly: without the templating there is a chance of configuration drift, and with it there is a chance of automation rolling a mistake everywhere. [[sources/skyscanner-namespace-deletion-postmortem]]

## Related pages

[[concepts/gitops-pull-based-delivery]], [[concepts/self-healing-and-drift-detection]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[findings/mutable-remote-references-change-what-a-commit-renders]].
