resource "azurerm_kubernetes_cluster" "default" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name                = "default"
    node_count          = var.node_count
    vm_size             = var.node_vm_size
    min_count           = var.enable_auto_scaling ? var.min_count : null
    max_count           = var.enable_auto_scaling ? var.max_count : null
    max_pods            = var.max_pods
    os_disk_size_gb     = var.os_disk_size_gb
    type                = "VirtualMachineScaleSets"
    vnet_subnet_id      = var.vnet_subnet_id
    
    tags = var.tags
  }

  # Auto assign and manage cluster identity  
  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = var.network_plugin  # "azure"
    network_policy = var.network_policy  # "azure"
  }

  # Enable Azure Policy Add-on
  azure_policy_enabled = true
  
  # Enable HTTP Application Routing (for development)
  http_application_routing_enabled = false
  
  # Enable role-based access control
  role_based_access_control_enabled = true

  tags = var.tags

  lifecycle {
    ignore_changes = [
      default_node_pool[0].node_count
    ]
  }
}
