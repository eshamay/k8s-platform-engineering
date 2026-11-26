---
title: "The Red Hat Developer Hub operator deploys Backstage on Kubernetes and OpenShift"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [rhdh-operator]
tags: [backstage, operators, red-hat, openshift, packaging]
---

# The Red Hat Developer Hub operator deploys Backstage on Kubernetes and OpenShift

## Scenario

A team wants Backstage itself to run as a managed workload instead of a hand-built deployment. The repository https://github.com/redhat-developer/rhdh-operator describes itself as an "Operator for Deploying Red Hat Developer Hub (Backstage) on Kubernetes and OpenShift". The dossier verified this from the repository description only and did not read the operator's custom resources or code. [[sources/research-gap-m7-operators-idempotency]]

## Reading

This is the operator pattern applied to Backstage as the workload, and it is separate from the Backstage Kubernetes plugin, which reads other operators' custom resources. The two relationships point in opposite directions: an operator manages Backstage, and Backstage displays what operators manage. The Backstage project's own documents do not describe this relationship, so the packaging operator is a Red Hat product and not a Backstage feature. See [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]]. [[sources/research-gap-m7-operators-idempotency]]

## Related

[[entities/backstage]], [[concepts/operator-pattern]], [[examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects]]
