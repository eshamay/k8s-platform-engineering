---
title: "The Flux concepts page five-minute sentence replaced one minute in an August 2022 docs commit with no stated reason"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [origin of the Flux five-minute wording]
tags: [flux, interval, documentation-history, defaults, provenance, verified]
---

# The Flux concepts page five-minute sentence replaced one minute in an August 2022 docs commit with no stated reason

## Observation

The Flux concepts page says "The reconciliation runs every five minutes by default, but this can be changed with `.spec.interval`." That sentence was not always there. In fluxcd/website, `content/en/docs/concepts.md` read "The reconciliation runs every one minute by default" at commit f691a9a0 on 2022-02-01. Commit 962bf6f9 on 2022-08-10 by Stefan Prodan, titled "Add OCIRepository docs", changed it to "every five minutes by default". The file moved to `content/en/flux/concepts.md` on 2022-08-30, and the sentence is unchanged on the current main branch (line 90, read 2026-11-26). [[sources/research-gap-b1-recheck-flux-k8s]] https://github.com/fluxcd/website/commit/962bf6f9

## What is not known

The commit message body carries only a sign-off, and the dossier found no issue or pull request that explains the change. The searches covered the commit message, the commit patch, website code search for "every five minutes", and the controller docs. The reason for the edit is therefore unknown, and the wiki should not guess one. A mention in the jitter package source of "requeue every 5 minutes" as a worked example is a possible source of the figure, but that link is the dossier's own inference and is unverified.

## What it means for readers

The change was a documentation edit made in a commit about another topic, and it did not accompany any controller change that the dossier found. The Kustomization reference still says `.spec.interval` "is a required field" and that "The minimum value should be 60 seconds", so the concepts sentence describes no controller default. The earlier question of where the five-minute wording came from is answered as far as the evidence goes: it is a 2022 docs edit that replaced a one-minute statement. See [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[entities/flux]].

## Related

[[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[findings/drift-detection-latency-is-the-interval]]
