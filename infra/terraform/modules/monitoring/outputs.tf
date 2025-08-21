output "aks_diagnostics_id" {
  description = "ID of the AKS diagnostic setting"
  value       = azurerm_monitor_diagnostic_setting.aks_diagnostics.id
}

output "node_not_ready_alert_id" {
  description = "ID of the metric alert for node not ready"
  value       = azurerm_monitor_metric_alert.node_not_ready.id
}