terraform {
  backend "remote" {
    organization = "andrewdq"

    workspaces {
      prefix = "cloudops-practice-"
    }
  }
}
