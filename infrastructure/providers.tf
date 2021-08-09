provider "google" {
  project = var.google_cloud_project
}

provider "kubernetes" {
  host                   = module.kubernetes.endpoint
  cluster_ca_certificate = module.kubernetes.cluster_ca_certificate
  token                  = module.kubernetes.token

  experiments {
    manifest_resource = true
  }
}

provider "helm" {
  kubernetes {
    host                   = module.kubernetes.endpoint
    cluster_ca_certificate = module.kubernetes.cluster_ca_certificate
    token                  = module.kubernetes.token
  }
}

provider "mongodbatlas" {
  public_key  = var.mongodbatlas_public_key
  private_key = var.mongodbatlas_private_key
}

provider "random" {}
