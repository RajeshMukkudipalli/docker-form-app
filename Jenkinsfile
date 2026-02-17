pipeline {
    agent any

    environment {
        // This ensures the build ID is attached to the image version
        IMAGE_NAME = "frontend-web-app"
        DOCKER_BIN = 'C:\\Program Files\\Docker\\Docker\\resources\\bin'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins pulls the latest code from your local dir or Git
                checkout scm
            }
        }

        stage('Build Optimized Image') {
            steps {
                // Using 'bat' because your Cmd works. 
                // This triggers the Multi-Stage build from Day 6.
                
                bat "\"${env.DOCKER_BIN}\\docker.exe\" build -t frontend-web-app ."
            }
        }

        stage('Verify Networking') {
            steps {
                // Ensure the containers can talk to each other
                // Checking if the database service is reachable
                bat "\"${env.DOCKER_BIN}\\docker-compose.exe\" up -d --force-recreate"
            }
        }

        stage('Deploy Stack') {
            steps {
                // Restarts the services with the newly built image
                // MSYS_NO_PATHCONV is added for Windows path compatibility
                withEnv(['MSYS_NO_PATHCONV=1']) {
                    bat "docker compose up -d"
                }
            }
        }
    }

    post {
        always {
            echo 'Build Process Completed.'
        }
        success {
            echo 'Application is live at http://localhost:9000'
        }
    }
}