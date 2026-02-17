pipeline {
    agent any
    environment {
        // Update this path if your Docker bin is located elsewhere
        DOCKER_BIN = 'C:\\Program Files\\Docker\\Docker\\resources\\bin'
    }
    stages {
        stage('Cleanup') {
            steps {
                // Remove the conflicting mongo-ui container before building
                bat "\"${env.DOCKER_BIN}\\docker.exe\" rm -f mongo-ui || exit 0"
            }
        }
        stage('Build & Deploy') {
            steps {
                // Build the image and restart the stack
                bat "\"${env.DOCKER_BIN}\\docker-compose.exe\" up -d --build"
            }
        }
        stage('Verify') {
            steps {
                bat "\"${env.DOCKER_BIN}\\docker.exe\" ps"
            }
        }
    }
}