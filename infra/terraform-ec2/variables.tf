variable "project_name" {
  type        = string
  description = "Project name prefix"
  default     = "travelguide"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "prod"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.small"
}

variable "key_name" {
  type        = string
  description = "Existing EC2 key pair name for SSH"
  default     = ""
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH into instance"
  default     = "0.0.0.0/0"
}

variable "vpc_id" {
  type        = string
  description = "Optional VPC id; empty means default VPC"
  default     = ""
}

variable "subnet_id" {
  type        = string
  description = "Optional subnet id; empty means first default subnet"
  default     = ""
}

variable "app_port" {
  type        = number
  description = "App container port"
  default     = 3000
}

variable "host_port" {
  type        = number
  description = "Host port to expose app"
  default     = 80
}

variable "container_image" {
  type        = string
  description = "Full container image URI (ECR or public registry)"
}

variable "plain_env" {
  type        = map(string)
  description = "Non-sensitive env vars written to /etc/travelguide.env"
  default = {
    NODE_ENV = "production"
  }
}
