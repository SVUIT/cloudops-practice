output "action_group_id" {
  value       = azurerm_monitor_action_group.alerts.id
  description = "Action group resource ID"
}

output "budget_id" {
  value       = azurerm_consumption_budget_subscription.budget.id
  description = "Budget resource ID"
}