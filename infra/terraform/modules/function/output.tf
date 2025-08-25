output "function_hostname" {
  value = azurerm_linux_function_app.function_app.default_hostname
}

output "function_url" {
  value = "https://${azurerm_linux_function_app.function_app.default_hostname}"
}


output "function_name" {
  value = azurerm_linux_function_app.function_app.name
}