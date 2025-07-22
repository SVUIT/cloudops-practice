terraform {
  backend "remote" {
    organization = "andrewdq"

    workspaces {
      name = "cloudops-practice"
    }
  }
}
