resource "azurerm_virtual_network" "this" {
  name                = var.vnet_name
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = var.address_space

  tags = var.tags
}

resource "azurerm_subnet" "subnets" {
  for_each = var.subnets

  name                 = each.key
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = each.value.address_prefixes
  service_endpoints    = each.value.service_endpoints

  dynamic "delegation" {
    for_each = each.value.delegation != null ? [each.value.delegation] : []
    content {
      name = delegation.value.name

      service_delegation {
        name    = delegation.value.service_delegation.name
        actions = delegation.value.service_delegation.actions
      }
    }
  }
}

# Network Security Group for AKS subnet
resource "azurerm_network_security_group" "aks_nsg" {
  count               = contains(keys(var.subnets), "aks") ? 1 : 0
  name                = "${var.vnet_name}-aks-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  # Allow inbound traffic for AKS
  security_rule {
    name                       = "AllowAKSInbound"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }

  # Allow outbound traffic for AKS
  security_rule {
    name                       = "AllowAKSOutbound"
    priority                   = 1000
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = var.tags
}

# Associate NSG with AKS subnet
resource "azurerm_subnet_network_security_group_association" "aks_nsg_association" {
  count                     = contains(keys(var.subnets), "aks") ? 1 : 0
  subnet_id                 = azurerm_subnet.subnets["aks"].id
  network_security_group_id = azurerm_network_security_group.aks_nsg[0].id
}

resource "azurerm_network_security_group" "nsg" {
  name                = "${var.vnet_name}-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_network_security_rule" "inbound" {
  for_each                    = toset(var.inbound_ports)
  name                        = "allow-inbound-port-${each.value}"
  priority                    = 100 + each.value
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = each.value
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.nsg.name
  resource_group_name         = var.resource_group_name
}
