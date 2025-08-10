data "azurerm_subscription" "current" {}

resource "azurerm_monitor_action_group" "alerts" {
  name                = var.action_group_name
  resource_group_name = var.resource_group_name
  short_name          = var.action_group_short_name

  dynamic "email_receiver" {
    for_each = var.contact_emails
    content {
      name                    = email_receiver.key
      email_address           = email_receiver.value
      use_common_alert_schema = true
    }
  }
}

resource "azurerm_consumption_budget_subscription" "budget" {
  name            = var.budget_name
  subscription_id = data.azurerm_subscription.current.id
  amount          = var.budget_amount
  time_grain      = var.time_grain

  time_period {
    start_date = "${var.start_date}T00:00:00Z"
    end_date   = "${var.end_date}T00:00:00Z"
  }

  notification {
    enabled        = true
    operator       = "GreaterThanOrEqualTo"
    threshold      = var.warn_threshold
    threshold_type = "Actual"
    contact_groups = [azurerm_monitor_action_group.alerts.id]
  }
  # --- Alert Rule 2: Critical at 70% ---
  notification {
    enabled        = true
    operator       = "GreaterThanOrEqualTo"
    threshold      = var.crit_threshold
    threshold_type = "Actual"
    contact_groups = [azurerm_monitor_action_group.alerts.id]
  }
}