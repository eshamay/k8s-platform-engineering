---
title: The Crossplane XR circuit breaker default is burst 100 in v2.5.0 source while the v2.1.0 notes say burst 50
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [crossplane, circuit-breaker, scaling, version-difference, defaults]
---

# The Crossplane XR circuit breaker default is burst 100 in v2.5.0 source while the v2.1.0 notes say burst 50

## Observation

The v2.1.0 release notes describe the composite resource circuit breaker as tripping when thresholds are exceeded at "50 burst, 1 every 2s sustained", admitting one request every 30 seconds while open, with a five-minute open period. The v2.5.0 source in `cmd/crossplane/core/core.go` sets `CircuitBreakerBurst` to 100, `CircuitBreakerRefillRate` to 1.0 per second, and `CircuitBreakerCooldown` to 5 minutes. The token bucket capacity doubled and the sustained refill rate doubled. [[sources/research-gap-b1-recheck-kro-crossplane]] URL: https://github.com/crossplane/crossplane/blob/v2.5.0/cmd/crossplane/core/core.go

The dossier did not trace the release in which the default changed and found no design one-pager for the breaker, so the date of the change is unknown. It also did not check whether the 30-second probe interval from the v2.1.0 notes still holds.

## Why it matters

A runbook or alert threshold copied from the v2.1.0 notes understates the burst a v2.5.0 control plane tolerates before it stops reconciling a runaway XR. The two documents are both primary sources for their own version, so neither is wrong, and the defaults are version-specific.

## Mitigations

Quote the Crossplane version with any breaker number, and read the flag defaults from the running version's source or `--help`. See [[entities/crossplane]], [[concepts/scale-and-sharding]], and [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]].
