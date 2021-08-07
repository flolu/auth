output "database" {
  value = local.database
}

output "url" {
  value = mongodbatlas_cluster.cluster.mongo_uri_with_options
}

output "user" {
  value = mongodbatlas_database_user.user.username
}

output "password" {
  value     = mongodbatlas_database_user.user.password
  sensitive = true
}
