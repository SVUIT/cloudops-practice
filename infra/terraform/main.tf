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
