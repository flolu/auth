resource "kubernetes_deployment" "api" {
  metadata {
    name = "api"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "api"
      }
    }

    template {
      metadata {
        labels = {
          "app" = "api"
        }
      }

      spec {
        container {
          name  = "api"
          image = "${var.container_regsitry}/api:latest"

          env_from {
            secret_ref {
              name = var.config_name
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
              cpu    = "250m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name = "api"
  }

  spec {
    type = "NodePort"

    selector = {
      app = "api"
    }

    port {
      name        = "http"
      port        = 3000
      target_port = 3000
    }
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "api" {
  metadata {
    name = "api"
  }

  spec {
    max_replicas = 10
    min_replicas = 2

    scale_target_ref {
      kind = "Deployment"
      name = "api-service"
    }
  }
}
