resource "kubernetes_deployment" "realtime" {
  metadata {
    name = "realtime"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "realtime"
      }
    }

    template {
      metadata {
        labels = {
          "app" = "realtime"
        }
      }

      spec {
        container {
          name  = "realtime"
          image = var.image

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
              cpu    = "50m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "realtime" {
  metadata {
    name = "realtime"
  }

  spec {
    type = "NodePort"

    selector = {
      app = "realtime"
    }

    port {
      name        = "http"
      port        = 3000
      target_port = 3000
    }
  }
}
