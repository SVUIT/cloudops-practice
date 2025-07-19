variable "location" {
  type    = string
  default = "southeastasia"
}

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
