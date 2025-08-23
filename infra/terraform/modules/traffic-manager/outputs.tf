output "profile_name" {
  value = azurerm_traffic_manager_profile.tm_profile.name
}
output "profile_fqdn" {
  value = azurerm_traffic_manager_profile.tm_profile.fqdn
}
