variable "resource_group_name" {
  description = "Existing resource group name to place the Action Group"
  type        = string
}

variable "contact_emails" {
  description = "Map of receivers: { alias = email }"
  type        = map(string)
}

variable "action_group_name" {
  description = "Azure Monitor Action Group name"
  type        = string
  default     = "ag-roadmap-maker"
}

variable "action_group_short_name" {
  description = "Short name (<=12 chars) required by Azure"
  type        = string
  default     = "RmAlerts"
}

variable "budget_name" {
  description = "Subscription budget name"
  type        = string
  default     = "roadmap-maker-budget"
}

variable "budget_amount" {
  description = "Budget amount in USD"
  type        = number
  default     = 100
}

variable "time_grain" {
  description = "Budget time grain: Monthly | Quarterly | Annually | BillingMonth | Custom"
  type        = string
  default     = "Annually"
}

variable "start_date" {
  description = "YYYY-MM-DD"
  type        = string
}

variable "end_date" {
  description = "YYYY-MM-DD"
  type        = string
}

variable "warn_threshold" {
  description = "Warning threshold percent"
  type        = number
  default     = 50
}

variable "crit_threshold" {
  description = "Critical threshold percent"
  type        = number
  default     = 70
}