<div align="center">
  <a href="https://github.com/flolu/auth">
    <img width="80px" height="auto" src="./.github/lock.svg" />
  </a>
  <br>
  <h1>Auth Demo</h1>
  <p>Demo for Access/Refresh Token Authentication</p>
</div>

# Tutorial

Coming soon

# Features

- Client side authentication
- Server side authentication
- Websocket authentication
- Silent token refresh

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

1. Create a [Google Cloud project](https://console.cloud.google.com)
2. Sign into your project `gcloud auth application-default login`
3. Insert the project id into [`Makefile`](Makefile) (`GCP_PROJECT=<your_project_id>`)
4. Set `TF_BUCKET_URI` in [`Makefile`](Makefile) to a unique Google Cloud Storage bucket name
5. Create the bucket for storing Terraform state (`make create-terraform-bucket`)
6. Insert secrets into Google Cloud Secret Manager
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
7. Add `0.0.0.0/0` to your MongoDB project "IP Access List"
8. Set `DOMAIN` in [`Makefile`](Makefile) to your domain
9. `make deploy`
10. Go to Google Cloud DNS, `main-zone`, copy the `NS` record to your domain registrar
11. The app should be live at `https://${DOMAIN}`
