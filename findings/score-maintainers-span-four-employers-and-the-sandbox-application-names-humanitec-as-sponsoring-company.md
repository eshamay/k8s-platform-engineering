---
title: "Score maintainers span four employers, and the sandbox application names Humanitec as sponsoring company"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Score governance and lineage]
tags: [score, humanitec, governance, maintainers, lineage]
---

# Score maintainers span four employers, and the sandbox application names Humanitec as sponsoring company

## Observation

The `MAINTAINERS.md` file in `score-spec/spec` lists Ben Meier (Oracle), Chris Stephenson (Independent), Mathieu Benoit (Docker), and Susa Tünker (Checkly), and none is tagged Humanitec (read 2026-11-26). The spec repository is Apache-2.0 and has a `GOVERNANCE.md` that defines maintainer promotion criteria. The Score sandbox application (https://github.com/cncf/sandbox/issues/79, 2024-01-17) lists two humanitec.com contact addresses and describes the Platform Orchestrator as "a SaaS product of the sponsoring company Humanitec", adding that Score can be used entirely independently of Humanitec. [[sources/research-gap-o6-platform-landscape]]

## What it settles

The lineage claim the wiki carried from the project's site is now partly primary: Humanitec is named as the sponsoring company in the application text. No document read says in words that Humanitec created Score, so the exact claim "created by Humanitec" stays unverified. The spec describes itself as a way to "describe your workload's configuration in a vendor-neutral way". The spec releases slowly (0.4.1 on 2026-05-25, 0.4.0 on 2026-04-17, 0.3.0 on 2025-04-14, 0.2.0 on 2025-01-17), while the implementations release often (score-k8s 0.23.0 and score-compose 0.50.0, both on 2026-11-14). [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/score]], [[findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes]], [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]]
