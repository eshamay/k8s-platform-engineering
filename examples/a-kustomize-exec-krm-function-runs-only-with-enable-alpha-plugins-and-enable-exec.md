---
title: "A Kustomize exec KRM function runs only with enable-alpha-plugins and enable-exec"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [kustomize, krm-functions, exec, alpha]
---

# A Kustomize exec KRM function runs only with enable-alpha-plugins and enable-exec

## Scenario

A team wants a Kustomize generator written as a local binary instead of a container. The Kustomize exec KRM function guide (page last modified 2025-08-24) shows the invocation `$DEMO/bin/kustomize build --enable-alpha-plugins --enable-exec $MYAPP`. Without both flags Kustomize does not run the plugin. [[sources/research-gap-o7-krm-functions]]

## Outcome

The guide states "Kustomize does not provide an execution sandbox of any kind" and "Plugins intended for reuse should be containerized." A containerized function needs only `--enable-alpha-plugins`, declared with a `config.kubernetes.io/function` annotation with a `container.image` key, and both guides carry an alpha warning. The exec path therefore trades the container requirement for no isolation and a portability cost, see [[findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage]].

URL: https://kubectl.docs.kubernetes.io/guides/extending_kustomize/exec_krm_functions/

## Related

[[entities/kustomize]], [[decisions/run-a-krm-function-as-a-container-or-as-an-exec-binary]]
