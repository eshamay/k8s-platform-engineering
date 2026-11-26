---
title: "Crossplane issue 7801 asks how to protect provider credentials during namespace deletion and is open with no maintainer reply"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [crossplane, finalizers, credentials, issue, provider-gitlab, namespace-deletion]
---

# Crossplane issue 7801 asks how to protect provider credentials during namespace deletion and is open with no maintainer reply

## Scenario

Issue [crossplane/crossplane#7801](https://github.com/crossplane/crossplane/issues/7801), "Protect ProviderConfig credentials until managed resources finish deleting", was opened on 2026-09-02 and carries the label `enhancement`. A team deletes a namespace that holds both namespaced managed resources and the credentials Secret that their ProviderConfig reads. The Secret can disappear first, so the managed resources cannot call the cloud API to clean up and stay Terminating. The downstream report is [provider-gitlab issue 429](https://github.com/crossplane-contrib/provider-gitlab/issues/429), "namespace deletion hangs and leaks GitLab resources", which is open. [[sources/research-gap-m1-finalizers]]

## What the thread says

The issue body lists three possible directions, "none of them decided". The first keeps the Secret alive through Usage machinery or a generic dependency-protection controller. The second has providers cache credentials for the deletion. The third orders namespace teardown so ProviderConfigs and Secrets finalize after managed resources. The body notes that the Secret has no finalizer and that design pull request 7594 keeps it out of scope. [[sources/research-gap-m1-finalizers]]

The thread has two comments, and neither author is a maintainer. On 2026-10-14 a commenter reported measurements from provider-gitlab and listed three options: a finalizer on the Secret, which they said "fixed it in our runs", provider-side caching, which worked 9 of 9 times in a prototype but failed after a provider restart, and documenting that managed resources must be deleted before the namespace. They asked "Is (1) still the plan? Happy to test a branch." On 2026-10-28 another user offered to contribute and asked which approach is preferred. No answer is recorded. The measurements are third-party and SECONDARY-ONLY, taken on a specific build, and they are not a Crossplane maintainer result. [[sources/research-gap-m1-finalizers]]

## State on 2026-11-26

The issue is open with no linked fix. The neighboring ProviderConfig protection merged on 2026-09-08 and is described in [[findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected]].

## Related

[[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]], [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]], [[entities/crossplane]]
