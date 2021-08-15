# Development

setup:
	cp --no-clobber .env.template .env.development
	cp --no-clobber client/.env.template client/.env.development
	yarn install
	cd client && yarn install

.PHONY: client
client:
	cd client && yarn next

backend:
	docker-compose -f docker-compose.yaml up --build

# Deployment

GCP_PROJECT=flolu-auth-demo
TF_BUCKET=flolu-auth-demo-terraform-state
DOMAIN=auth.flolu.de
EMAIL=flo@drakery.com
GKE_ZONE=europe-west3-a

define get-secret
$(shell gcloud secrets versions access latest --secret=$(1) --project=$(GCP_PROJECT))
endef

TF_BUCKET_URI=gs://${TF_BUCKET}
GKE_CLUSTER=cluster
K8S_CONTEXT=gke_${GCP_PROJECT}_${GKE_ZONE}_${GKE_CLUSTER}
IMAGE_REPO=gcr.io/${GCP_PROJECT}
CLIENT_URL=https://${DOMAIN}
API_URL=https://api.${DOMAIN}
REALTIME_URL=wss://realtime.${DOMAIN}
GITHUB_CLIENT_ID=$(call get-secret,github_client_id)
GITHUB_REDIRECT_URL=${API_URL}/github

build-client-env:
	@echo "\
	NEXT_PUBLIC_ENVIRONMENT=production\n\
	NEXT_PUBLIC_API_URL=${API_URL}\n\
	NEXT_PUBLIC_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}\n\
	NEXT_PUBLIC_GITHUB_REDIRECT_URL=${GITHUB_REDIRECT_URL}\n\
	NEXT_PUBLIC_REALTIME_URL=${REALTIME_URL}\n\
	BASE_DOMAIN=${DOMAIN}\n\
	" > client/.env.production

client-image: build-client-env
	docker build -f client/Dockerfile -t ${IMAGE_REPO}/client .
	docker push ${IMAGE_REPO}/client

api-image:
	docker build -f api/Dockerfile -t ${IMAGE_REPO}/api:latest .
	docker push ${IMAGE_REPO}/api:latest

realtime-image:
	docker build -f realtime/Dockerfile -t ${IMAGE_REPO}/realtime:latest .
	docker push ${IMAGE_REPO}/realtime:latest

setup-kubectl:
	gcloud container clusters get-credentials ${GKE_CLUSTER} --zone ${GKE_ZONE} --project ${GCP_PROJECT}

setup-infrastructure: create-terraform-bucket init-infrastructure create-terraform-workspaces

create-terraform-bucket:
	gsutil ls -b ${TF_BUCKET_URI} || gsutil mb -p ${GCP_PROJECT} -l EUROPE-WEST3 ${TF_BUCKET_URI}
	gsutil versioning set on ${TF_BUCKET_URI}

init-infrastructure:
	cd infrastructure && terraform init

connect-kubernetes:
	gcloud container clusters get-credentials cluster --zone ${GKE_ZONE} --project ${GCP_PROJECT}

GET_IMAGE_SHA=docker inspect --format='{{index .RepoDigests 0}}'

terraform-action:
	@cd infrastructure && \
	terraform ${TF_ACTION} \
	\
	-var="email=${EMAIL}" \
	-var="google_cloud_project=${GCP_PROJECT}" \
	\
	-var="mongodbatlas_public_key=$(call get-secret,mongodbatlas_public_key)" \
	-var="mongodbatlas_private_key=$(call get-secret,mongodbatlas_private_key)" \
	-var="atlas_project_id=$(call get-secret,atlas_project_id)" \
	\
	-var="refresh_token_secret=$(call get-secret,refresh_token_secret)" \
	-var="access_token_secret=$(call get-secret,access_token_secret)" \
	\
	-var="github_client_id=${GITHUB_CLIENT_ID}" \
	-var="github_client_secret=$(call get-secret,github_client_secret)" \
	\
	-var="domain=${DOMAIN}" \
	-var="api_url=${API_URL}" \
	-var="client_url=${CLIENT_URL}" \
	-var="realtime_url=${REALTIME_URL}" \
	-var="github_redirect_url=${GITHUB_REDIRECT_URL}" \
	\
	-var="client_image=$(shell $(GET_IMAGE_SHA) $(IMAGE_REPO)/client)" \
	-var="realtime_image=$(shell $(GET_IMAGE_SHA) $(IMAGE_REPO)/realtime)" \
	-var="api_image=$(shell $(GET_IMAGE_SHA) $(IMAGE_REPO)/api)" \
	\
	-var="gke_zone=${GKE_ZONE}"

plan:
	$(MAKE) TF_ACTION=plan terraform-action

apply:
	$(MAKE) TF_ACTION=apply terraform-action

destroy:
	$(MAKE) TF_ACTION=destroy terraform-action

deploy: client-image api-image realtime-image apply

