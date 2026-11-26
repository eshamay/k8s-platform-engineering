---
title: "Crossplane provider families let operators install only the cloud services they use"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider, provider-family, crd-scaling]
---

# Crossplane provider families let operators install only the cloud services they use

## Scenario

A platform team on Amazon Web Services wants Crossplane to manage S3 buckets and RDS databases but nothing else. The original provider-aws was a single monolith that registered a CRD for every AWS service it supported, and the Crossplane blog reports that this passed 900 CRDs and could leave the API server unresponsive, sometimes for up to an hour during scale-up. [[sources/research-provider]]

## How it works

Crossplane split the monolith into scoped providers that are grouped into a family. An operator installs only the member providers for the services in use, for example one for S3 and one for RDS, and the members share a common configuration provider so credentials are defined once. The authors chose this design because it needed no new concept for users, gave fewer CRDs by default, and let existing users migrate from the monolith. The blog also says the approach depended on upstream Kubernetes improvements and ecosystem adoption. [[sources/research-provider]]

## Lesson

The unit of installation decides how many CRDs the API server must hold, so provider packaging is a scaling control and not only a convenience. The same pressure produced a second Crossplane control in version 2, which is activating only the managed resource types a cluster needs, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]. The failure mode itself is described in [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], and ACK avoided it by shipping one controller per service from the start, see [[comparisons/provider-families-versus-per-service-controllers]]. The tool is [[entities/crossplane]] and the concept is [[concepts/provider]].
