---
title: "Upgrading a Crossplane Function changes every Composition revision that uses functionRef, including Manual pins"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [crossplane, composition-revisions, functions, rollout, pitfall]
---

# Upgrading a Crossplane Function changes every Composition revision that uses functionRef, including Manual pins

## Observation

Function packages get FunctionRevisions managed by the package manager, with one active revision. The Composition revisions documentation says a pipeline step that uses `functionRef` calls whatever version is active, and that upgrading a Function affects every CompositionRevision, "including revisions you've pinned XRs to with the `Manual` update policy." An alpha feature, enabled with `--enable-pipeline-oci-references`, lets a step reference a package by digest in the `function` field. Crossplane then creates external FunctionRevisions owned by the CompositionRevision or Operation, "Multiple external revisions of the same Function can be active at once", and they are listed in the Function's `status.externalRevisionRefs`. [[sources/research-gap-o7-krm-functions]]

A one-pager on controlled rollout of function changes was added in the v1.20.0 notes, and its content was not read. Function response caching is alpha (v1.20.0, 2025-05-21, `--enable-function-response-cache`), and a `credentials` field on pipeline steps arrived in v1.16.0 (2024-05-16). [[sources/research-gap-o7-krm-functions]]

## What it means

Pinning an XR to a Composition revision freezes the pipeline definition but not the function code behind a `functionRef` step. Staged rollout of function changes needs the alpha digest-pinning feature. The wiki's earlier rollout advice should be read with this limit, see [[decisions/choose-automatic-or-manual-composition-update-policy]].

URLs: https://github.com/crossplane/docs/blob/master/content/master/composition/composition-revisions.md, https://github.com/crossplane/docs/blob/master/content/master/packages/functions.md

## Related

[[entities/crossplane]], [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], [[concepts/composition]]
