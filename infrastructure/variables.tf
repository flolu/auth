variable "environment" {
  type    = string
  default = "prod"
}

variable "domain" {
  type    = string
  default = "auth.flolu.de"
}

variable "mongodbatlas_public_key" { type = string }
variable "mongodbatlas_private_key" { type = string }
variable "atlas_project_id" { type = string }

variable "internal_secret" { type = string }
variable "refresh_token_secret" { type = string }
variable "access_token_secret" { type = string }

variable "google_cloud_project" { type = string }

variable "github_client_id" { type = string }
variable "github_client_secret" { type = string }
