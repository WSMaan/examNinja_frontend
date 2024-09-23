pipeline {
    agent any

    environment {
        // You can define any environment variables here if needed
        FRONTEND_DIR = './' // Adjust this if the Jenkinsfile is not in the root
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the frontend repository
                git 'https://github.com/WSMaan/examNinja_frontend'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir(FRONTEND_DIR) {
                    // Install npm dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir(FRONTEND_DIR) {
                    // Run tests using Jest or any other framework
                    sh 'npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    // Build the React application
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir(FRONTEND_DIR) {
                    // Build a Docker image for the frontend
                    sh 'docker build -t frontend-image:latest .'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                // Deploy the built image or push it to a registry like DockerHub
                echo 'Deploying frontend...'
                // Example: Push Docker image to DockerHub
                // sh 'docker push your-frontend-image:latest'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Frontend build succeeded!'
        }
        failure {
            echo 'Frontend build failed!'
        }
    }
}
