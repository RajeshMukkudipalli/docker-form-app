pipeline {
    agent any 

    environment {
        DOCKER_IMAGE = "my-form-app"
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins pulls your code from Git
                checkout scm
            }
        }

        // Updated for Windows Jenkins  
        stage('Build Image') {
            steps {
                script {
                // Use 'bat' instead of 'sh' for Windows
                bat "docker build -t ${DOCKER_IMAGE}:%BUILD_ID% ."
                }
            }
        }

        stage('Test & Verify') {
            steps {
                script {
                    // Check if the image exists and run a basic health check
                    sh "docker images | grep ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy (Optional)') {
            steps {
                // In a real setup, this would push to Docker Hub or restart Compose
                sh "docker compose up -d --build"
            }
        }
    }
}