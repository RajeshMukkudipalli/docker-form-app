pipeline {
    agent any

    environment {
        // This ensures the build ID is attached to the image version
        IMAGE_NAME = "frontend-web-app"
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
                bat "docker build -t %IMAGE_NAME%:%BUILD_ID% ."
                bat "docker tag %IMAGE_NAME%:%BUILD_ID% %IMAGE_NAME%:latest"
            }
        }

        stage('Verify Networking') {
            steps {
                // Ensure the containers can talk to each other
                // Checking if the database service is reachable
                bat "docker compose ps"
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