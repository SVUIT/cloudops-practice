output "resource_group_names" {
  description = "Names of created resource groups"
  value       = { for k, v in module.resource_groups : k => v.name }
}

output "resource_group_ids" {
  description = "IDs of created resource groups"
  value       = { for k, v in module.resource_groups : k => v.id }
}

output "resource_group_locations" {
  description = "Locations of created resource groups"
  value       = { for k, v in module.resource_groups : k => v.location }
}
