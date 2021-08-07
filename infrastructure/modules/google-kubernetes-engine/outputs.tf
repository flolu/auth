output "endpoint" {
  value      = "https://${google_container_cluster.primary.endpoint}"
  depends_on = [google_container_cluster.primary]
}

output "client_certificate" {
  value     = base64decode(join(",", google_container_cluster.primary[*].master_auth[0].client_certificate))
  sensitive = true
}

output "client_key" {
  value     = base64decode(join(",", google_container_cluster.primary[*].master_auth[0].client_key))
  sensitive = true
}

output "cluster_ca_certificate" {
  value     = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
  sensitive = true
}

output "token" {
  value     = data.google_client_config.provider.access_token
  sensitive = true
}
