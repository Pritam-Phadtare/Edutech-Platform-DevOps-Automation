terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.23.0"
    }
  }
}

module "vpc" {
  source = "./vpc"
}

module "ec2" {
  source = "./ec2"

  ## subnet ids
  public_sub_1 = module.vpc.pub-sub-1
  public_sub_2 = module.vpc.pub-sub-2
  private_sub_1 = module.vpc.priv-sub-1
  private_sub_2 = module.vpc.priv-sub-2

  ## sg ids
  jenkins_sg = module.vpc.sg-jenkins
  docker_sg = module.vpc.sg-docker
  k8s_master_sg = module.vpc.sg-k8s-master
  k8s_worker_sg = module.vpc.sg-k8s-worker
  alb_sg = module.vpc.sg-alb

  vpc_id = module.vpc.vpc-id
  
  depends_on = [ module.vpc ]
}

module "rds" {
  source = "./rds"

  private_sub_1 = module.vpc.priv-sub-1
  private_sub_2 = module.vpc.priv-sub-2
  rds_sg = module.vpc.sg-rds

  depends_on = [ module.vpc ]
}