variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "function_name" {
  type = string
}

variable "storage_account_name" {
  type = string
}

variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "traffic_manager_profile_name" {
  type        = string
  description = "Traffic Manager profile name"
  default     = "roadmap-maker-tm"
}