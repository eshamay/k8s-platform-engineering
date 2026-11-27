---
title: Argo CD app-of-apps out of sync because of argocd-image-updater
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, drift, image-updater, debugging]
---

# Argo CD app-of-apps out of sync because of argocd-image-updater

## Scenario

An Argo CD user reported that an app-of-apps drifted out of sync immediately after syncing, as described in https://github.com/argoproj/argo-cd/issues/14591. The parent application kept showing OutOfSync even though nothing in Git had changed. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Cause

Another automation tool was the second writer. argocd-image-updater rewrote the child Application specs and dropped fields such as `selfHeal`, so the live objects no longer matched Git. The reply in the issue states, "Confirmed this is an issue in `argocd-image-updater`, not `argo-cd`."

## Lesson

"Drift" is often two writers disagreeing, and diagnosing it means finding the second writer. The remedies are to stop one writer from touching the field, or to tell Argo CD to ignore it with `ignoreDifferences`. See [findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), and [entities/argo-cd](../entities/argo-cd.md).
