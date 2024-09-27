pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = 'AKIAYPSFWECMLX2AHZDE'
        AWS_SECRET_ACCESS_KEY = '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'
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }
    stages {
        stage('Clone Repositories') {
            steps {
                dir(BACKEND_DIR) {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja-backend.git', credentialsId: 'demo_github_token'
                }
                dir(FRONTEND_DIR) {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja_frontend.git', credentialsId: 'demo_github_token'
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
        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm install'
                    sh 'npm run build'
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


