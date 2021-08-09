<div align="center">
  <a href="https://github.com/flolu/auth">
    <img width="80px" height="auto" src="./.github/lock.svg" />
  </a>
  <br>
  <h1>Auth Demo</h1>
  <p>Demo for Access/Refresh Token Authentication</p>
</div>

# Tutorial

<!-- TODO insert YouTube tutorial -->

Coming soon

<!-- TODO GIF of demo -->

# Stack

**Backend**: Node.js, Typescript, MongoDB, Kubernetes

**Frontend**: Next.js, Typescript

# Usage

**Recommended OS**: Ubuntu 20.04 LTS

**Requirements**: Docker, Docker Compose, Yarn, Node.js

**Optional**: Terraform, Google Cloud SDK

**Setup**

- `make setup`
- Configure secrets in [`.env.development`](.env.development) and [`client/.env.development`](client/.env.development)
- Configure variables in [`Makefile`](Makefile)

**Development**

- `make client` (Start Next.js development server, http://localhost:3000)
- `make backend` (Start development backend services)

# Codebase

**Services**

- [`client`](client) **Next.js client** (web application)
- [`api`](api) **Node.js server** (http api)
- [`realtime`](realtime) **Node.js server** (websocket server)
- [`shared`](shared) **Typescript lib** (shared code)
- [`infrastructure`](infrastructure) **Terraform** (configurations to deploy application in the cloud)

# Deployment

**Commands**

- `make init-infrastructure` (Initialize Terraform)
- `make apply` (Apply cloud resources, ~15 minutes)
- `make deploy` (Build and deploy services to Kubernetes cluster)
- `make destroy` (Destroy cloud resources)
- `make client-image` (Build and push client Docker image)
- `make api-image` (Build and push api Docker image)
- `make realtime-image` (Build and push Docker image)

**Step by step guide**

1. Configure variables in [`Makefile`](Makefile)
   - `GCP_PROJECT` You can create a project [here](https://console.cloud.google.com)
   - `TF_BUCKET` Choose a unique bucket name for Terraform state
   - `EMAIL` Only used for generating SSL certificates
   - `GKE_ZONE` Choose a region or zone from [this list](https://cloud.google.com/compute/docs/regions-zones) for your Kubernetes cluster
   - `DOMAIN`
2. Sign into your project `gcloud auth application-default login`
3. Create the bucket for storing Terraform state (`make create-terraform-bucket`)
4. Set `terraform.backend.bucket` in [infrastructure/main.tf](infrastructure/main.tf) to `TF_BUCKET`
5. Insert secrets into Google Cloud Secret Manager
   - GitHub OAuth (create [here](https://github.com/settings/developers))
     - `github_client_id`
     - `github_client_secret`
   - Secrets (generate [here](https://randomkeygen.com))
     - `internal_secret`
     - `refresh_token_secret`
     - `access_token_secret`
   - MongoDB Atlas (create a free cluster [here](https://www.mongodb.com/cloud/atlas))
     - `mongodbatlas_public_key`
     - `mongodbatlas_private_key`
     - `atlas_project_id`
6. Add `0.0.0.0/0` to your MongoDB Atlas project "IP Access List"
7. `make deploy`
8. Go to Google Cloud DNS, `main-zone`, copy the `NS` record to your domain registrar
9. The app should be live at `https://${DOMAIN}`
