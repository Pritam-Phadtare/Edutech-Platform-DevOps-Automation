resource "aws_alb" "lb" {
    load_balancer_type = "application"
    name = "coding-cloud-lb"
    internal = false
    ip_address_type = "ipv4"
    security_groups = [var.alb_sg]
    subnets = [var.public_sub_1, var.public_sub_2]
}

resource "aws_alb_listener" "http" {
    load_balancer_arn = aws_alb.lb.arn
    port = 80
    protocol = "HTTP"

    default_action {
      type = "forward"
      target_group_arn = aws_alb_target_group.lb-target.arn
    }
    depends_on = [ aws_alb.lb ]
}

resource "aws_alb_target_group" "lb-target" {
    name = "coding-cloud-vm-target"
    target_type = "instance"
    protocol = "HTTP"
    port = 31000
    vpc_id = var.vpc_id

    health_check {
        healthy_threshold = 2
        unhealthy_threshold = 2
        timeout = 5
        interval = 30
        path = "/"                          # ALB will check / on port 31000
        matcher = "200-299"                 # Accept 2xx and 3xx status codes
        protocol = "HTTP"
    }
}

resource "aws_alb_target_group_attachment" "vm-target" {
    target_group_arn = aws_alb_target_group.lb-target.arn
    target_id = aws_instance.worker.id
    port = 31000
    depends_on = [ aws_alb_target_group.lb-target ]
}