resource "aws_instance" "master" {
    ami = "ami-00cafcbeaa5aaba5a"
    instance_type = "t2.medium"
    key_name = aws_key_pair.key.key_name
    subnet_id = var.private_sub_1
    vpc_security_group_ids = [var.k8s_master_sg]
    associate_public_ip_address = false
    iam_instance_profile = aws_iam_instance_profile.profile.name
    user_data = file("${path.module}/cluster-init-script/master-init.sh")
    tags = {
      Name = "K8s-Master"
    }
    depends_on = [ aws_iam_instance_profile.profile ]
}

resource "aws_instance" "worker" {
    ami = "ami-00cafcbeaa5aaba5a"
    instance_type = "t2.medium"
    key_name = aws_key_pair.key.key_name
    subnet_id = var.private_sub_2
    vpc_security_group_ids = [var.k8s_worker_sg]
    associate_public_ip_address = false
    iam_instance_profile = aws_iam_instance_profile.profile.name
    user_data = file("${path.module}/cluster-init-script/worker-join.sh")
    tags = {
      Name = "K8s-Worker"
    }
    depends_on = [ aws_iam_instance_profile.profile ]
}

resource "aws_iam_instance_profile" "profile" {
  name = "cluster-instance-profile"
  role = "Cluster-Role"
}