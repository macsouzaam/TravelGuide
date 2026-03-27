variable "project_name" {
  type        = string
  description = "Project name used in resource naming"
  default     = "travelguide"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "app_port" {
  type        = number
  description = "Container and target group port"
  default     = 3000
}

variable "container_image" {
  type        = string
  description = "Full container image URI. If empty, uses ECR repo with :latest"
  default     = ""
}

variable "cpu" {
  type        = number
  description = "Fargate CPU units"
  default     = 512
}

variable "memory" {
  type        = number
  description = "Fargate memory in MiB"
  default     = 1024
}

variable "desired_count" {
  type        = number
  description = "Desired number of ECS tasks"
  default     = 1
}

variable "vpc_id" {
  type        = string
  description = "Optional VPC id. If empty, uses default VPC"
  default     = ""
}

variable "subnet_ids" {
  type        = list(string)
  description = "Optional subnet ids. If empty, uses all subnets from selected VPC"
  default     = []
}

variable "assign_public_ip" {
  type        = bool
  description = "Assign public IP to ECS tasks"
  default     = true
}

variable "plain_env" {
  type        = map(string)
  description = "Non-sensitive environment variables for container"
  default = {
    NODE_ENV = "production"
  }
}

variable "secret_arns" {
  type        = map(string)
  description = "Map of env var name to Secrets Manager ARN"
  default     = {}
}
