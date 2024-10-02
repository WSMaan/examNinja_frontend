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
        FAILURE_REASON = ''  // To capture failure reason
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
            post {
                failure {
                    script {
                        env.FAILURE_REASON = 'backend'
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
            post {
                failure {
                    script {
                        env.FAILURE_REASON = 'frontend'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir(BACKEND_DIR) {
                    sh 'docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest .'
                }
                dir(FRONTEND_DIR) {
                    sh 'docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest .'
                }
            }
        }

        stage('Push Docker Images to ECR') {
            steps {
                sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}'
                sh 'docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest'
                sh 'docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            script {
                echo "Pipeline failed due to failure in the ${env.FAILURE_REASON} stage."
            }
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
