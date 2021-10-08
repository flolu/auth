<div align="center">
  <a href="https://github.com/flolu/auth">
    <img width="80px" height="auto" src="./.github/keys.png" />
  </a>
  <br>
  <h1>Fullstack Authentication</h1>
  <p>Access/Refresh Token Authentication Demo with Node.js And Typescript</p>
  <a href="https://youtu.be/xMsJPnjiRAc">
    <img width="320px" height="180px" src="https://img.youtube.com/vi/xMsJPnjiRAc/mqdefault.jpg" style="border-radius: 1rem;" />
    <p>Watch the YouTube Tutorial</p>
  </a>
</div>

# Stack

**Backend**: Node.js, Typescript, MongoDB, Kubernetes

**Frontend**: Next.js, Typescript

**DevOps**: Docker, Terraform, Kubernetes, Google Cloud

# Usage

**Recommended OS**: Ubuntu 20.04 LTS

**Requirements**: Docker, Docker Compose, Yarn, Node.js

**Optional**: Terraform, Google Cloud SDK

**Setup**

- `make setup`
- Create GitHub OAuth app [here](https://github.com/settings/developers)
  - Set "Homepage URL" to `http://localhost:3000`
  - Set "Authorization callback URL" to `http://localhost:3000/github`
  - Set `GITHUB_CLIENT_ID` in [`.env.development`](.env.development)
  - Set `NEXT_PUBLIC_GITHUB_CLIENT_ID` in [`client/.env.development`](client/.env.development)
  - "Generate a new client secret"
  - Set `GITHUB_CLIENT_SECRET` in [`.env.development`](.env.development)

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
5. Insert secrets into Google Cloud [Secret Manager](https://console.cloud.google.com/security/secret-manager)
   - GitHub OAuth (create [here](https://github.com/settings/developers))
     - Set "Authorization callback URL" to `https://api.${DOMAIN}/github`
     - `github_client_id`
     - `github_client_secret`
   - Secrets (generate [here](https://randomkeygen.com))
     - `refresh_token_secret`
     - `access_token_secret`
   - MongoDB Atlas (create a free cluster [here](https://www.mongodb.com/cloud/atlas))
     - Navigate to Project Settings -> Access Manager -> API Keys -> Create API Key -> Select Project Owner
     - `mongodbatlas_public_key`
     - `mongodbatlas_private_key`
     - `atlas_project_id` (found under Settings)
6. Add `0.0.0.0/0` to your MongoDB Atlas project "IP Access List" (Under Network Access)
7. Enable [Container Registry](https://cloud.google.com/container-registry) in your GCP console
8. `make init-infrastructure`
9. `make deploy`
10. Go to Google Cloud DNS, `main-zone`, copy the `NS` record to your domain registrar
11. Uncomment code block in [infrastructure/modules/kubernetes-cert-manager/main.tf](infrastructure/modules/kubernetes-cert-manager/main.tf) and run `make apply`
12. The app should be live at `https://${DOMAIN}`

- Every time you want to deploy changes, just run `make deploy`

# Credits

<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
