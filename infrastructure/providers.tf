provider "google" {
  project = var.google_cloud_project
}

provider "kubernetes" {
  host                   = module.kubernetes.endpoint
  cluster_ca_certificate = module.kubernetes.cluster_ca_certificate
  token                  = module.kubernetes.token
}

provider "helm" {
  kubernetes {
    host                   = module.kubernetes.endpoint
    cluster_ca_certificate = module.kubernetes.cluster_ca_certificate
    token                  = module.kubernetes.token
  }
}

provider "random" {}
