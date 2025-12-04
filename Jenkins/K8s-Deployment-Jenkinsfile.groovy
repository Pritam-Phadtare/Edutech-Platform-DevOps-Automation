pipeline {
    agent {
        label 'K8s-Master'
    }

    environment {
        NAMESPACE = 'coding-cloud'
        DOCKER_USERNAME = 'pritam44'
    }

    parameters {
        string(name: 'FRONTEND_IMAGE_TAG', defaultValue: 'latest', description: 'Frontend IMG to Deploy'),
        string(name: 'BACKEND_IMAGE_TAG', defaultValue: 'latest', description: 'Backend IMG to Deploy'),
        string(name: 'TRIGGERED_BY', defaultValue: 'manual'),
    }

    stages {
        stage('Pre-Deployment-Checks') {
            steps {
                echo "Running Pre-Deployment Checks"
                sh """
                  kubectl get pods -n ${NAMESPACE}
                  kubectl get deployment -n ${NAMESPACE}
                  kubectl get all -n ${NAMESPACE}
                """
                echo "Pre-Deployment Checks Completed"
            }
        }

        stage('Backup Current Deployment') {
            steps {
                echo "Backing Up Current Deployment State"
                sh """
                  mkdir -p backup
                  kubectl get deployment frontend-deployment -n ${NAMESPACE} -o yaml > backup/frontend-deployment-backup.yml || true
                  kubectl get deployment backend-deployment -n ${NAMESPACE} -o yaml > backup/backend-deployment-backup.yml || true
                """
                echo "Backup Create Successfully"
            }
        }

        stage('Update Frontend Deployment') {
            when {
                expression { params.FRONTEND_IMAGE_TAG != 'latest' }
            }
            steps {
                echo "Updating Frontend Deployment"
                sh """
                  kubectl set image deployment frontend-deployment frontend=${DOCKER_USERNAME}/coding-cloud-frontend:${params.FRONTEND_IMAGE_TAG} \
                  -n ${NAMESPACE}
                """
                echo "Frontend Image Updated to : ${DOCKER_USERNAME}/coding-cloud-frontend:${params.FRONTEND_IMAGE_TAG}"
            }
        }

        stage('Update Backend Deployment') {
            when {
                expression { params.BACKEND_IMAGE_TAG != 'latest' }
            }
            steps {
                echo "Updating Backend Deployment"
                sh """
                  kubectl set image deployment backend-deployment backend=${DOCKER_USERNAME}/coding-cloud-backend:${params.BACKEND_IMAGE_TAG} \
                  -n ${NAMESPACE}
                """
                echo "Backend Image Update to : ${DOCKER_USERNAME}/coding-cloud-backend:${params.BACKEND_IMAGE_TAG}"
            }
        }

        stage('Wait For Rollout') {
            steps {
                sh """
                  if [ "${params.FRONTEND_IMAGE_TAGE}" != "latest" ]; then
                     echo "Waiting For Frontend Rollout ..."
                     kubectl rollout status deployment frontend-deployment -n ${NAMESPACE} --timeout=5m
                  fi

                  if [ "${params.BACKEND_IMAGE_TAG}" != "latest" ]; then
                     echo "Waiting For Backend Rollout ..."
                     kubectl rollout status deployment backend-deployment -n ${NAMESPACE} --timeout=5m
                  fi
                """
                echo "All Rollouts Completed"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying Deployment"
                sh """
                  echo "Verfying Deployment Status"
                  kubectl get pods -n ${NAMESPACE} -o wide
                  FRONTEND_READY=\$(kubectl get deployment frontend-deployment -n ${NAMESPACE} -o jsonPath='{.status.readyReplicas}')
                  BACKEND_READY=\$(kubectl get deployment backend-deployment -n ${NAMESPACE} -o jsonPath='{.status.readyReplicas}')
                  NGINX_READY=\$(kubectl get deployment nginx-deployment -n ${NAMESPACE} -o jsonPath='{.status.readyReplicas}')

                  echo "Frontend Ready Pods = \$FRONTEND_READY"
                  echo "Backend Ready Pods = \$BACKEND_READY"
                  echo "Nginx Ready Pods = \$NGINX_READY"
                """
                echo "Deployment Verification Completed"
            }
        }
    }
    post {
        success {
            echo "Deployment to K8s Completed Successfully"
            def deploymentInfo = """
            ==============================================
                          Deployment Success             
            ==============================================
            Namespace : ${NAMESPACE}
            Frontend Image : ${DOCKER_USERNAME}/coding-cloud-frontend:${params.FRONTEND_IMAGE_TAG}
            Backend Image : ${DOCKER_USERNAME}/coding-cloud-backend:${params.BACKEND_IMAGE_TAG}
            Triggered By : ${params.TRIGGERED_BY}
            ============================================= 
            """
            echo deploymentInfo
        }

        failure {
            echo "Deployment to K8s Failed"
            sh """
              kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp' | tail -20
              kubectl logs -n ${NAMESPACE} -l app=frontend --tail=50 || true
              kubectl logs -n ${NAMESPACE} -l app=backend --tail-50 || true
            """
        }

        always {
            echo "Final Status"
            sh "kubectl get all -n ${NAMESPACE}"
        }
    }
}