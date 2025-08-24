variable "profile_name" { type = string }
variable "resource_group_name" { type = string }
variable "traffic_routing_method" { type = string }
variable "dns_relative_name" { type = string }
variable "dns_ttl" { type = number }
variable "monitor_protocol" { type = string }
variable "monitor_port" { type = number }
variable "monitor_path" { type = string }
variable "tags" { type = map(string) }
variable "endpoints" {
  type = list(object({
    name     = string
    target   = string
    location = string
    priority = number
  }))
}