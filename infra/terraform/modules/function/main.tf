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

resource "azurerm_app_service_plan" "function_app_plan" {
  name                = "${var.function_name}-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }

  lifecycle {
    ignore_changes = [
      kind
    ]
  }
}


resource "azurerm_function_app" "function_app_python" {
  name                       = var.function_name
  location                   = var.location
  resource_group_name        = var.resource_group_name
  app_service_plan_id        = azurerm_app_service_plan.function_app_plan.id
  storage_account_name       = azurerm_storage_account.function_app_storage.name
  storage_account_access_key = azurerm_storage_account.function_app_storage.primary_access_key
  os_type                    = "linux"
  version                    = "~4"

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME     = "python"
    FUNCTIONS_EXTENSION_VERSION  = "~4"
    AzureWebJobsStorage         = azurerm_storage_account.function_app_storage.primary_connection_string
    WEBSITE_RUN_FROM_PACKAGE    = "https://${azurerm_storage_account.function_app_storage.name}.blob.core.windows.net/${azurerm_storage_container.function_code.name}/${azurerm_storage_blob.function_zip.name}"
    SUBSCRIPTION_ID     = var.azure_subscription_id
    RESOURCE_GROUP = var.resource_group_name
    PROFILE_NAME   = var.traffic_manager_profile_name
  }

  site_config {
    linux_fx_version = "python|3.9"
  }
  identity {
    type = "SystemAssigned"
  }
  depends_on = [azurerm_storage_blob.function_zip]
}