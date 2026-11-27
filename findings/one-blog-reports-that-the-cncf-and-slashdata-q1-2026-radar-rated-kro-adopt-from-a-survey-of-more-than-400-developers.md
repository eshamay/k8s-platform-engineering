---
title: One blog reports that the CNCF and SlashData Q1 2026 radar rated kro Adopt from a survey of more than 400 developers
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
aliases: []
tags: [kro, cncf, slashdata, technology-radar, adoption, secondary-source]
---

# One blog reports that the CNCF and SlashData Q1 2026 radar rated kro Adopt from a survey of more than 400 developers

> [!NOTE]
> **Evidence grade:** Secondary. The only source is a company blog post dated 2026-07-29, https://bex.co/blog/2026/07/29/kro-kube-resource-orchestrator-cncf-radar-adopt. The radar itself was not read.

## Observation

The post by Dora Noda at bex.co says the CNCF and SlashData Q1 2026 Platform Engineering Radar, published in March 2026, placed kro in the "Adopt" tier of the application-delivery category next to Helm and Backstage. According to the post, the underlying survey ran in Q4 2025 across more than 400 professional cloud-native developers and scored each tool on maturity, usefulness, and likelihood to recommend. [sources/bex-co-kro-radar-post](../sources/bex-co-kro-radar-post.md)

## What it does and does not establish

If the post's account is accurate, it is evidence of developer sentiment about the pattern of composing Kubernetes resources into one custom API. The post itself says the rating does not mean a specific kro release is battle-tested, and kro's own API remains `v1alpha1`. It names no company that runs kro in production, gives no scale figure, and reports no incident, so it adds nothing to the evidence gap recorded in [findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter](kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter.md).

The word CNCF in the headline refers to the survey's sponsor. The post separately describes kro as a Kubernetes SIGs subproject under SIG Cloud Provider, so the radar is not a statement that kro is a CNCF project, see [entities/kro](../entities/kro.md).

## Next step

A reader who needs to rely on the placement should read the radar and check the tier, the category, the sample size, and the survey date directly. Until then the claim stays attributed to the blog, as already noted in the correction section of [entities/kro](../entities/kro.md).
