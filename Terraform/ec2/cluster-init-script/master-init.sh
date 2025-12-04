#!/bin/bash

set -e
set -o pipefail

LOG_FILE="/var/log/k8s-master-init.log"
exec > >(tee -a ${LOG_FILE}) 2>&1

echo "Kubernetes Master Initilization Started"

## Function to add timestamp at each step
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

## Function to check the command status
check_status() {
    if [ $? -eq 0 ]; then
       log "$1 Succeeded"
    else 
       log "$1 Failed"
    exit 1
    fi
}

log "Initilazing Kubernetes Cluster"
API_SERVER_IP=$(hostname -I | awk '{print $1}')
sudo kubeadm init --apiserver-advertise-address=$API_SERVER_IP | tee /tmp/kubeadm-init.log
check_status "kubeadm init"
log "Kubernetes Cluster Initialized Successfully"

log "Setting up kubectl for ubuntu user"
mkdir -p /home/ubuntu/.kube
sudo cp -i /etc/kubernetes/admin.conf /home/ubuntu/.kube/config
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
check_status "Kubectl Configuration"

sudo -u ubuntu kubectl get nodes
check_status "kubectl Verification"

log "Generate Worker Command"
JOIN_COMMAND=$(sudo kubeadm token create --print-join-command)

if [ -z "$JOIN_COMMAND" ]; then
   log "Failed to generate command"
   exit 1
fi

log "Join command generated Successfully"

echo "$JOIN_COMMAND" > /tmp/cluster-join-command.sh
chmod +x /tmp/cluster-join-command.sh

log "Uploading Join-command.sh to S3"
aws s3 cp /tmp/cluster-join-command.sh s3://coding-cloud-cluster
check_status "S3 File Upload"
log "Join command.sh uploaded successfully"

log "Installing Calico CNI"
sudo -u ubuntu kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
check_status "Calico Installation"
sleep 30
sudo -u ubuntu kubectl get pods -n kube-system | grep calico || true

exit 0