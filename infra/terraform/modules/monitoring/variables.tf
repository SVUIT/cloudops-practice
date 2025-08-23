variable "cluster_id" {
  description = "Resource ID of the AKS cluster"
  type        = string
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
}

variable "location" {
  description = "Region of the AKS cluster"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "log_analytics_workspace_id" { 
  type = string 
}

variable "failover_function_url" {
  description = "The URL of the Azure Function for failover"
  type        = string
}