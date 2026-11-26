---
title: "kpt and Kustomize run functions without containers only through opt-in exec extensions that both docs discourage"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [krm-functions, kpt, kustomize, exec, security]
---

# kpt and Kustomize run functions without containers only through opt-in exec extensions that both docs discourage

## Observation

Two tools were verified to run KRM functions without a container, and both do it through non-spec exec extensions behind flags. kpt runs `exec` functions only with `--allow-exec`, and its documentation (kpt book chapter 4, main branch, read 2026-11-26) says functions "must run with `--allow-exec` option to allow running function binaries" and warns "Executing binaries is not secure, since they can perform privileged operations in the system." Kustomize runs exec KRM functions with `--enable-alpha-plugins --enable-exec`, and its exec guide (last modified 2025-08-24) says "Kustomize does not provide an execution sandbox of any kind" and "Plugins intended for reuse should be containerized." The Kustomize containerized guide (last modified 2021-10-30) calls the container style "the recommended style of plugin, but you should be aware that it is still in alpha." [[sources/research-gap-o7-krm-functions]]

## What it is not

The dossier read nothing on WebAssembly or other in-process function runtimes in the kpt and Kustomize pages and ran no dedicated search elsewhere, so absence of such runtimes is not established. It also did not examine Argo CD, Flux, or Helm inflation, so the earlier claim about those tools is unchanged, see [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]]. [[sources/research-gap-o7-krm-functions]]

URLs: https://github.com/kptdev/kpt/blob/main/documentation/content/en/book/04-using-functions/_index.md, https://kubectl.docs.kubernetes.io/guides/extending_kustomize/exec_krm_functions/, https://kubectl.docs.kubernetes.io/guides/extending_kustomize/containerized_krm_functions/

## Related

[[entities/kpt]], [[entities/kustomize]], [[decisions/run-a-krm-function-as-a-container-or-as-an-exec-binary]], [[examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec]]
