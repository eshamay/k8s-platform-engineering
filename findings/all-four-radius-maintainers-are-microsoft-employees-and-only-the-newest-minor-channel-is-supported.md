---
title: "All four Radius maintainers are Microsoft employees, and only the newest minor channel is supported"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Radius governance]
tags: [radius, governance, maintainers, release-policy]
---

# All four Radius maintainers are Microsoft employees, and only the newest minor channel is supported

## Observation

The `MAINTAINERS.md` file in `radius-project/community` lists four maintainers, all tagged Microsoft (https://github.com/radius-project/community/blob/main/MAINTAINERS.md, read 2026-11-26), and the Radius sandbox application (https://github.com/cncf/sandbox/issues/65, 2023-10-23) used microsoft.com contact addresses. The main repository's `GOVERNANCE.md` holds only a pointer to the Contributor Covenant Code of Conduct when read. The `versions.yaml` file lists only channel 0.62 as supported, with 0.61, 0.60, 0.59, and 0.58 deprecated. The README says Radius "runs on Kubernetes and deploys applications across local, private cloud, Microsoft Azure, and Amazon Web Services environments". [[sources/research-gap-o6-platform-landscape]]

## Why it matters

A single-employer maintainer group is a governance fact that a CNCF Sandbox listing does not change. A one-channel support policy means that a team on 0.61 is already on a deprecated line. Together with the pre-1.0 version number, these facts back the description of Radius as early, though the wiki does not claim a Bicep dependency or an Azure lean from the dossier: the README names Azure and AWS as targets, and the Bicep claim remains a third-party review's statement. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/radius]], [[findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes]], [[examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel]]
