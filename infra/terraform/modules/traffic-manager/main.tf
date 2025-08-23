resource "azurerm_traffic_manager_profile" "tm_profile" {
  name                   = var.profile_name
  resource_group_name    = var.resource_group_name
  traffic_routing_method = var.traffic_routing_method
  dns_config {
    relative_name = var.dns_relative_name
    ttl           = var.dns_ttl
  }
  monitor_config {
    protocol = var.monitor_protocol
    port     = var.monitor_port
    path     = var.monitor_path
  }
  tags = var.tags
}

resource "azurerm_traffic_manager_external_endpoint" "endpoints" {
  for_each          = { for ep in var.endpoints : ep.name => ep }
  name              = each.value.name
  profile_id        = azurerm_traffic_manager_profile.tm_profile.id
  target            = each.value.target
  endpoint_location = each.value.location
  priority          = each.value.priority
}