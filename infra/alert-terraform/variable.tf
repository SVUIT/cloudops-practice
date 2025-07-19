# variables.tf
variable "budget_name" {
  description = "The budget of cloudops Project"
  type        = string
  default     = "Cloud-Budget"
}

variable "resource_group_name" {
  description = "Name of the resource group for the action group."
  type        = string
  default     = "rg-monitoring-alerts"
}

variable "location" {
  description = "The Azure region for the monitoring resource group."
  type        = string
  default     = "southeastasia" # You can change this to your preferred region
}

variable "contact_emails" {
  description = "Map of team member name to their email address."
  type        = map(string)
  default = {
    thanh  = "chithanh080804@gmail.com"
    thuan  = "thuan.tongg@gmail.com"
    an = "doanquocan205@gmail.com"
    loc    = "nhloc08@gmail.com"
  }
}


variable "start_date" {
  description = "The start date of the budget in YYYY-MM-DD format."
  type        = string
  default     = "2025-07-01" # Example: Start date is Monday, July 21, 2025
}

variable "end_date" {
  description = "The start date of the budget in YYYY-MM-DD format."
  type        = string
  default     = "2025-08-08" 
}