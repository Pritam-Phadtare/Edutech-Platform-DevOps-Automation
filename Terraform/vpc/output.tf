## Subnet Ids
output "pub-sub-1" {
    value = aws_subnet.terra-pub-sub-1.id
}

output "pub-sub-2" {
    value = aws_subnet.terra-pub-sub-2.id
}

output "priv-sub-1" {
    value = aws_subnet.terra-sub-priva-1.id
}

output "priv-sub-2" {
    value = aws_subnet.terra-sub-priva-2.id
}

## SG Ids
output "sg-jenkins" {
    value = aws_security_group.sg-jenkins.id
}

output "sg-docker" {
    value = aws_security_group.sg-docker.id
}

output "sg-k8s-master" {
    value = aws_security_group.sg-k8s-master.id
}

output "sg-k8s-worker" {
    value = aws_security_group.sg-k8s-worker.id
}

output "sg-rds" {
    value = aws_security_group.sg-rds.id
}

output "sg-alb" {
    value = aws_security_group.sg-alb.id
}

output "vpc-id" {
    value = aws_vpc.terra-vpc.id
}