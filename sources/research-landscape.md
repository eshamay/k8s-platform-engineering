---
title: "Research dossier: Tooling landscape"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [landscape, argo-cd, flux, crossplane, config-connector, ack, cluster-api, backstage, kratix, research-dossier]
---

# Research dossier: Tooling landscape

> [!NOTE]
> **Raw file:** `raw/research-landscape.md` (sha256 prefix d28204a90545)<br>
> **Kind:** Research dossier summarizing 17 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several pages were read through a summarizing fetch tool, and the dossier did not cover kubernetes.io, KEPs, kro, postmortems, or conference talks. Vendor sources (Akuity, Port, Syntasso) promote their own tools, so their comparative framing is treated as a claim and not as a measurement.

## Summary

The dossier maps the Kubernetes platform-tooling landscape into three layers that are easy to conflate. Delivery tools (Argo CD and Flux) move desired state from Git, OCI, or Helm into a cluster and keep it there. Provisioning controllers (Config Connector, ACK, Azure Service Operator v2, Crossplane, tofu-controller, Terraform Operator, and Cluster API) turn custom resources into calls against a cloud or infrastructure API. Platform and portal tools (Backstage, Port, Kratix, and Cozystack) define the user-facing surface, whether that is a catalog, an orchestration framework behind a portal, or a whole packaged PaaS.

The sources mostly agree on the layering and differ on where one tool ends and another begins. The dossier's own advice for tutorial writers is that delivery tools move manifests, provisioning controllers reconcile external resources, and platform frameworks define the user-facing API, and that most production stacks combine one tool from each layer. The wiki generalizes that advice in [[concepts/tooling-landscape]].

Evidence is mostly official documentation, one self-reported adopters registry, one single-author practitioner blog, and three vendor sources. The dossier found no independent benchmarks for the footprint or portal claims.

## Key claims

### Delivery layer

- "Argo CD runs in nearly 60% of Kubernetes clusters according to the 2025 Argo CD End User Survey." Akuity contrasts Argo CD as an integrated platform (API server, repo server, controller, built-in UI) with Flux as a modular toolkit. Argo CD is easier to onboard many teams onto and uses AppProjects for per-tenant RBAC. Flux uses native Kubernetes RBAC with a lockdown mode, has a lower and more predictable footprint, and suits air-gapped setups. Argo CD pairs with Kargo for promotion, while Flux relies on CI or Flagger, and Flux's official UI comes from the Flux Operator. The author sells Argo CD, so the framing is biased (https://akuity.io/blog/argo-cd-flux-comparison). See [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]] and [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]].
- "composable APIs, reusable Go packages for GitOps". Flux's source controllers fetch from Git, OCI, Helm repositories, and buckets, the kustomize and helm controllers apply, the notification controller handles alerts and webhooks, and image automation controllers write new tags back to Git. Each controller owns a CRD and communicates through the API server and object status (https://fluxcd.io/flux/components/). See [[entities/flux]].
- "The application controller continuously monitors running applications and compares the current, live state against the desired target state." The API server serves gRPC and REST for the UI, CLI, CI, RBAC, and webhooks, and the repository server caches repositories and renders manifests. The excerpt did not cover ApplicationSet or app-of-apps (https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/). See [[entities/argo-cd]].

### Provisioning layer

- "Crossplane lets you build control planes to manage your cloud native software." Providers package managed resources, Compositions run function pipelines in YAML, Python, Go, or KCL, XRDs define the new API, and Operations run function pipelines to completion for tasks such as certificate checks. The page positions Crossplane against Kubebuilder, where you write the controller, and against cloud CLIs, which are not declarative (https://docs.crossplane.io/latest/whats-crossplane/). See [[entities/crossplane]].
- The Crossplane adopters list is self-reported and unverified. It names Nike and Consensys running an internal developer platform, SAP reporting 100 or more KRM-based control planes as of February 2024, Deutsche Bahn (DB Systel) running a developer experience platform with fully GitOps infrastructure, Stone Payments provisioning AWS, Azure, Confluent Cloud, MongoDB Atlas, and Kong, RTL Nederland provisioning whole Kubernetes clusters on Azure and AWS, and Akamai's provider-ceph described as handling up to 200,000 managed resources (https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md). See [[examples/rtl-nederland-provisions-whole-kubernetes-clusters-with-crossplane-which-overlaps-with-cluster-api]] and [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]].
- "Config Connector reconciles the configured state against Google Cloud APIs asynchronously". The controller acts with its own IAM service account and not the user's identity, which centralizes authorization and decouples developer permissions from cloud resource rights. Namespaced and cluster modes exist, but the fetched text did not detail them or deletion policies (https://docs.cloud.google.com/config-connector/docs/overview). See [[entities/config-connector]] and [[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]].
- Config Connector does not order resource creation by dependency the way Terraform's graph does, and with Argo CD deletion has no ordering, so children can end in DeleteFailed after the parent is removed. The author's workaround is Argo CD sync waves for creation plus a CronJob that patches finalizers on orphans. This is a single-author account read through a brief extraction (https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1). See [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]].
- "AWS Controllers for Kubernetes (ACK) lets you define and use AWS service resources directly from Kubernetes." ACK ships one controller image per AWS service, published in ECR Public, supports adopting existing AWS resources, exports field values to ConfigMaps or Secrets, and manages resources across accounts from one cluster (https://aws-controllers-k8s.github.io/community/docs/community/overview/). See [[entities/ack]] and [[examples/single-cloud-teams-pick-ack-per-service-or-azure-service-operator-v2-with-code-generated-crds]].
- Azure Service Operator v2 generates its CRDs from Azure Resource Manager schemas, so coverage tracks Azure quickly (150 or more resources reported). It follows Kubernetes conventions such as owner references and asynchronous reconciliation, and it supports workload identity, multi-tenant deployment modes, and reduced-permission setups (https://azure.github.io/azure-service-operator/). See [[entities/azure-service-operator]].
- "in Cluster API you can use custom resources like KubeadmControlPlane to manage control plane Machines." A management cluster runs Cluster API and providers to manage workload clusters. Infrastructure providers create machines and networks, bootstrap providers produce node init data (typically cloud-init), and control-plane providers manage the control plane. The core kinds are Cluster, Machine, MachineSet, MachineDeployment, and MachineHealthCheck, and the dossier calls the Deployment-to-Pod analogy the best hook for newcomers (https://cluster-api.sigs.k8s.io/user/concepts). See [[entities/cluster-api]].
- "The controller detects and fixes drift for your infrastructures, based on the Terraform resources and their TFSTATE." tofu-controller reconciles a Terraform CRD, runs plan and apply in runner pods, stores state as Kubernetes Secrets, and detects drift by default. Manual approval puts the plan ID in `.spec.approvePlan` through Git. Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x, and Branch Planner was in technology preview (https://flux-iac.github.io/tofu-controller/). See [[entities/tofu-controller]] and [[findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions]].
- "A controller that configures and starts Terraform Workflows when it sees changes to the Kubernetes manifest". Terraform Operator starts workflow pods when the manifest changes, is configured through environment variables, ConfigMaps, Secrets, and ServiceAccounts, and is explicitly not an HCL-to-YAML converter, so you still write Terraform (https://github.com/isaaguilar/terraform-operator). See [[entities/terraform-operator]] and [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]].

### Platform and portal layer

- "Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly." Backstage is a CNCF incubating developer portal framework from Spotify, with a software catalog, software templates (the scaffolder), TechDocs, and a plugin ecosystem. It is a UI and metadata layer and not a provisioner, so real provisioning happens in whatever the templates call (https://backstage.io/docs/overview/what-is-backstage). See [[entities/backstage]].
- Port models the catalog as blueprints and entities, adds self-service actions, and integrates with Kubernetes, Argo CD, GitHub, and cloud providers. The page positions Port against Backstage as more automation and AI-agent oriented, which the dossier calls marketing framing (https://docs.port.io/getting-started/overview). See [[entities/port]].
- "Kratix lets you offer everything as-a-service via clear APIs, which can easily be exposed through developer portals like Backstage." A Promise is a contract between platform and application teams made of a self-service API, embedded workflows, and fleet management, and pipelines combine provisioning, deployment, and compliance steps. Destination and GitStateStore concepts were not in the fetched excerpt (https://docs.kratix.io/). See [[entities/kratix]].
- Syntasso argues that a portal gives only visibility, so developers still wait on tickets, and that Kratix adds Promises and workflows behind the portal. Its example scatters workloads across a standard cluster, a PCI DSS cluster, and a Terraform destination, and it claims progressive disclosure limits cognitive load. NatWest, The Access Group, and Veeam are mentioned as case studies by link only and were not read (https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform). See [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]] and [[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]].
- "Free PaaS platform and framework for building clouds". Cozystack turns commodity servers into a cloud offering Kubernetes clusters, databases, and VMs through an API, built on Talos Linux, Kubernetes, KubeVirt, LINSTOR and DRBD, and Kube-OVN (https://cozystack.io/docs/). See [[entities/cozystack]] and [[examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms]].

### Use-case and pitfall synthesis

- The dossier's typical splits are Argo CD or Flux delivering Config Connector resources from Git for Google Cloud shops, ACK per service for AWS-only teams, ASO v2 with workload identity for Azure-only teams, Cluster API for fleets, tofu-controller or Terraform Operator for large Terraform estates, and Kratix for multi-cluster segmentation including PCI clusters. See [[examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls]] and [[examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator]].
- Flux handles ordering through `dependsOn` between Kustomizations, but the dossier says that detail comes from general knowledge and not from a fetched source. The wiki's own Flux pages cover it from other dossiers. See [[examples/flux-dependson-and-health-checks-gate-rollout]].
- ASO generates CRDs from ARM schemas to keep up with Azure, while ACK splits controllers per service so install scope stays small but each service has its own release cadence.

## Cross-source synthesis

The three-layer view in [[concepts/tooling-landscape]] is the main product of this dossier. Two cross-cutting problems recur. Ordering is missing in per-resource controllers and has to be supplied by a delivery tool or a composition layer ([[findings/ordering-and-dependency-failures]]), and identity concentrates in the controller, so access to the custom resource is access to the cloud. The layer comparisons are in [[comparisons/delivery-versus-provisioning-versus-platform-layers-in-the-kubernetes-tooling-landscape]] and [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]].

## Discrepancies and open questions

- The Akuity, Port, and Syntasso sources are positioned by vendor interest, so the Argo CD footprint claim and the "portal is not enough" claim have no independent counterweight. See [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]].
- The dossier's own open questions are Config Connector namespaced versus cluster mode and deletion policy behavior, Kratix Destination and GitStateStore mechanics, the maintenance state of Terraform Operator and tofu-controller after Weaveworks' wind-down, and a direct Config Connector versus Crossplane comparison. They are drafted as gaps in [[open-knowledge-gaps]].
- The dossier did not cover kro, Kubernetes API machinery docs, KEPs, postmortems, or conference talks. Other dossiers in this wiki cover kro and API machinery.
