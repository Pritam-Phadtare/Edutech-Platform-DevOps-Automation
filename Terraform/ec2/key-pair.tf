resource "aws_key_pair" "key" {
    key_name = "coding-cloud-key"
    public_key = file("${path.module}/ssh-keypairs/coding-cloud-key.pub")
}