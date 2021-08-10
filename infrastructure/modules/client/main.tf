locals {
  config_name = "client-config"
}

resource "kubernetes_secret" "k8s_config" {
  metadata {
    name = local.config_name
  }

  data = {
    NEXT_PUBLIC_ENVIRONMENT         = var.environment
    NEXT_PUBLIC_API_URL             = var.api_url
    NEXT_PUBLIC_GITHUB_CLIENT_ID    = var.github_client_id
    NEXT_PUBLIC_GITHUB_REDIRECT_URL = var.github_redirect_url
    NEXT_PUBLIC_REALTIME_URL        = var.realtime_url
    BASE_DOMAIN                     = var.domain
  }
}


resource "kubernetes_deployment" "client" {
  metadata {
    name = "client"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "client"
      }
    }

    template {
      metadata {
        labels = {
          "app" = "client"
        }
      }

      spec {
        container {
          name  = "client"
          image = var.image

          env_from {
            secret_ref {
              name = local.config_name
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 3000
            }
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 3000
            }
          }

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "50m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "client" {
  metadata {
    name = "client"
  }

  spec {
    type = "NodePort"

    selector = {
      app = "client"
    }

    port {
      name        = "http"
      port        = 3000
      target_port = 3000
    }
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "client" {
  metadata {
    name = "client"
  }

  spec {
    max_replicas = 10
    min_replicas = 2

    scale_target_ref {
      kind = "Deployment"
      name = "client-service"
    }
  }
}
