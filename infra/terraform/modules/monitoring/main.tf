# Diagnostic settings for AKS
resource "azurerm_monitor_diagnostic_setting" "aks_diagnostics" {
  name                       = "${var.cluster_name}-diagnostics"
  target_resource_id         = var.cluster_id
  log_analytics_workspace_id     = var.log_analytics_workspace_id

  dynamic "enabled_log" {
    for_each = [
      "kube-apiserver",
      "kube-controller-manager",
      "kube-scheduler",
      "cluster-autoscaler",
      "cloud-controller-manager",
      "guard",
      "kube-audit",
      "kube-audit-admin"
    ]
    content {
      category = enabled_log.value
    }
  }

  metric {
    category = "AllMetrics"
  }
}

# Metric Alert: Node NotReady
resource "azurerm_monitor_metric_alert" "node_not_ready" {
  name                = "${var.cluster_name}-node-not-ready"
  resource_group_name = var.resource_group_name
  scopes              = [var.cluster_id]
  description         = "Alert when a node is not ready"
  severity            = 1
  window_size         = "PT5M"
  frequency= "PT1M"

  criteria {
    metric_namespace = "microsoft.containerservice/managedclusters"
    metric_name      = "kube_node_status_condition"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = 0
    dimension {
      name     = "condition"
      operator = "Include"
      values   = ["NotReady"]
    }
  }
  # action {
  #  action_group_id = azurerm_monitor_action_group.failover_action.id
  # }
}

