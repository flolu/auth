resource "kubernetes_deployment" "deployment" {
  metadata {
    name = var.name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = var.name
      }
    }
    template {
      metadata {
        labels = {
          "app" = var.name
        }
      }
      spec {
        container {
          name  = var.name
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
        }
      }
    }
  }
}

resource "kubernetes_service" "service" {
  metadata {
    name = var.name
  }
  spec {
    type = "NodePort"
    selector = {
      app = var.name
    }
    port {
      name        = "http"
      port        = 3000
      target_port = 3000
    }
  }
}
