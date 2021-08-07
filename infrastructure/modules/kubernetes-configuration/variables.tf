variable "environment" { type = string }

variable "base_domain" { type = string }
variable "api_url" { type = string }
variable "client_url" { type = string }
variable "realtime_service_url" { type = string }

variable "mongodb_database" { type = string }
variable "mongodb_url" { type = string }
variable "mongodb_user" { type = string }
variable "mongodb_password" { type = string }

variable "internal_secret" { type = string }
variable "refresh_token_secret" { type = string }
variable "access_token_secret" { type = string }

variable "github_client_id" { type = string }
variable "github_client_secret" { type = string }

# just a placeholder to tell terraform that this module depends on
# the kubernetes module
variable "kubernetes_endpoint" {
  type = string
}
