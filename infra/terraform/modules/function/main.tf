resource "azurerm_storage_account" "function_app_storage" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "function_code" {
  name                  = "function-releases"
  storage_account_name  = azurerm_storage_account.function_app_storage.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "function_zip" {
  name                   = "function-code.zip"
  storage_account_name   = azurerm_storage_account.function_app_storage.name
  storage_container_name = azurerm_storage_container.function_code.name
  type                   = "Block"
  source                 = "${path.module}/../../../function-code.zip"
}

# Generate SAS token for blob access
data "azurerm_storage_account_blob_container_sas" "function_zip_sas" {
  connection_string = azurerm_storage_account.function_app_storage.primary_connection_string
  container_name    = azurerm_storage_container.function_code.name
  https_only        = true

  start  = "2024-01-01T00:00:00Z"
  expiry = "2030-01-01T00:00:00Z"

  permissions {
    read   = true
    add    = false
    create = false
    write  = false
    delete = false
    list   = false
  }
}

resource "azurerm_service_plan" "function_app_plan" {
  name                = "${var.function_name}-plan"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "function_app" {
  name                = var.function_name
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = azurerm_storage_account.function_app_storage.name
  storage_account_access_key = azurerm_storage_account.function_app_storage.primary_access_key
  service_plan_id            = azurerm_service_plan.function_app_plan.id

  site_config {
    application_stack {
      python_version = "3.11"
    }
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME     = "python"
    FUNCTIONS_EXTENSION_VERSION  = "~4"
    AzureWebJobsStorage         = azurerm_storage_account.function_app_storage.primary_connection_string
    WEBSITE_RUN_FROM_PACKAGE = "https://${azurerm_storage_account.function_app_storage.name}.blob.core.windows.net/${azurerm_storage_container.function_code.name}/${azurerm_storage_blob.function_zip.name}${data.azurerm_storage_account_blob_container_sas.function_zip_sas.sas}"
    SUBSCRIPTION_ID     = var.azure_subscription_id
    RESOURCE_GROUP = var.resource_group_name
    PROFILE_NAME   = var.traffic_manager_profile_name
  }
  
  identity {
    type = "SystemAssigned"
  }
  depends_on = [azurerm_storage_blob.function_zip]

}
