# outputs.tf

output "budget_id" {
  description = "The ID of the subscription budget that was created."
  value       = azurerm_consumption_budget_subscription.five_week_budget.id
}

output "action_group_id" {
  description = "The ID of the Monitor Action Group for notifications."
  value       = azurerm_monitor_action_group.team_notification_group.id
}

output "monitoring_resource_group_name" {
  description = "The name of the resource group holding the monitoring resources."
  value       = azurerm_resource_group.monitoring_rg.name
}

output "notified_emails" {
  description = "The list of emails configured for notifications."
  value       = var.contact_emails
}