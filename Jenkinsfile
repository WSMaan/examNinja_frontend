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
        SONAR_HOST_URL = 'http://your-sonarqube-server:9000'
        SONARQUBE_AUTH_TOKEN = 'squ_c95f2edcb05867250d239028b6261ec68c12bae2' // Replace with your SonarQube token
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
                            sh "sonar-scanner -Dsonar.projectKey=frontend_project -Dsonar.sources=. -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONARQUBE_AUTH_TOKEN}"
                        }
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                dir(BACKEND_DIR) {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest ."
                }
                dir(FRONTEND_DIR) {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest ."
                }
            }
        }
        stage('Push Docker Images to ECR') {
            steps {
                script {
                    sh """
                        aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                        aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
                }
            }
        }
        stage('Deploy to Docker') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
                }
            }
        }
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
