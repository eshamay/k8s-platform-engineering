---
title: Flux turns off client-side throttling when APF is enabled but a custom kubeconfig path kept it until 2026
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [fluxcd/pkg PR 270, fluxcd/pkg PR 1118]
tags: [flux, apf, client-side-throttling, retry-after, pkg]
---

# Flux turns off client-side throttling when APF is enabled but a custom kubeconfig path kept it until 2026

## Observation

Flux's June 2022 update says "all Flux controllers conform to the Kubernetes API Priority and Fairness". The change behind it is fluxcd/pkg PR 270 (closed around 2022-05-11), which disables client-side throttling when the server has the APF filter enabled, because "client-go respects the `Retry-After` response header set by the APF filter." In fluxcd/pkg PR 1118 (closed 2026-02-16) the author noticed "client-side ratelimiting messages from the kustomization controller" and fixed a path where a custom kubeconfig still used client-side rate limiting even when APF is supported. [[sources/research-gap-g1-named-adopters]] URLs: https://github.com/fluxcd/pkg/pull/270 and https://github.com/fluxcd/pkg/pull/1118.

## What it shows

The server-side and client-side layers described in [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]] can disagree in a real tool: a controller that believes it conforms to APF can still wait on its own limiter in one configuration. It took about four years to catch the custom-kubeconfig path.

## What was not found

No published incident or postmortem ties Flux or sharded Flux to APF throttling. Searches of the fluxcd GitHub issues for 429, apiserver overload, and flowcontrol terms returned nothing relevant, and a web search found none. That absence is an open question and not evidence that no incident occurred.

## Related

[[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]], [[concepts/scale-and-sharding]], [[entities/flux]]
