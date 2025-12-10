resource "aws_db_subnet_group" "rds-db-subnet" {
    name = "private-subnet-group"
    subnet_ids = [var.private_sub_1, var.private_sub_2]
}

resource "aws_db_instance" "db" {
    db_name = "enquiry"
    engine = "mysql"
    engine_version = "8.0"
    multi_az = false
    username = "root"
    password = "snow1234"
    instance_class = "db.t3.micro"
    storage_type = "gp3"
    allocated_storage = 400
    # iops = 3000
    network_type = "IPV4"
    db_subnet_group_name = aws_db_subnet_group.rds-db-subnet.name
    publicly_accessible = false
    vpc_security_group_ids = [var.rds_sg]
    skip_final_snapshot = true
    deletion_protection = false
    port = 3306
}