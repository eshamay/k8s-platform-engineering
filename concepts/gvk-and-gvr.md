---
title: GVK and GVR (Group, Version, Kind and Resource)
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [GVK, GVR, Group Version Kind]
tags: [api-machinery]
---

# GVK and GVR (Group, Version, Kind and Resource)

## Definition

The coordinate system Kubernetes uses to identify an API schema. A GVK (Group, Version, Kind) refers to the schema or Go struct, for example group and version `s3.aws.upbound.io/v1beta1` with `Kind=Bucket`. A GVR (Group, Version, Resource) refers to the HTTP REST endpoint path, for example `buckets`. [[sources/krm-platform-vocabulary]]

## Why it matters

Clients, controllers, and RBAC rules all address objects through these coordinates. Mapping a Kind to its resource name is a routine task for generic tooling, and it is why [[concepts/custom-resource-definition]] declares both names.

## Related

[[concepts/provider]], [[concepts/managed-resource]], [[concepts/informers-reflectors-and-workqueues]]

## To research

REST mapping, API discovery, version conversion between served versions, and deprecation handling.
