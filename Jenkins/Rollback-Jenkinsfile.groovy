pipeline {
    agent {
        label 'K8s-Master'
    }

    environment {
        NAMESPACE = 'coding-cloud'
    }

    parameters {
        choice(name: 'DEPLOYMENT_NAME',
               choices: ['frontend-deployment', 'backend-deployment', 'all'],
               description: 'Which Deployment to RollBack')
        string(name: 'REVISION', defaultValue: '0', description: 'Revision Number to Rollback (0 = previous)')
    }

    stages {
        stage('Confirmation') {
            steps {
                echo "Rollout Initiated"
                echo "Deployment: ${params.DEPLOYMENT_NAME}"
                echo "Revision: ${params.Revision}"
            }
        }

        stage('Check Rollout History') {
            steps {
                echo "Checking Deployment History"
                script {
                    if (params.DEPLOYMENT_NAME == 'all') {
                        sh """
                          echo "Frontend Deployment History"
                          kubectl rollout history deployment frontend-deployment -n ${NAMESPACE}
                          echo "Backend Deployment History"
                          kubectl rollout history deployment backend-deployment -n ${NAMESPACE}
                        """
                    } else {
                        sh "kubectl rollout history deployment ${DEPLOYMENT_NAME} -n ${NAMESPACE}"
                    }
                }
            }
        }

        stage('RollBack Deployment') {
            steps {
                echo "Rolling Back Deployment"
                script {
                    if (params.DEPLOYMENT_NAME == 'all') {
                        sh """
                          echo "Rolling Back Frontend"
                          kubectl rollout undo deployment frontend-deployment -n ${NAMESPACE} --to-revision=${params.REVISION}
                          echo "Rolling Back Backend"
                          kubectl rollout undo deployment backend-deployment -n ${NAMESPACE} --to-revision=${params.REVISION}
                        """
                    } else {
                        sh "kubectl rollout undo deployment ${params.DEPLOYMENT_NAME} -n ${NAMESPACE} --to-revision=${params.REVISION}"
                    }
                }
            }
        }

        stage('Wait For RollBack') {
            steps {
                echo "Waiting For RollBack to Complete"
                script {
                    if (params.DEPLOYMENT_NAME = 'all') {
                        sh """
                          kubectl rollout status deployment frontend-deployment -n ${NAMESPACE} --timeout=5m
                          kubectl rollout status deployment backend-deployment -n ${NAMESPACE} --timeout=5m
                        """
                    } else {
                        sh "kubectl rollout status deployment ${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=5m"
                    }
                }
                echo "RollBack Completed"
            }
        }

        stage('Verify Rollback') {
            steps {
                echo "Verifying Rollback"
                sh """
                  echo "Deployment Status"
                  kubectl get deployments -n ${NAMESPACE}
                  echo "Current Pod Status"
                  kubectl get pods -n ${NAMESPACE}
                """
            }
        }
    }
    post {
        success {
            echo "Rollback Success"
            def rollbackInfo = """
            =====================================
               Rollback Completed Successfully
            =====================================
            Deployment : ${params.DEPLOYMENT_NAME}
            Revision : ${params.REVISION}
            =====================================
            """
            echo rollbackInfo
        }

        failure {
            echo "RollBack Failed" 
            sh """
              kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp' | tail -30
            """
        }

        always {
            sh "kubectl get all -n ${NAMESPACE}"
        }
    }
}