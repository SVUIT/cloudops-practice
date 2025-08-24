# Data sources for regions
locals {
  regions        = ["southeastasia", "eastasia"]
  primary_region = "southeastasia"
  common_tags = {
    environment = "prod"
    application = "roadmap-maker"
    managed-by  = "terraform"
    project     = "cloudops-practice"
  }
  alert_emails = {
    thanh = "chithanh080804@gmail.com"
    thuan = "thuan.tongg@gmail.com"
    an    = "doanquocan205@gmail.com"
    loc   = "nhloc08@gmail.com"
  }
}

# Resource Groups for each region
module "resource_groups" {
  source = "./modules/resource-group"

  for_each = toset(local.regions)

  name     = "roadmap-maker-${each.value}-rg"
  location = each.value
  tags     = local.common_tags
}

# Primary Network in Southeast Asia
module "primary_network" {
  source = "./modules/network"

  vnet_name           = "roadmap-maker-primary-vnet"
  location            = local.primary_region
  resource_group_name = module.resource_groups[local.primary_region].name
  address_space       = ["10.0.0.0/16"]

  subnets = {
    aks = {
      address_prefixes = ["10.0.1.0/24"]
    }
    app = {
      address_prefixes = ["10.0.2.0/24"]
    }
  }

  inbound_ports = [5137, 3000, 80]

  tags = local.common_tags

  depends_on = [module.resource_groups]
}

# Primary AKS Cluster in Southeast Asia
module "primary_aks" {
  source              = "./modules/aks"
  cluster_name        = "roadmap-maker-primary-aks"
  location            = local.primary_region
  resource_group_name = module.resource_groups[local.primary_region].name
  dns_prefix          = "roadmap-maker-primary"
  kubernetes_version  = "1.32.5"

  # Node pool configuration
  node_count          = 2              # Create 2 nodes initially for primary cluster
  node_vm_size        = "Standard_B2s" # 2 vCPU, 4GB RAM
  enable_auto_scaling = false


  # Resource limits
  max_pods        = 50
  os_disk_size_gb = 32

  # Network configuration
  network_plugin = "azure"
  network_policy = "azure"
  vnet_subnet_id = module.primary_network.subnet_ids["aks"]

  # configure service CIDR to avoid conflicts with app subnet
  service_cidr   = "172.16.0.0/16"
  dns_service_ip = "172.16.0.10"

  tags = merge(local.common_tags, {
    cluster-type = "primary"
    region       = "primary"
  })
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  depends_on                 = [module.primary_network]
}

# Secondary Network in East Asia
module "secondary_network" {
  source              = "./modules/network"
  vnet_name           = "roadmap-maker-secondary-vnet"
  location            = "eastasia"
  resource_group_name = module.resource_groups["eastasia"].name
  address_space       = ["10.1.0.0/16"]

  subnets = {
    aks = {
      address_prefixes = ["10.1.1.0/24"]
    }
    app = {
      address_prefixes = ["10.1.2.0/24"]
    }
  }

  inbound_ports = [5137, 3000, 80]

  tags = local.common_tags

  depends_on = [module.resource_groups]
}

# Secondary AKS Cluster in East Asia (passive cluster)
module "secondary_aks" {
  source              = "./modules/aks"
  cluster_name        = "roadmap-maker-secondary-aks"
  location            = "eastasia"
  resource_group_name = module.resource_groups["eastasia"].name
  dns_prefix          = "roadmap-maker-secondary"
  kubernetes_version  = "1.32.5"

  # Node pool configuration
  node_count          = 2
  node_vm_size        = "Standard_B2s"
  enable_auto_scaling = false

  # Resource limits
  max_pods        = 50
  os_disk_size_gb = 32

  # Network configuration
  network_plugin = "azure"
  network_policy = "azure"
  vnet_subnet_id = module.secondary_network.subnet_ids["aks"] # vnet for secondary cluster

  # configure service CIDR to avoid conflicts with app subnet
  service_cidr   = "172.17.0.0/16"
  dns_service_ip = "172.17.0.10"

  tags = merge(local.common_tags, {
    cluster-type = "secondary"
    region       = "secondary"
  })
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  depends_on                 = [module.secondary_network]
}


module "alerts" {
  source = "./modules/alerts"

  resource_group_name = module.resource_groups[local.primary_region].name
  contact_emails      = local.alert_emails

  action_group_name       = "ag-roadmap-maker"
  action_group_short_name = "RmAlerts"

  budget_name   = "roadmap-maker-annual-budget"
  budget_amount = 100
  time_grain    = "Annually"
  start_date    = "2025-07-01"
  end_date      = "2025-08-31"

  warn_threshold = 50
  crit_threshold = 70
}

# Data source for current Azure client configuration
data "azurerm_client_config" "current" {} # get info about the current Azure client

# Data source for Azure AD Service Principal
data "azuread_service_principal" "current" {
  client_id = data.azurerm_client_config.current.client_id # Use the client_id from the azurerm_client_config data source
}

# PostgreSQL Flexible Server for each region
resource "azurerm_postgresql_flexible_server" "primary" {
  name                = "roadmap-maker-${local.primary_region}-psql"
  location            = local.primary_region
  resource_group_name = module.resource_groups[local.primary_region].name
  zone                = "2"

  sku_name   = "B_Standard_B1ms"
  version    = "15"
  storage_mb = 32768

  backup_retention_days        = 7
  geo_redundant_backup_enabled = true

  authentication {
    active_directory_auth_enabled = true
    password_auth_enabled         = true
    tenant_id                     = data.azurerm_client_config.current.tenant_id
  }

  administrator_login    = "adminuser"
  administrator_password = var.postgres_admin_password

  tags = local.common_tags
}

# PostgreSQL Active Directory Administrator
resource "azurerm_postgresql_flexible_server_active_directory_administrator" "primary" {
  server_name         = azurerm_postgresql_flexible_server.primary.name
  resource_group_name = module.resource_groups[local.primary_region].name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  object_id           = data.azurerm_client_config.current.object_id
  principal_name      = data.azuread_service_principal.current.display_name
  principal_type      = "ServicePrincipal"
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "primary" {
  name      = "roadmap_maker"
  server_id = azurerm_postgresql_flexible_server.primary.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Firewall rule for Azure services
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.primary.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "aks_subnet" {
  name             = "AllowAKSSubnet"
  server_id        = azurerm_postgresql_flexible_server.primary.id
  start_ip_address = "10.0.1.0"
  end_ip_address   = "10.0.1.255"
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = "shared-laworkspace"
  location            = local.primary_region
  resource_group_name = module.resource_groups[local.primary_region].name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Deploy azure function
module "function" {
  source                       = "./modules/function"
  function_name                = "traffic-switch-func"
  resource_group_name          = module.resource_groups[local.primary_region].name
  location                     = local.primary_region
  storage_account_name         = "trafficswitchfuncsa"
  azure_subscription_id        = data.azurerm_client_config.current.subscription_id
  traffic_manager_profile_name = "roadmap-maker-tm"
}

# Monitoring cho aks primary
module "primary_monitoring" {
  source                     = "./modules/monitoring"
  cluster_id                 = module.primary_aks.cluster_id
  cluster_name               = "roadmap-maker-primary-aks"
  location                   = local.primary_region
  resource_group_name        = module.resource_groups[local.primary_region].name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  failover_function_url      = "https://${module.function.function_hostname}/api/FailoverTrigger"
}

module "traffic-manager" {
  source                 = "./modules/traffic-manager"
  profile_name           = "roadmap-tm"
  resource_group_name    = module.resource_groups[local.primary_region].name
  traffic_routing_method = "Priority"
  dns_relative_name      = "roadmap-tm"
  dns_ttl                = 30
  monitor_protocol       = "HTTPS"
  monitor_port           = 443
  monitor_path           = "/"
  tags                   = local.common_tags

  endpoints = [
    {
      name     = "primary-endpoint"
      target   = "roadmap-maker.southeastasia.cloudapp.azure.com"
      location = "southeastasia"
      priority = 1
    },
    {
      name     = "secondary-endpoint"
      target   = "roadmap-maker.eastasia.cloudapp.azure.com"
      location = "eastasia"
      priority = 2
    }
  ]
}
