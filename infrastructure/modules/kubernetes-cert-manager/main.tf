locals {
  name      = "cert-manager"
  namespace = "cert-manager"
}

# TODO upgrade to 1.4.3
resource "helm_release" "cert_manager" {
  name             = local.name
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "1.2.0"
  force_update     = true
  cleanup_on_fail  = true
  namespace        = local.namespace
  create_namespace = true

  set {
    name  = "installCRDs"
    value = true
  }
}

resource "kubernetes_manifest" "cluster_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1alpha2"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt"
    }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = "flo@drakery.com"
        privateKeySecretRef = {
          name = "letsencrypt-private-key"
        }
        solvers = [{
          http01 = {
            ingress = {
              class = "nginx"
            }
          }
        }]
      }
    }
  }
}
