locals {
  name      = "ingress-nginx"
  namespace = "ingress-nginx"
  chart     = "ingress-nginx"
}

resource "kubernetes_namespace" "ingress_namespace" {
  metadata {
    name = local.namespace
  }
}

resource "helm_release" "nginx_ingress" {
  name            = local.name
  repository      = "https://kubernetes.github.io/ingress-nginx"
  chart           = local.chart
  version         = "3.24.0"
  force_update    = true
  cleanup_on_fail = true
  namespace       = local.namespace

  set {
    name  = "controller.service.externalTrafficPolicy"
    value = "Local"
    type  = "string"
  }

  set {
    name  = "controller.kind"
    value = "DaemonSet"
    type  = "string"
  }

  depends_on = [kubernetes_namespace.ingress_namespace]
}

data "kubernetes_service" "service_ingress" {
  metadata {
    name      = "${local.name}-controller"
    namespace = local.namespace
  }
  depends_on = [helm_release.nginx_ingress]
}

resource "kubernetes_ingress" "ingress" {
  metadata {
    name = "ingress"
    annotations = {
      "kubernetes.io/tls-acme"         = "true"
      "kubernetes.io/ingress.class"    = "nginx"
      "cert-manager.io/cluster-issuer" = "letsencrypt"
    }
  }

  spec {
    tls {
      hosts = [
        var.domain,
        "api.${var.domain}",
        "realtime.${var.domain}"
      ]
      secret_name = "auth-demo-tls"
    }

    rule {
      host = var.domain
      http {
        path {
          backend {
            service_name = "client"
            service_port = 8080
          }
        }
      }
    }

    rule {
      host = "api.${var.domain}"
      http {
        path {
          backend {
            service_name = "api"
            service_port = 3000
          }
        }
      }
    }

    rule {
      host = "realtime.${var.domain}"
      http {
        path {
          backend {
            service_name = "realtime"
            service_port = 3000
          }
        }
      }
    }
  }

  depends_on = [helm_release.nginx_ingress]
}

output "ip" {
  value = kubernetes_ingress.ingress.status.0.load_balancer.0.ingress.0.ip
}
