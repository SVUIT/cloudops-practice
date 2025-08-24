output "function_hostname" {
  value = azurerm_function_app.function_app_python.default_hostname
}

output "function_url" {
  value = "https://${azurerm_function_app.function_app_python.default_hostname}"
}

output "function_name" {
  value = azurerm_function_app.function_app_python.name
}