terraform {
  required_version = ">= 1.4.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.50"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.52"
    }
  }
}

provider "azurerm" {
  features {}
}
provider "azuread" {}