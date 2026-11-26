---
title: No primary postmortem was found for a CRD deletion cascade or an etcd quota alarm
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [source-quality, evidence, postmortem, etcd, crd]
---

# No primary postmortem was found for a CRD deletion cascade or an etcd quota alarm

## Observation

A targeted search on 2026-11-26 found no primary-source write-up of a CRD deletion cascade or an etcd quota alarm (NOSPACE) outage from 2019 to 2026. The only etcd hit was a CNCF blog of 2026-03-12, a tooling article that says the storage quota "defaults to 2GiB" and describes no incident. That figure was SECONDARY-ONLY here, and a later pass verified it against the etcd v3.6 docs: "The default storage size limit is 2 GiB, configurable with `--quota-backend-bytes` flag." The blog is still not an incident report ([[sources/research-gap-b1-unverified-claims]]). The result is UNVERIFIED as an absence, because the search tool returned empty result sets for many queries, and nothing here shows that no such postmortem exists. The closest primary evidence for the third requested type, a controller storm, is [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]]. [[sources/research-gap-g1-outage-postmortems]]

## What it changes

The data-loss mechanism in [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]] and the etcd limits in [[findings/etcd-scale-limits-of-the-shared-store]] still rest on documentation and explainers. Treat any statement that these caused a named outage as unsupported until a primary report is found. See also [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]].
