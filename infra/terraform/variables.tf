variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "application" {
  description = "Application name"
  type        = string
  default     = "roadmap-maker"
}

variable "regions" {
  description = "List of Azure regions to  deploy to"
  type        = list(string)
  default     = ["southeastasia", "eastasia"]
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    environment = "prod"
    application = "roadmap-maker"
    managed-by  = "terraform"
    project     = "cloudops-practice"
  }
}

# Azure authentication variables
variable "ARM_TENANT_ID" {
  description = "Azure AD tenant ID"
  type        = string
}

variable "ARM_CLIENT_ID" {
  description = "Service principal client ID"
  type        = string
}

variable "ARM_SUBSCRIPTION_ID" {
  description = "Azure subscription ID"
  type        = string
}

variable "ARM_CLIENT_SECRET" {
  description = "Service principal client secret"
  type        = string
  sensitive   = true
} 