resource "aws_security_group" "sg-jenkins" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "Jenkins-Master-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-jenkins-ingress-ssh" {
    security_group_id = aws_security_group.sg-jenkins.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 22
    to_port = 22
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-jenkins ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-jenkins-ingress-8080" {
    security_group_id = aws_security_group.sg-jenkins.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 8080
    to_port = 8080
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-jenkins ]
}

resource "aws_vpc_security_group_egress_rule" "sg-jenkins-egress-all" {
    security_group_id = aws_security_group.sg-jenkins.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-jenkins ]
}

resource "aws_security_group" "sg-docker" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
        Name = "Docker-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-docker-ingress-ssh" {
    security_group_id = aws_security_group.sg-docker.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 22
    to_port = 22
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-docker ]
}

resource "aws_vpc_security_group_egress_rule" "sg-docker-egress-all" {
    security_group_id = aws_security_group.sg-docker.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-docker ]
}

resource "aws_security_group" "sg-k8s-master" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "K8s-Master-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-master-ingress-ssh" {
    security_group_id = aws_security_group.sg-k8s-master.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 22
    to_port = 22
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-master ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-master-ingress-6443" {
    security_group_id = aws_security_group.sg-k8s-master.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 6443
    to_port = 6443
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-master ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-master-ingress-10250" {
    security_group_id = aws_security_group.sg-k8s-master.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 10250
    to_port = 10250
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-master ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-master-ingress-179" {
    security_group_id = aws_security_group.sg-k8s-master.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 179
    to_port = 179
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-master ]
}

resource "aws_vpc_security_group_egress_rule" "sg-master-egress-all" {
    security_group_id = aws_security_group.sg-k8s-master.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-k8s-master]
}

resource "aws_security_group" "sg-k8s-worker" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "K8s-Worker-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-worker-ingress-ssh" {
    security_group_id = aws_security_group.sg-k8s-worker.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 22
    to_port = 22
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-worker ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-worker-ingress-179" {
    security_group_id = aws_security_group.sg-k8s-worker.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 179
    to_port = 179
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-worker ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-worker-ingress-31000" {
    security_group_id = aws_security_group.sg-k8s-worker.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 31000
    to_port = 31000
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-k8s-worker ]
}

resource "aws_vpc_security_group_egress_rule" "sg-worker-egress-all" {
    security_group_id = aws_security_group.sg-k8s-worker.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-k8s-worker ]
}

resource "aws_security_group" "sg-rds" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "RDS-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-rds-ingress-3306" {
    security_group_id = aws_security_group.sg-rds.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 3306
    to_port = 3306
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-rds ]
}

resource "aws_vpc_security_group_egress_rule" "sg-rds-egress-all" {
    security_group_id = aws_security_group.sg-rds.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-rds ]
}

resource "aws_security_group" "sg-alb" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "ALB-SG"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_vpc_security_group_ingress_rule" "sg-alb-ingress-http" {
    security_group_id = aws_security_group.sg-alb.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 80
    to_port = 80
    ip_protocol = "tcp"
    depends_on = [ aws_security_group.sg-alb ]
}

resource "aws_vpc_security_group_egress_rule" "sg-alb-egress-all" {
    security_group_id = aws_security_group.sg-alb.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = -1
    depends_on = [ aws_security_group.sg-alb ]
}