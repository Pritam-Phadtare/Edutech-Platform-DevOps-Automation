resource "aws_vpc" "terra-vpc" {
    cidr_block = "10.0.0.0/16"
    tags = {
      Name = "Coding-Cloud-VPC"
    }
}

resource "aws_subnet" "terra-pub-sub-1" {
    vpc_id = aws_vpc.terra-vpc.id
    cidr_block = "10.0.0.0/19"
    availability_zone = "ap-south-1a"
    tags = {
      Name = "Coding-Cloud-Public-Subnet-1"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_subnet" "terra-pub-sub-2" {
    vpc_id = aws_vpc.terra-vpc.id
    availability_zone = "ap-south-1b"
    cidr_block = "10.0.32.0/19"
    tags = {
      Name = "Coding-Cloud-Public-Subnet-2"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_subnet" "terra-sub-priva-1" {
    vpc_id = aws_vpc.terra-vpc.id
    cidr_block = "10.0.64.0/19"
    availability_zone = "ap-south-1a"
    tags = {
      Name = "Coding-Cloud-Private-Subnet-1"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_subnet" "terra-sub-priva-2" {
    vpc_id = aws_vpc.terra-vpc.id
    cidr_block = "10.0.96.0/19"
    availability_zone = "ap-south-1b"
    tags = {
      Name = "Coding-Cloud-Private-Subnet-2"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_internet_gateway" "terra-igw" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "Coding-Cloud-IGW"
    }
}

resource "aws_eip" "terra-eip" {
    region = "ap-south-1"
    tags = {
        Name = "NAT-EIP"
    }
}

resource "aws_nat_gateway" "terra-nat" {
    allocation_id = aws_eip.terra-eip.id
    subnet_id = aws_subnet.terra-pub-sub-1.id
    tags = {
      Name = "Coding-Cloud-NAT"
    }
    depends_on = [ aws_eip.terra-eip, aws_subnet.terra-pub-sub-1 ]
}

resource "aws_route_table" "terra-public" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
      Name = "Coding-Cloud-Public-Table"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_route_table" "terra-private" {
    vpc_id = aws_vpc.terra-vpc.id
    tags = {
        Name = "Coding-Cloud-Private-Table"
    }
    depends_on = [ aws_vpc.terra-vpc ]
}

resource "aws_route_table_association" "terra-pub-asso-1" {
    route_table_id = aws_route_table.terra-public.id
    subnet_id = aws_subnet.terra-pub-sub-1.id
    depends_on = [ aws_route_table.terra-public, aws_subnet.terra-pub-sub-1 ]
}

resource "aws_route_table_association" "terra-pub-asso-2" {
    route_table_id = aws_route_table.terra-public.id
    subnet_id = aws_subnet.terra-pub-sub-2.id
    depends_on = [ aws_route_table.terra-public, aws_subnet.terra-pub-sub-2 ]
}

resource "aws_route_table_association" "terra-priva-asso-1" {
    route_table_id = aws_route_table.terra-private.id
    subnet_id = aws_subnet.terra-sub-priva-1.id
    depends_on = [ aws_route_table.terra-private, aws_subnet.terra-sub-priva-1 ]
}

resource "aws_route_table_association" "terra-priva-asso-2" {
    route_table_id = aws_route_table.terra-private.id
    subnet_id = aws_subnet.terra-sub-priva-2.id
    depends_on = [ aws_route_table.terra-private, aws_subnet.terra-sub-priva-2 ]
}

resource "aws_route" "terra-pub-route" {
    route_table_id = aws_route_table.terra-public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.terra-igw.id
    depends_on = [ aws_route_table.terra-public, aws_nat_gateway.terra-nat ]
}

resource "aws_route" "terra-priv-route" {
    route_table_id = aws_route_table.terra-private.id
    destination_cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.terra-nat.id
    depends_on = [ aws_route_table.terra-private, aws_nat_gateway.terra-nat ]
}