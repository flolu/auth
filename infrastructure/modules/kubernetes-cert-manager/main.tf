locals {
  name      = "cert-manager"
  namespace = "cert-manager"
}

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
