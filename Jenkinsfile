pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = 'AKIAYPSFWECMD3WWZN7R'
        AWS_SECRET_ACCESS_KEY = 'AKIAYPSFWECMD3WWZN7R'
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
        SONAR_HOST_URL = 'http://your-sonarqube-server:9000'  // Replace with your SonarQube URL
        SONARQUBE_AUTH_TOKEN = 'squ_c95f2edcb05867250d239028b6261ec68c12bae2'  // Replace with your SonarQube token directly
    }
    stages {
        stage('Clone Repositories') {
            steps {
                dir(BACKEND_DIR) {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja-backend.git', credentialsId: 'GIT_HUB'
                }
                dir(FRONTEND_DIR) {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja_frontend.git', credentialsId: 'GIT_HUB'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    sh 'mvn clean install'
                }
            }
        }

        stage('SonarQube Backend Analysis') {
            steps {
                dir(BACKEND_DIR) {
                    script {
                        withSonarQubeEnv('SonarQube') {
                            sh "mvn sonar:sonar -Dsonar.projectKey=backend_project -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONARQUBE_AUTH_TOKEN}"
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Frontend Analysis') {
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        withSonarQubeEnv('SonarQube') {
                            def scannerHome = tool 'SonarQubeScanner'  // Reference the SonarQube Scanner installed in Jenkins
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=frontend_project -Dsonar.sources=. -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONARQUBE_AUTH_TOKEN}"
                        }
                    }
                }
            }
        }

        // ... remaining stages (Build Docker Images, Push Docker Images to ECR, Deploy to Docker)
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
