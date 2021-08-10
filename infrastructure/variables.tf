variable "environment" {
  type    = string
  default = "production"
}

variable "email" { type = string }
variable "google_cloud_project" { type = string }

variable "domain" { type = string }
variable "client_url" { type = string }
variable "api_url" { type = string }
variable "realtime_url" { type = string }

variable "mongodbatlas_public_key" { type = string }
variable "mongodbatlas_private_key" { type = string }
variable "atlas_project_id" { type = string }

variable "refresh_token_secret" { type = string }
variable "access_token_secret" { type = string }

variable "github_client_id" { type = string }
variable "github_client_secret" { type = string }
variable "github_redirect_url" { type = string }

variable "client_image" { type = string }
variable "api_image" { type = string }
variable "realtime_image" { type = string }

variable "gke_zone" { type = string }
