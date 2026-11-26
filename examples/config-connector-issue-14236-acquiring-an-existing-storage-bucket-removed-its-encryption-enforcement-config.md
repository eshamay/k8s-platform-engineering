---
title: Config Connector issue 14236 acquiring an existing storage bucket removed its encryption enforcement config
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [Config Connector issue 14236]
tags: [config-connector, acquisition, storagebucket, csek, adoption]
---

# Config Connector issue 14236 acquiring an existing storage bucket removed its encryption enforcement config

## Scenario

Issue 14236 on the Config Connector repository was opened on 2026-10-21 against v1.117.0. The reporter applied a StorageBucket manifest for a bucket that already existed, so Config Connector acquired it by name. The issue was open when the dossier read it, and maintainers had not confirmed it in the text read. The dossier also notes the report's claim that the behavior is still reproducible against the v1.159.0 CRD. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/14236

## What happened

The reporter says acquisition removed the bucket's CSEK `FullyRestricted` enforcement configuration, because the CRD has no field for it. Undeclared fields should stay externally managed, so this is unexpected. The report states "The encryption enforcement config is removed during acquisition." The author adds that bulk-export does not show the setting either, so a KRM diff would not reveal the change.

## Related reports

Issue 13840 (2026-10-08, closed, resolution not read) shows the opposite failure: a 409 `CONTACT_ALREADY_EXISTS` when the user did not set the server-generated resourceID, so the controller did not acquire by natural key. Issue 12740 (2026-09-03, open) proposes that for server-generated-ID resources Config Connector refuse to re-create a vanished resource and fail terminally.

## Why it belongs here

It is the only dated Config Connector report in the dossier of acquisition changing a live resource, and it feeds [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]]. It adds a real case to [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]].

## Related

[[entities/config-connector]], [[decisions/adopt-or-create-or-require-explicit-import]]
