---
title: "Research dossier: gap cluster o6-platform-landscape"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [radius, score, kratix, backstage, tofu-controller, terraform-operator, crossplane, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: gap cluster o6-platform-landscape

> [!NOTE]
> **Raw file:** `raw/research-gap-o6-platform-landscape.md` (sha256 prefix caa824f6fb9e)<br>
> **Kind:** Verified research dossier for gap cluster o6-platform-landscape, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Radius, Score, Kratix, Backstage, tofu-controller, Terraform Operator, and Crossplane comparison pages<br>
> **Caveat:** Evidence is mostly primary repository text, the CNCF landscape file, CNCF sandbox issues, and the Kratix and Backstage documentation. Radius and Score documentation sites, the Kratix scheduler source, and the Backstage writing-templates and builtin-actions pages were not read.

## Summary

The dossier covers five gaps. Four are settled mostly from primary sources. Radius (accepted 2024-04-16) and Score (accepted 2024-07-08) are both CNCF Sandbox projects according to the CNCF landscape file and passed sandbox votes. All four Radius maintainers are Microsoft employees, and only the newest minor channel (0.62, v0.62.0 on 2026-10-27) is supported. Score's maintainers span Oracle, an independent, Docker, and Checkly, and its sandbox application calls Humanitec the "sponsoring company", though no primary text says Humanitec created Score.

Kratix Destinations are cluster-scoped records of a system Kratix can write documents to, paired with a GitStateStore or BucketStateStore. Scheduling is label matching in two stages, with random selection among several matching Destinations and a documented precedence order. The `insecure` field of the GitStateStore Go type defaults to true when unset. Backstage's Kubernetes feature is label-driven and read-oriented, the Scaffolder is a one-shot task runner, and the nearest operator-style integration is a third-party TeraSky plugin. tofu-controller is actively released (v0.17.0 on 2026-11-16) while the GalleyBytes Terraform Operator has had no release since v0.17.1 on 2024-05-17.

The fifth gap, neutral comparisons of Crossplane with Terraform and single-cloud operators, is only weakly answered: the readable material is vendor, consultancy, or lab writing, and one 2022 consultancy post is the most independent. The verification pass removed nothing and corrected the Score sponsorship wording.

## Key claims

Radius and Score
- Radius is CNCF Sandbox, accepted 2024-04-16, and Score is CNCF Sandbox, accepted 2024-07-08, per the CNCF landscape file. VERIFIED.
- The Radius (issue 65) and Score (issue 79) sandbox issues carry `gitvote/passed` labels. VERIFIED.
- Radius's four maintainers are Microsoft employees, and the sandbox application contacts used microsoft.com addresses. VERIFIED.
- Radius's main-repository GOVERNANCE.md contains only a code-of-conduct pointer. VERIFIED.
- Radius v0.62.0 was published 2026-10-27, only channel 0.62 is supported, and the changelog lists breaking changes such as removal of legacy Azure Container Instances support. VERIFIED.
- Score maintainers are listed as Oracle, Independent, Docker, and Checkly employees. VERIFIED.
- The Score sandbox application lists humanitec.com contacts and calls Humanitec the "sponsoring company". VERIFIED. An explicit statement that Humanitec created Score is UNVERIFIED.
- Score spec releases are 0.4.1 (2026-05-25), 0.4.0 (2026-04-17), 0.3.0 (2025-04-14), and 0.2.0 (2025-01-17); score-k8s 0.23.0 and score-compose 0.50.0 were released 2026-11-14. VERIFIED.
- Score describes itself as a way to "describe your workload's configuration in a vendor-neutral way". VERIFIED.

Kratix
- A Destination is a "representation of a system that Kratix can write documents to", reconciled by an external tool. VERIFIED.
- Destination defaults are `strictMatchLabels` false, `filepath.mode` `nestedByMetadata`, and `cleanup` none, and `filepath.mode` is immutable after creation. VERIFIED.
- Kratix writes `dependencies` and `resources` directories under the destination path, and in `none` mode writes `.kratix` state files. VERIFIED.
- State store kinds are GitStateStore and BucketStateStore. GitStateStore auth methods are `basicAuth` (default), `ssh`, and `githubApp`, the branch defaults to main, and the commit author name defaults to `kratix`. VERIFIED.
- The GitStateStore Go type says `insecure` "Defaults to true when unset." VERIFIED.
- Scheduling happens in two stages, multiple matches are resolved by random selection by default, and precedence runs Promise selectors, Promise workflow, then Resource workflow. VERIFIED.
- The scheduler and work-creator source code was not read. UNVERIFIED.

Backstage
- Entities link to cluster objects by the `backstage.io/kubernetes-id` label or a label selector, and the selector takes precedence. VERIFIED.
- Custom resources must be configured, with `customResources` defaulting to an empty array, and a proxy option exists. VERIFIED.
- The Scaffolder loads code skeletons, templates variables, and publishes, and each run is a unique task. VERIFIED.
- Backstage is CNCF incubating. VERIFIED.
- The TeraSky Kubernetes Ingestor auto-ingests Crossplane claims and kro instances as catalog components, and the plugin set targets Backstage 1.56.0. SECONDARY-ONLY (community plugin README).
- Any Backstage document describing an operator pattern, and any built-in Scaffolder action that creates Kubernetes custom resources, are UNVERIFIED.

Crossplane versus Terraform and single-cloud operators
- Crossplane is a CNCF graduated project. VERIFIED.
- A 2022 SuperOrbital post says Crossplane has no equivalent of `terraform plan` and that recreate-forcing field changes may be ignored while the provider reports in sync. SECONDARY-ONLY.
- A Spacelift article (a vendor selling Terraform orchestration) says Terraform has the larger ecosystem and gentler learning curve. SECONDARY-ONLY, VENDOR.
- A 2021 VSHN post says Terraform is a CLI and Crossplane a control plane, and that cloud operators are specific to their cloud. SECONDARY-ONLY (Crossplane-friendly integrator).
- Independent benchmarks, named adopter migration post-mortems, and a primary-document comparison of Config Connector, ACK, and Azure Service Operator against Crossplane are UNVERIFIED.

tofu-controller and Terraform Operator
- tofu-controller lives at flux-iac, is not archived, was last pushed 2026-11-25, and was previously known as Weave TF-Controller. VERIFIED.
- Releases are v0.17.0 (2026-11-16), v0.16.6 (2026-10-26), v0.16.5 (2026-08-06), and v0.16.4 (2026-06-08), and v0.17.0 removes the v1alpha1 API. VERIFIED.
- The MAINTAINERS file lists five active maintainers and three emeritus ones, two of them former Weaveworks. VERIFIED.
- The GalleyBytes Terraform Operator (formerly isaaguilar) is not archived, its latest release is v0.17.1 (2024-05-17), its last commit is 2025-12-09, and one author wrote 196 of about 206 commits. VERIFIED.
- A Terraform Operator deprecation notice is UNVERIFIED.

## Open questions the dossier leaves

Whether Humanitec created Score, what Radius and Score documentation sites say they do, how the Kratix scheduler is implemented, whether any Backstage Scaffolder action creates custom resources, whether independent Crossplane versus Terraform evidence exists, and whether the Terraform Operator is deprecated.

## Pages touched

New pages are [findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes](../findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes.md), [findings/all-four-radius-maintainers-are-microsoft-employees-and-only-the-newest-minor-channel-is-supported](../findings/all-four-radius-maintainers-are-microsoft-employees-and-only-the-newest-minor-channel-is-supported.md), [findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company](../findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company.md), [findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match](../findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match.md), [findings/the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type](../findings/the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type.md), [findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable](../findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable.md), [findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin](../findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin.md), [findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api](../findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api.md), [findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer](../findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer.md), [findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated](../findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated.md), [examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog](../examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog.md), [examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16](../examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16.md), [examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel](../examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel.md), [examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane](../examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane.md), and [decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane](../decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane.md).

Touched pages are [entities/radius](../entities/radius.md), [entities/score](../entities/score.md), [entities/kratix](../entities/kratix.md), [entities/backstage](../entities/backstage.md), [entities/tofu-controller](../entities/tofu-controller.md), [entities/terraform-operator](../entities/terraform-operator.md), [findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog](../findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog.md), [findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern](../findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern.md), [comparisons/score-versus-radius-as-developer-facing-workload-abstractions](../comparisons/score-versus-radius-as-developer-facing-workload-abstractions.md), [comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers](../comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers.md), [comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply](../comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply.md), [comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso](../comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso.md), [comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers](../comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers.md), [examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations](../examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations.md), and [examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator](../examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator.md).

## Related

[open-knowledge-gaps](../open-knowledge-gaps.md), [concepts/tooling-landscape](../concepts/tooling-landscape.md)
