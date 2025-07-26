output "cluster_id" {
  description = "The ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.default.id
}

output "cluster_name" {
  description = "The name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.default.name
}

output "cluster_fqdn" {
  description = "The FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.default.fqdn
}

output "kube_config" {
  description = "Kubernetes configuration"
  value       = azurerm_kubernetes_cluster.default.kube_config_raw
  sensitive   = true
}

output "client_certificate" {
  description = "Base64 encoded public certificate"
  value       = azurerm_kubernetes_cluster.default.kube_config.0.client_certificate
  sensitive   = true
}

output "client_key" {
  description = "Base64 encoded private key"
  value       = azurerm_kubernetes_cluster.default.kube_config.0.client_key
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "Base64 encoded public CA certificate"
  value       = azurerm_kubernetes_cluster.default.kube_config.0.cluster_ca_certificate
  sensitive   = true
}

output "host" {
  description = "The Kubernetes cluster server host"
  value       = azurerm_kubernetes_cluster.default.kube_config.0.host
  sensitive   = true
}

output "identity_principal_id" {
  description = "The principal ID of the system assigned identity"
  value       = azurerm_kubernetes_cluster.default.identity.0.principal_id
}

output "kubelet_identity_object_id" {
  description = "The object ID of the kubelet identity"
  value       = azurerm_kubernetes_cluster.default.kubelet_identity.0.object_id
}
