terraform {
  required_version = "~> 1.0.3"
  required_providers {
    google     = "~> 3.78"
    kubernetes = "~> 2.4.1"
    helm       = "~> 2.2.0"
    random     = "~> 3.1.0"
  }
}
