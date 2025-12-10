pipeline {
    agent {
        label 'docker-builder'
    }

    environment {
        DOCKER_REGISTRY = 'index.docker.io/v1/'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE = "${DOCKER_USERNAME}/coding-cloud-frontend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    parameters {
        string(name: 'DOCKER_USERNAME', defaultValue: 'pritam44')
        string(name: 'GIT_BRANCH', defaultValue: 'master')
    }

    stages {
        stage('Checkout Frontend SRC') {
            steps {
                echo "Checking Out Frontend Code"
                git branch: "${params.GIT_BRANCH}",
                  url: 'https://github.com/pritz45/DevOps-Project.git'
                echo "Checkout Completed"   
            }
        }
    

        stage('Building Frontend Image') {
            steps {
                dir('frontend') {
                    echo "Building Frontend Images"
                    sh """
                       docker build -t ${DOCKER_IMAGE}:latest .
                       docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    """
                    echo "Frontend Images Built Successfully"
                }
            }
        }

        stage('Testing Frontend Image') {
            steps {
                echo "Testing Frontend Image"
                sh """
                   docker images | grep ${DOCKER_IMAGE}
                   docker run --rm -d --name frontend-test-${BUILD_NUMBER} ${DOCKER_IMAGE}:${BUILD_NUMBER}
                   sleep 5
                   docker exec frontend-test-${BUILD_NUMBER} curl -f http://localhost:80
                   docker stop frontend-test-${BUILD_NUMBER}
                """
                echo "Frontend Image Test Passed"
            }
        }

        stage('Push to Dockerhub') {
            steps {
                  script{
                    echo "Pushing Frontend Image to Dockerhub"
                    docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                    sh """
                      docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                      docker push ${DOCKER_IMAGE}:latest
                    """
                   echo "Frontend Image Pushed Successfully"
                   }
                }
            }
        }

        stage('Trigger Deploy Job') {
            steps {
                echo "Frontend Build Complete --- Triggering Deploy Job"
                script {
                    // image info for deployment job
                    env.FRONTEND_IMAGE_TAG = "${BUILD_NUMBER}"

                    // Trigger Deploy Job
                    build job: 'Deploy-to-K8s',
                       wait: false,
                       parameters: [
                        string(name: 'FRONTEND_IMAGE_TAG', value: "${BUILD_NUMBER}"),
                        string(name: 'TRIGGERED_BY', value: 'Build-Frontend')
                       ]
                }
            }
        }
    }
    post {
        success {
            echo "Frontend Build Success"
            echo "Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }
        
        failure {
            echo "Frontend Build Failed"
        }

        always {
            echo "Cleaning Up Images"
            sh 'docker image prune -a -f'
            cleanWs()
            echo "Cleaning Up Completed"
        }
    }
}