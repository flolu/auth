terraform {
  backend "gcs" {
    bucket = "flolu-auth-demo-test-terraform-state"
    prefix = "prod"
  }
}

module "kubernetes" {
  source       = "./modules/google-kubernetes-engine"
  project      = var.google_cloud_project
  region       = "europe-west3-a"
  machine_type = "e2-small"
}

module "cert_manager" {
  source              = "./modules/kubernetes-cert-manager"
  kubernetes_endpoint = module.kubernetes.endpoint
}

module "ingress" {
  source              = "./modules/kubernetes-nginx-ingress"
  domain              = var.domain
  kubernetes_endpoint = module.kubernetes.endpoint
}

module "dns" {
  source = "./modules/domain-name-system"
  ip     = module.ingress.ip
  domain = var.domain
}

module "mongodb" {
  source                   = "./modules/mongodb-atlas"
  atlas_project_id         = var.atlas_project_id
  mongodbatlas_public_key  = var.mongodbatlas_public_key
  mongodbatlas_private_key = var.mongodbatlas_private_key
}

module "configuration" {
  source = "./modules/kubernetes-configuration"

  environment = var.environment

  base_domain          = var.domain
  client_url           = var.client_url
  api_url              = var.api_url
  realtime_service_url = var.realtime_url

  mongodb_database = module.mongodb.database
  mongodb_url      = module.mongodb.url
  mongodb_user     = module.mongodb.user
  mongodb_password = module.mongodb.password

  internal_secret      = var.internal_secret
  refresh_token_secret = var.refresh_token_secret
  access_token_secret  = var.access_token_secret

  github_client_id     = var.github_client_id
  github_client_secret = var.github_client_secret

  kubernetes_endpoint = module.kubernetes.endpoint
}

module "api" {
  source      = "./modules/api-service"
  image       = var.api_image
  config_name = module.configuration.name
}

module "realtime" {
  source      = "./modules/realtime-service"
  image       = var.realtime_image
  config_name = module.configuration.name
}

module "client" {
  source              = "./modules/client"
  image               = var.client_image
  environment         = var.environment
  api_url             = var.api_url
  github_client_id    = var.github_client_id
  github_redirect_url = var.github_redirect_url
  realtime_url        = var.realtime_url
  domain              = var.domain
  internal_secret     = var.internal_secret
}
