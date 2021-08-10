locals {
  database = "db"
}

resource "mongodbatlas_cluster" "cluster" {
  project_id                   = var.atlas_project_id
  name                         = "cluster"
  disk_size_gb                 = "2"
  provider_backup_enabled      = false
  provider_name                = "TENANT"
  backing_provider_name        = "AWS"
  provider_region_name         = "EU_CENTRAL_1"
  provider_instance_size_name  = "M2"
  auto_scaling_disk_gb_enabled = false
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "mongodbatlas_database_user" "user" {
  username           = "cluster-user"
  password           = random_password.password.result
  project_id         = var.atlas_project_id
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = local.database
  }
}
