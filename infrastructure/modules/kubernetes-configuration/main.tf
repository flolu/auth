resource "kubernetes_secret" "k8s_config" {
  metadata {
    name = "application-config"
  }

  data = {
    NODE_ENV = var.environment

    BASE_DOMAIN          = var.base_domain
    API_URL              = var.api_url
    CLIENT_URL           = var.client_url
    REALTIME_SERVICE_URL = var.realtime_service_url

    MONGODB_DATABASE = var.mongodb_database
    MONGODB_URL      = var.mongodb_url
    MONGODB_USER     = var.mongodb_user
    MONGODB_PASSWORD = var.mongodb_password

    REFRESH_TOKEN_SECRET = var.refresh_token_secret
    ACCESS_TOKEN_SECRET  = var.access_token_secret
    INTERNAL_SECRET      = var.internal_secret
  }
}
