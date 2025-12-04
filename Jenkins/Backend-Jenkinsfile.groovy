pipeline {
    agent {
        lable 'docker-builder'
    }

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS = 'dockerhub-crdentials'
        DOCKER_IMAGE = "${DOCKER_USERNAME}/coding-cloud-backend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }

    parameters {
        string(name: 'DOCKER_USERNAME', defaultValue: 'pritam44'),
        string(name: 'GIT_BRANCH', defaultvalue: 'main')
    }

    stages {
        stage('Checkout Backend SRC') {
            steps {
                echo "Checking out Backend Code"
                git branch: "${params.GIT_BRANCH}"
                  url: 'https://github.com/pritz45/DevOps-Project.git'
                echo "Checkout Completed"
            }
        }

        stage('Building Backend Image') {
            steps {
                dir('backend') {
                    echo "Building Backend Images"
                    sh """
                      docker build -t ${DOCKER_IMAGE}:latest
                      docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    """
                    echo "Backend Images Built Successfully"
                }
            }
        }

        stage('Testing Backend Image') {
            steps {
                echo "Testing Backend Image"
                sh """
                  docker images | grep ${DOCKER_IMAGE}:${BUILD_NUMBER}
                  docker run --rm -d --name backend-test-${BUILD_NUMBER} ${DOCKER_IMAGE}:${BUILD_NUMBER}
                  sleep 10
                  docker exec backend-test-${BUILD_NUMBER} curl -f http://localhost:5000/health
                  docker stop backend-test-${BUILD_NUMBER}
                """
                echo "Backend Image Test Passed"
            }
        }

        stage('Push to Dockerhub') {
            steps {
                echo "Pushing Backend Image to Dockerhub"
                docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS}") {
                  docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                  docker push ${DOCKER_IMAGE}:latest 
                }
                echo "Backend Image Pushed Successfully"
            }
        }

        stage('Trigger Deploy Job') {
            steps {
                echo "Backend Build Complete --- Triggering Deploy Job"
                // image info for deployment job
                env.BACKEND_IMAGE_TAG = "${BUILD_NUMBER}"
                
                // Trigger Deploy Job
                build job: 'Deploy-to-K8s'
                  wait: false,
                  parameters {
                    string(name: 'BACKEND_IMAGE_TAG', value: "${BUILD_NUMBER}"),
                    string(name: 'TRIGGERED_BY', value: 'Build-Backend')
                  }
            }
        }
    }
    post {
        success {
            echo "Backend Build Success"
            echo "Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }

        failure {
            echo "Backend Build Failed"
        }
        
        always {
            echo "Cleaning Up Images"
            sh 'docker image prune -f'
            cleanWs()
            echo "Cleaning Up Completed"
        }
    }
}