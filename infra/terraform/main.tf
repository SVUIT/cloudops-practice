# Data sources for regions
locals {
  regions = ["southeastasia", "eastasia"]
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