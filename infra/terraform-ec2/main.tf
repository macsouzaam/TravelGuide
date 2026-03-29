data "aws_vpc" "default" {
  count   = var.vpc_id == "" ? 1 : 0
  default = true
}

data "aws_subnets" "default" {
  count = var.subnet_id == "" ? 1 : 0

  filter {
    name   = "vpc-id"
    values = [local.vpc_id]
  }
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["137112412989"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  vpc_id      = var.vpc_id != "" ? var.vpc_id : data.aws_vpc.default[0].id
  subnet_id   = var.subnet_id != "" ? var.subnet_id : data.aws_subnets.default[0].ids[0]

  env_file = join("\n", [for k, v in var.plain_env : "${k}=${v}"])
}

resource "aws_iam_role" "ec2_role" {
  name = "${local.name_prefix}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ssm_access" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${local.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_security_group" "ec2_sg" {
  name        = "${local.name_prefix}-sg"
  description = "Security group for TravelGuide EC2"
  vpc_id      = local.vpc_id

  ingress {
    description = "HTTP"
    from_port   = var.host_port
    to_port     = var.host_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.instance_type
  subnet_id              = local.subnet_id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              set -eux
              dnf update -y
              dnf install -y docker
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ec2-user

              cat >/etc/travelguide.env <<'ENVVARS'
              ${local.env_file}
              ENVVARS

              aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin $(echo ${var.container_image} | cut -d/ -f1)

              docker pull ${var.container_image}
              docker rm -f travelguide || true
              docker run -d --name travelguide --restart unless-stopped \
                --env-file /etc/travelguide.env \
                -p ${var.host_port}:${var.app_port} \
                ${var.container_image}
              EOF

  tags = {
    Name        = local.name_prefix
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_eip" "app" {
  domain = "vpc"

  tags = {
    Name        = "${local.name_prefix}-eip"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_eip_association" "app" {
  instance_id   = aws_instance.app.id
  allocation_id = aws_eip.app.id
}
