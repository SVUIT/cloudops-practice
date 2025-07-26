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
  node_count          = 2 # Create 2 nodes initially for primary cluster
  node_vm_size        = "Standard_B1ms"
  enable_auto_scaling = false
  # min_count           = 1
  # max_count           = 5

  # Resource limits
  max_pods        = 30
  os_disk_size_gb = 32

  # Network configuration
  network_plugin = "azure"
  network_policy = "azure"
  vnet_subnet_id = module.primary_network.subnet_ids["aks"]

  tags = merge(local.common_tags, {
    cluster-type = "primary"
    region       = "primary"
  })

  depends_on = [module.primary_network]
}

# Data source for current Azure client configuration
data "azurerm_client_config" "current" {} # get info about the current Azure client

# Data source for Azure AD Service Principal
data "azuread_service_principal" "current" {
  client_id = data.azurerm_client_config.current.client_id # Use the client_id from the azurerm_client_config data source
}

# Random password for PostgreSQL admin for Azure Entra ID
resource "random_password" "postgresql_admin_password" {
  length  = 16
  special = true
}

# PostgreSQL Flexible Server for each region
resource "azurerm_postgresql_flexible_server" "primary" {
  name                = "roadmap-maker-${local.primary_region}-psql"
  location            = local.primary_region
  resource_group_name = module.resource_groups[local.primary_region].name

  administrator_login    = "psqladmin"
  administrator_password = random_password.postgresql_admin_password.result

  sku_name   = "B_Standard_B1ms"
  version    = "15"
  storage_mb = 32768 # 32GB

  backup_retention_days        = 7
  geo_redundant_backup_enabled = true

  authentication {
    active_directory_auth_enabled = true
    password_auth_enabled         = false
    tenant_id                     = data.azurerm_client_config.current.tenant_id
  }

  high_availability {
    mode                      = "ZoneRedundant"
    standby_availability_zone = "2"
  }

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
