output "instance_id" {
  value       = aws_instance.app.id
  description = "EC2 instance id"
}

output "public_ip" {
  value       = aws_instance.app.public_ip
  description = "Public IP"
}

output "public_dns" {
  value       = aws_instance.app.public_dns
  description = "Public DNS"
}

output "app_url" {
  value       = "http://${aws_instance.app.public_dns}"
  description = "TravelGuide URL"
}
