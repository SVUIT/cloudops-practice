
# Lấy thông tin của subscription đang hoạt động mà bạn đã chọn bằng `az login`
data "azurerm_subscription" "current" {}

# Create a resource group to hold the Action Group for notifications.
# It's good practice to keep monitoring resources together.
resource "azurerm_resource_group" "monitoring_rg" {
  name     = var.resource_group_name
  location = var.location
}

# Create the Action Group that contains the list of emails to notify.
resource "azurerm_monitor_action_group" "team_notification_group" {
  name                = "ag-team-budget-alerts"
  resource_group_name = azurerm_resource_group.monitoring_rg.name
  short_name          = "BudgetAlerts"

  # Add an email receiver for each address in the contact_emails variable.
  dynamic "email_receiver" {
      for_each = var.contact_emails
      content {
        name                    = email_receiver.key
        email_address           = email_receiver.value
        use_common_alert_schema = true
      }
    }
}

# Create the subscription-level budget and the alert rules.
resource "azurerm_consumption_budget_subscription" "five_week_budget" {
  name            = var.budget_name
  subscription_id = data.azurerm_subscription.current.id
  amount          = 100 # The total budget amount in USD ($100)
  time_grain      = "Annually" # Use 'Custom' for a specific start/end date range

  time_period {
    # The budget will run from the start date for 5 weeks.
    start_date = "${var.start_date}T00:00:00Z"
    end_date = "${var.end_date}T00:00:00Z"
  }

  # --- Alert Rule 1: Warning at 50% ---
  notification {
    enabled        = true
    operator       = "GreaterThanOrEqualTo"
    threshold      = 50.0 # Percentage
    threshold_type = "Actual" # Trigger based on actual spend, not forecasted spend

    # A list of Action Group IDs to trigger. We link our group here.
    contact_groups = [azurerm_monitor_action_group.team_notification_group.id]
  }

  # --- Alert Rule 2: Critical at 70% ---
  notification {
    enabled        = true
    operator       = "GreaterThanOrEqualTo"
    threshold      = 70.0 # Percentage
    threshold_type = "Actual"

    contact_groups = [azurerm_monitor_action_group.team_notification_group.id]
  }
}