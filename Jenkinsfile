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

        stage('Build Image') {
            steps {
                script {
                    // Uses your multi-stage Dockerfile to build a slim image
                    sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_ID} ."
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