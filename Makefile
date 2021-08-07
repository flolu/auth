GCP_PROJECT=flolu-auth-demo-test
GKE_CLUSTER=cluster
GKE_ZONE=europe-west3-a
TF_BUCKET_URI=gs://flolu-auth-demo-test-terraform-state
K8S_CONTEXT=gke_${GCP_PROJECT}_${GKE_ZONE}_${GKE_CLUSTER}
IMAGE_REPO=eu.gcr.io/${GCP_PROJECT}

# Development

.PHONY: client
client:
	cd client && yarn next

.PHONY: server
server:
	docker-compose -f docker-compose.yaml up --build

# Deployment

api-image:
	docker build -f server/Dockerfile -t ${IMAGE_REPO}/api:latest .
	docker push ${IMAGE_REPO}/api:latest

setup-kubectl:
	gcloud container clusters get-credentials ${GKE_CLUSTER} --zone ${GKE_ZONE} --project ${GCP_PROJECT}

# Infrastructure

setup-kubectl:
	gcloud container clusters get-credentials ${GKE_CLUSTER} --zone ${GKE_ZONE} --project ${GCP_PROJECT}

setup-infrastructure: create-terraform-bucket init-infrastructure create-terraform-workspaces

create-terraform-bucket:
	gsutil ls -b ${TF_BUCKET_URI} || gsutil mb -p ${GCP_PROJECT} -l EUROPE-WEST3 ${TF_BUCKET_URI}
	gsutil versioning set on ${TF_BUCKET_URI}

init-infrastructure:
	cd infrastructure && terraform init

define get-secret
$(shell gcloud secrets versions access latest --secret=$(1) --project=$(GCP_PROJECT))
endef

terraform-action:
	@cd infrastructure && \
	terraform ${TF_ACTION} \
	-var="google_cloud_project=${GCP_PROJECT}" \
	\
	-var="mongodbatlas_public_key=$(call get-secret,mongodbatlas_public_key)" \
	-var="mongodbatlas_private_key=$(call get-secret,mongodbatlas_private_key)" \
	-var="atlas_project_id=$(call get-secret,atlas_project_id)" \
	\
	-var="internal_secret=$(call get-secret,internal_secret)" \
	-var="refresh_token_secret=$(call get-secret,refresh_token_secret)" \
	-var="access_token_secret=$(call get-secret,access_token_secret)" \
	\
	-var="github_client_id=$(call get-secret,github_client_id)" \
	-var="github_client_secret=$(call get-secret,github_client_secret)"

plan:
	$(MAKE) TF_ACTION=plan terraform-action

apply:
	$(MAKE) TF_ACTION=apply terraform-action

destroy:
	$(MAKE) TF_ACTION=destroy terraform-action
