---
title: kro issue 1171 a fault-injection tool found that a controller crash mid-deletion leaves the instance finalizer and children
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [kro issue 1171]
tags: [kro, deletion, finalizer, fault-injection, kamera]
---

# kro issue 1171 a fault-injection tool found that a controller crash mid-deletion leaves the instance finalizer and children

## Scenario

On 2026-03-19 the fault-injection tool kamera filed kro issue 1171 against kro v0.8.4. It crashes the controller during an instance deletion and checks what is left. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/kubernetes-sigs/kro/issues/1171

## What it reports

After the crash the instance keeps its finalizer and its children stay alive, because the controller "doesn't checkpoint progress". The reporter also says the CRD was deleted despite `allowCRDDeletion=false`.

## Status and limits

This is a test-tool finding, not a production incident. On 2026-11-26 the issue was open, with triage-bot comments and two reporter comments, and no maintainer confirmed it. kro v0.10.0 (2026-11-10) lists graph-cleanup fixes, but the dossier did not link them to this issue.

## Related

[[findings/a-kro-controller-crash-during-instance-deletion-can-leave-the-finalizer-and-children-according-to-a-fault-injection-report]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]], [[entities/kro]]
