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

## Các thành phần chính của Terraform

### 1. Provider Configuration (`main.tf`)
```terraform
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

**Chức năng:**
- **Provider**: Kết nối với Azure API để quản lý resources
- **Version Constraints**: Đảm bảo compatibility và stability
- **Authentication**: Tự động xác thực với Azure thông qua Service Principal

### 2. Variables (`variables.tf`)
**Chức năng:**
- **Parameterization**: Cho phép tùy chỉnh cấu hình cho các environment khác nhau
- **Reusability**: Tái sử dụng code cho nhiều regions/environments
- **Security**: Sensitive variables được bảo mật
- **Flexibility**: Dễ dàng thay đổi cấu hình mà không cần sửa code

**Các biến chính:**
- `environment`: Môi trường triển khai (prod, dev, staging)
- `application`: Tên ứng dụng
- `regions`: Danh sách các Azure regions
- `common_tags`: Tags chung cho tất cả resources
- Azure authentication variables: Thông tin xác thực

### 3. Outputs (`outputs.tf`)
**Chức năng:**
- **Information Sharing**: Chia sẻ thông tin giữa các modules
- **Integration**: Kết nối với các hệ thống khác
- **Debugging**: Hiển thị thông tin quan trọng sau khi deploy
- **Dependencies**: Tạo dependencies giữa các resources

### 4. Modules
**Chức năng:**
- **Modularity**: Chia nhỏ infrastructure thành các thành phần logic
- **Reusability**: Tái sử dụng code cho nhiều environments
- **Maintainability**: Dễ bảo trì và cập nhật
- **Best Practices**: Áp dụng các best practices cho từng loại resource

#### Module Resource Group (`modules/resource-group/`)
- Tạo và quản lý Azure Resource Groups
- Áp dụng naming conventions và tagging standards

#### Module AKS (`modules/aks/`)
- Triển khai Azure Kubernetes Service cluster
- Cấu hình networking, security, và scaling

#### Module Network (`modules/network/`)
- Thiết lập Virtual Network (VNet)
- Cấu hình Subnets và Network Security Groups
- Quản lý routing và connectivity

#### Module Security (`modules/security/`)
- Cấu hình security policies
- Quản lý identity và access management
- Thiết lập monitoring và logging

## HCP Terraform Backend (Terraform Cloud)

### Tại sao nên sử dụng HCP Backend?

1. **Remote State Management**
   - State file được lưu trữ an toàn trên cloud
   - Automatic state locking và encryption
   - Version history và rollback capability

2. **Collaboration Features**
   - Team workspace management
   - Role-based access control
   - Approval workflows cho production changes

3. **CI/CD Integration**
   - Automated plan và apply
   - Integration với GitHub/GitLab
   - Policy as Code với Sentinel

4. **Security & Compliance**
   - Encrypted state storage
   - Audit logging
   - Secrets management
   - Compliance reporting

### Cấu hình HCP Backend

Cấu hình VCS-driven kết nối với repo GitHub trên giao diện HCP

## Workflow triển khai với HCP Terraform

### 1. Setup HCP Terraform Workspace

#### Tạo Workspace trên HCP Terraform:
1. Đăng nhập vào [Terraform Cloud](https://app.terraform.io/)
2. Tạo organization (nếu chưa có)
3. Tạo workspace mới: **Version Control Workflow** - Kết nối với Git repository (Recommended)

#### Cấu hình Workspace Variables:
```
# Environment Variables (Sensitive)
ARM_TENANT_ID = "your-tenant-id"
ARM_CLIENT_ID = "your-client-id"  
ARM_CLIENT_SECRET = "your-client-secret"
ARM_SUBSCRIPTION_ID = "your-subscription-id"

# Terraform Variables
environment = "prod"
application = "kanban"
regions = ["southeastasia", "eastasia"]
```

### Git-based Workflow

#### Push code và tự động trigger:
```bash
# Commit và push code
git add .
git commit -m "Update terraform configuration"
git push origin main
```

**HCP Terraform sẽ tự động:**
1. Detect changes trong repository
2. Chạy `terraform plan` trên cloud
3. Hiển thị plan results trong UI
4. Chờ approval để chạy `terraform apply`

#### Manual trigger từ HCP UI:
1. Vào workspace trên Terraform Cloud
2. Click **"Queue plan manually"**
3. Review plan results
4. **Confirm & Apply** nếu mọi thứ OK

### 4. Monitoring và Management trên HCP UI

#### Workspace Management:
- **Runs History**: Xem lịch sử tất cả các lần chạy
- **Current State**: Xem state hiện tại mà không cần CLI
- **Variables**: Quản lý environment và terraform variables
- **Settings**: Cấu hình workspace policies và permissions

#### Advanced Features:
- **Cost Estimation**: Ước tính chi phí resources trước khi apply
- **Policy Checks**: Sentinel policy validation tự động
- **Notifications**: Slack/Email notifications cho team
- **Team Management**: Phân quyền chi tiết cho team members

### 5. State Operations (Không cần CLI)

Tất cả thao tác state được thực hiện qua HCP UI:
- **View State**: Xem resources trong state
- **State Versions**: Xem history và rollback nếu cần
- **Import Resources**: Import existing Azure resources
- **Resource Management**: Taint, untaint resources

## HCP Terraform Configuration

### Workspace Variables (Thay thế Environment Variables)

Trong HCP Terraform workspace, cấu hình các variables sau:

#### Environment Variables (Sensitive):
```
ARM_TENANT_ID = "your-tenant-id"
ARM_CLIENT_ID = "your-client-id"
ARM_CLIENT_SECRET = "your-client-secret" (Mark as Sensitive)
ARM_SUBSCRIPTION_ID = "your-subscription-id"
```

#### Terraform Variables:
```
environment = "prod"
application = "kanban"
regions = ["southeastasia", "eastasia"]
```

#### Workspace Settings:
- **Execution Mode**: Remote
- **Terraform Version**: Latest stable
- **Auto Apply**: Enable cho non-production environments
- **Cost Estimation**: Enable


## Liên kết tham khảo

- [Terraform Documentation](https://www.terraform.io/docs)
- [Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [HCP Terraform Documentation](https://www.terraform.io/cloud-docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices)