# Terraform Infrastructure - CloudOps Practice

## Cấu trúc thư mục

```
terraform/
├── main.tf             # File chính chứa resources và modules
├── backend.tf          # Cấu hình remote backend (HCP Terraform)
├── variables.tf        # Định nghĩa biến đầu vào
├── outputs.tf          # Định nghĩa output values
├── versions.tf         # Constraints cho Terraform và providers
├── modules/            # Thư mục chứa các modules tái sử dụng
│   ├── aks/           # Module cho Azure Kubernetes Service
│   ├── network/       # Module cho networking (VNet, Subnet, NSG)
│   ├── resource-group/ # Module cho Resource Groups
│   └── security/      # Module cho security configurations
└── regions/           # Environment-specific configurations
    ├── eastasia/      # Cấu hình cho region East Asia
    └── southeastasia/ # Cấu hình cho region Southeast Asia
```

## 🚀 CLI-driven Workflow

### 1. Setup HCP Terraform Authentication

#### Local CLI Authentication:
```bash
# Login to HCP Terraform
terraform login

# Or set token manually
export TF_TOKEN_app_terraform_io="your-hcp-token"
```

#### HCP Workspace Configuration:
**Environment Variables** (trong HCP workspace):
```bash
# Azure Authentication (Mark as Sensitive)
ARM_TENANT_ID = "your-tenant-id"
ARM_CLIENT_ID = "your-client-id"  
ARM_CLIENT_SECRET = "your-client-secret"
ARM_SUBSCRIPTION_ID = "your-subscription-id"

# Terraform Variables
environment = "prod"
application = "kanban"
regions = ["southeastasia", "eastasia"]
```

### 2. Local Development Workflow

#### Standard CLI Operations:
```bash
# Initialize with remote backend
terraform init

# Plan changes (uses remote state)
terraform plan

# Apply changes (saves to remote state)
terraform apply

# Validate configuration
terraform validate

# Format code
terraform fmt
```

#### Fast Development Cycle:
```bash
# Quick iteration cycle
terraform plan -out=tfplan    # Generate plan file
terraform show tfplan         # Review changes
terraform apply tfplan        # Apply with plan file
```