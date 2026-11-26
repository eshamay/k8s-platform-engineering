# Research dossier: Tooling landscape

Research date: 2026-11-25

## Overview

The Kubernetes platform-tooling landscape splits into a few layers that are easy to conflate. The first layer is delivery: tools that get desired state from Git, OCI or Helm into a cluster and keep it there. Argo CD and Flux are the two CNCF projects here. Both run reconcile loops, but Argo CD ships as an integrated application with an API server, repo server, controller and UI. Flux ships as a toolkit of small independent controllers (source, kustomize, helm, notification, image automation) that expose composable CRDs.

The second layer is resource provisioning: controllers that turn Kubernetes custom resources into calls against a cloud or infrastructure API. Config Connector (Google Cloud), AWS Controllers for Kubernetes (ACK) and Azure Service Operator v2 (ASO) are single-vendor, one-CRD-per-cloud-resource controllers. Crossplane is multi-cloud and adds Compositions and XRDs, so a platform team can publish its own API without writing a controller. Terraform controllers (Flux tofu-controller, Terraform Operator) wrap existing Terraform code in a CRD and run plan/apply in pods. Cluster API applies the same idea to Kubernetes clusters: a management cluster reconciles Cluster and Machine objects into workload clusters via infrastructure, bootstrap and control-plane providers.

The third layer is the platform and portal. Backstage (CNCF incubating, from Spotify) and Port are catalogs and portals with self-service actions. Kratix is an orchestration framework that sits behind a portal: a "Promise" packages an API, workflows and fleet scheduling. Cozystack is a distinct kind of thing: an opinionated, packaged PaaS on Talos, Kubernetes, KubeVirt and similar parts, for building a cloud on bare metal.

The sources mostly agree on this layering. They differ on where one tool ends and another begins. Vendor sources (Syntasso, Port, Akuity) push their own tool as the missing piece. For tutorial writers, the useful frame is: delivery tools move manifests, provisioning controllers reconcile external resources, and platform frameworks define the user-facing API. Most production stacks combine one tool from each layer.

Caveat on method: pages were read through the fetch tools, and several summaries come from the fetch tool's extraction rather than full raw text. Direct kubernetes.io and KEP material was not covered in this pass.

## Sources

### 1. Argo CD vs Flux (Akuity)
- URL: https://akuity.io/blog/argo-cd-flux-comparison
- Title: Argo CD vs Flux: Comparing GitOps Tools
- Publisher: Akuity (commercial Argo CD vendor)
- Kind: vendor engineering blog
- Summary: Contrasts Argo CD as an integrated platform (API server, repo server, controller, built-in UI) with Flux as a modular toolkit of controllers. Argo CD is easier to onboard many teams onto and uses AppProjects for per-tenant RBAC. Flux uses native Kubernetes RBAC with a lockdown mode, has a lower and more predictable footprint, and suits air-gapped setups. Argo CD pairs with Kargo for promotion; Flux relies on CI or Flagger. Flux's official UI comes from the Flux Operator. The author is a vendor of Argo, so treat the framing as biased.
- Quote: "Argo CD runs in nearly 60% of Kubernetes clusters according to the 2025 Argo CD End User Survey."

### 2. Flux components
- URL: https://fluxcd.io/flux/components/
- Title: Flux GitOps Toolkit components
- Publisher: Flux project (CNCF)
- Kind: official documentation
- Summary: Lists the controllers: source controllers fetch from Git, OCI, Helm repositories and buckets; kustomize and helm controllers apply; notification controller handles alerts and webhooks; image automation controllers write new image tags back to Git. The point for newcomers is that each controller owns a CRD and communicates through the API server and object status, which is the standard controller pattern.
- Quote: "composable APIs, reusable Go packages for GitOps"

### 3. Argo CD architecture
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/
- Title: Architectural Overview
- Publisher: Argo project (CNCF)
- Kind: official documentation
- Summary: Describes the API server (gRPC/REST for UI, CLI, CI, RBAC, webhooks), the repository server (caches repos and renders manifests from URL, revision, path and template settings) and the application controller (compares live to desired state, detects drift, runs hooks). The excerpt did not cover ApplicationSet or app-of-apps.
- Quote: "The application controller continuously monitors running applications and compares the current, live state against the desired target state."

### 4. Crossplane overview
- URL: https://docs.crossplane.io/latest/whats-crossplane/
- Title: What is Crossplane?
- Publisher: Crossplane project (CNCF)
- Kind: official documentation
- Summary: Crossplane is a control-plane framework. Providers package managed resources (for example an AWS RDS instance). Compositions run function pipelines (YAML, Python, Go, KCL) and XRDs define the new API, so teams get custom resources without writing controllers. Operations run function pipelines to completion for tasks like certificate checks. Positioned against Kubebuilder (you write the controller) and cloud CLIs (not declarative).
- Quote: "Crossplane lets you build control planes to manage your cloud native software."

### 5. Crossplane adopters list
- URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md
- Title: Crossplane ADOPTERS.md
- Publisher: Crossplane project
- Kind: community adopter registry (self-reported)
- Summary: Names production users and how they use it. Examples: Nike and Consensys run an internal developer platform on it; SAP reported 100+ KRM-based control planes as of February 2024; Deutsche Bahn (DB Systel) runs a developer experience platform with fully GitOps infrastructure; Stone Payments provisions AWS, Azure, Confluent Cloud, MongoDB Atlas and Kong; RTL Nederland provisions whole Kubernetes clusters on Azure and AWS; Akamai's provider-ceph is described as handling up to 200k managed resources. Useful for the use-case section; entries are self-reported and not verified.

### 6. Config Connector overview
- URL: https://docs.cloud.google.com/config-connector/docs/overview
- Title: Config Connector overview
- Publisher: Google Cloud
- Kind: official documentation
- Summary: CRDs and controllers reconcile Google Cloud resources asynchronously. The controller acts with its own IAM service account, not the user's identity, which centralizes authorization and decouples developer permissions from cloud resource rights. Namespaced and cluster modes exist; the fetched text did not detail them or deletion policies.
- Quote: "Config Connector reconciles the configured state against Google Cloud APIs asynchronously"

### 7. Navigating Config Connector challenges
- URL: https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1
- Title: Navigating Config Connector Challenges
- Publisher: Micha Marszalek (Medium)
- Kind: practitioner blog
- Summary: Reports that Config Connector does not order resource creation by dependency the way Terraform's graph does. With Argo CD, deletion has no ordering, so children can end in DeleteFailed after the parent is removed. The author's workaround is Argo CD sync waves for creation plus a CronJob that patches finalizers on orphans. Single-author account; fetch tool extraction was brief.

### 8. AWS Controllers for Kubernetes
- URL: https://aws-controllers-k8s.github.io/community/docs/community/overview/
- Title: ACK overview
- Publisher: AWS Controllers for Kubernetes community
- Kind: official documentation
- Summary: Ships one controller image per AWS service (for example an S3 controller), published in ECR Public, so you install only what you need. Supports adopting existing AWS resources, exporting field values to ConfigMaps or Secrets, and managing resources across accounts from one cluster.
- Quote: "AWS Controllers for Kubernetes (ACK) lets you define and use AWS service resources directly from Kubernetes."

### 9. Azure Service Operator v2
- URL: https://azure.github.io/azure-service-operator/
- Title: Azure Service Operator
- Publisher: Microsoft / Azure
- Kind: official documentation
- Summary: CRDs are code-generated from Azure Resource Manager schemas, so coverage tracks Azure quickly (150+ resources reported). Follows Kubernetes conventions such as owner references for garbage collection and asynchronous reconciliation. Supports workload identity, multi-tenant deployment modes and reduced-permission setups.

### 10. Cluster API concepts
- URL: https://cluster-api.sigs.k8s.io/user/concepts
- Title: Concepts - The Cluster API Book
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: official project documentation
- Summary: A management cluster runs Cluster API and providers to manage workload clusters. Infrastructure providers create machines and networks, bootstrap providers produce node init data (typically cloud-init), control-plane providers manage the control plane. Core kinds: Cluster, Machine, MachineSet, MachineDeployment, MachineHealthCheck. The Deployment-to-Pod analogy is the best hook for newcomers.
- Quote: "in Cluster API you can use custom resources like KubeadmControlPlane to manage control plane Machines."

### 11. tofu-controller
- URL: https://flux-iac.github.io/tofu-controller/
- Title: Tofu Controller
- Publisher: flux-iac community
- Kind: project documentation
- Summary: A Flux-family controller that reconciles a Terraform CRD. It runs plan and apply in runner pods, stores state as Kubernetes Secrets, and does drift detection by default. Manual approval is done by putting the plan ID in .spec.approvePlan via Git. Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x, which shows how version-coupled it is. Branch Planner was in technology preview.
- Quote: "The controller detects and fixes drift for your infrastructures, based on the Terraform resources and their TFSTATE."

### 12. Terraform Operator
- URL: https://github.com/isaaguilar/terraform-operator
- Title: terraform-operator
- Publisher: isaaguilar (community)
- Kind: open-source repository README
- Summary: A CRD whose controller starts Terraform workflow pods when the manifest changes, with configuration through env vars, ConfigMaps, Secrets and ServiceAccounts. Explicitly not an HCL-to-YAML converter: you still write Terraform.
- Quote: "A controller that configures and starts Terraform Workflows when it sees changes to the Kubernetes manifest"

### 13. Backstage overview
- URL: https://backstage.io/docs/overview/what-is-backstage
- Title: What is Backstage?
- Publisher: Backstage / Spotify (CNCF incubating)
- Kind: official documentation
- Summary: A developer portal framework with a software catalog, software templates (scaffolder), TechDocs and a plugin ecosystem. It is a UI and metadata layer, not a provisioner; real provisioning happens in whatever the templates call.
- Quote: "Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly."

### 14. Port overview
- URL: https://docs.port.io/getting-started/overview
- Title: Port getting started
- Publisher: Port (commercial SaaS)
- Kind: vendor documentation
- Summary: Models the catalog as blueprints and entities, adds self-service actions, and integrates with Kubernetes, Argo CD, GitHub and cloud providers. The page positions Port against Backstage as more automation- and AI-agent-oriented; this is marketing framing.

### 15. Kratix docs
- URL: https://docs.kratix.io/
- Title: Kratix documentation
- Publisher: Syntasso
- Kind: official documentation
- Summary: A Promise is a contract between platform and application teams: a self-service API, embedded workflows and fleet management. Pipelines combine provisioning, deployments and compliance steps. Destination and GitStateStore concepts were not in the fetched excerpt.
- Quote: "Kratix lets you offer everything as-a-service via clear APIs, which can easily be exposed through developer portals like Backstage."

### 16. Kratix + Backstage
- URL: https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform
- Title: Kratix + Backstage: Upgrade Your Portal to a Platform
- Publisher: Syntasso (Kratix vendor)
- Kind: vendor blog
- Summary: Argues a portal only gives visibility, so developers still wait on tickets. Kratix adds Promises and workflows behind the portal. An example scatters workloads across a standard cluster, a PCI DSS cluster and a Terraform destination using Destinations. Claims progressive disclosure to limit cognitive load. Mentions NatWest, The Access Group and Veeam as case studies (links only, not read).

### 17. Cozystack
- URL: https://cozystack.io/docs/
- Title: Cozystack documentation
- Publisher: Cozystack project
- Kind: official documentation
- Summary: A free PaaS framework that turns commodity servers into a cloud offering Kubernetes clusters, databases and VMs through an API. Built on Talos Linux, Kubernetes, KubeVirt, LINSTOR/DRBD and Kube-OVN. Targets organizations building their own cloud or cheap dev environments.
- Quote: "Free PaaS platform and framework for building clouds"

## Real-world use cases

Crossplane adopters at Nike, Consensys, SAP, Deutsche Bahn, Stone Payments and RTL Nederland use it as the backbone of an internal developer platform, mostly offering teams a simplified API over cloud resources while platform teams manage compositions (https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md). RTL Nederland's use of provisioning full Kubernetes clusters shows the overlap with Cluster API.

A typical split for Google Cloud shops is Argo CD or Flux delivering Config Connector resources from Git, with the controller's own IAM identity doing the cloud calls (https://docs.cloud.google.com/config-connector/docs/overview, https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1). AWS-only teams use ACK per service and can adopt pre-existing resources or work across accounts (https://aws-controllers-k8s.github.io/community/docs/community/overview/). Azure-only teams use ASO v2 with workload identity (https://azure.github.io/azure-service-operator/).

Cluster API fits fleets: a management cluster creates and heals workload clusters on clouds or bare metal (https://cluster-api.sigs.k8s.io/user/concepts). Cozystack applies it for on-premise cloud building (https://cozystack.io/docs/). Teams with big existing Terraform estates use tofu-controller or Terraform Operator to run Terraform inside the cluster under GitOps (https://flux-iac.github.io/tofu-controller/). Financial-services style multi-cluster segmentation, including PCI clusters, is Syntasso's Kratix example (https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform). Backstage originated at Spotify as a catalog and portal (https://backstage.io/docs/overview/what-is-backstage).

## Pitfalls and how tools address them

Dependency ordering. Per-cloud-resource controllers such as Config Connector do not build a Terraform-style dependency graph, and deletion ordering is absent under Argo CD. The cited workaround is sync waves plus finalizer cleanup (Medium source). Crossplane Compositions and Kratix workflows centralize ordering in one abstraction, though the sources do not describe their failure behavior in detail. Flux handles ordering through dependsOn between Kustomizations; that detail is from general knowledge, not a fetched source here.

Identity and blast radius. Config Connector acts with its own service account, so whoever can create a CR effectively gets that service account's rights. Namespaced mode and ASO's multi-tenant and reduced-permission modes exist to scope this (Config Connector and ASO sources). Argo CD uses AppProjects, Flux uses Kubernetes RBAC and lockdown mode (Akuity).

Terraform in a cluster. State lives in Secrets for tofu-controller, plans need explicit approval through Git, and versions are coupled to specific Terraform and Flux releases (tofu-controller). Terraform Operator does not remove the need to write Terraform (Terraform Operator README).

Portal-only platforms. Backstage gives visibility but not provisioning, so ticket queues persist (Syntasso, a vendor claim). Pair it with a provisioning layer.

Coverage and drift. ASO generates CRDs from ARM schemas to keep up with Azure; ACK splits controllers per service so install scope stays small but each service has its own release cadence.

Footprint. Argo CD has a heavier footprint than Flux (Akuity, vendor view).

## Tutorial and explainer links

- https://cluster-api.sigs.k8s.io/user/concepts : best short mental model of management versus workload clusters.
- https://fluxcd.io/flux/components/ : the controller-per-concern pattern in one page.
- https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/ : the three Argo CD components.
- https://docs.crossplane.io/latest/whats-crossplane/ : XRDs, Compositions and functions.
- https://akuity.io/blog/argo-cd-flux-comparison : Argo CD versus Flux trade-offs.
- https://backstage.io/docs/overview/what-is-backstage : portal concepts.
- https://flux-iac.github.io/tofu-controller/ : Terraform under GitOps.
- https://aws-controllers-k8s.github.io/community/docs/community/overview/ : ACK basics.

## Open questions

- Several fetch-tool summaries were short extractions; detailed Config Connector namespaced versus cluster mode behavior and deletion policies were not confirmed.
- Kratix Destination and GitStateStore mechanics were not retrieved; the InfraCloud Kratix article redirected away and kubernetesguru.com and ppluuums.com were unreachable.
- Comparative claims (Argo CD footprint, "Port beyond Backstage", "portal is not enough") come from vendors and conflict in emphasis; independent benchmarks were not found.
- Tool status for Terraform Operator (last release, maintenance level) and tofu-controller after Weaveworks' wind-down was not checked in detail.
- Not covered: kro, Kubernetes API machinery docs, KEPs, postmortems, and conference talks. A later pass should add these.
- The wiki search for a direct Config Connector vs Crossplane comparison returned no useful results.
