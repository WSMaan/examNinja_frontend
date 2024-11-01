pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = "AKIAYPSFWECMCWWFZS6K" // Your AWS Access Key ID
        AWS_SECRET_ACCESS_KEY = "uiz/zatExnwL3i6rbfO1hqHmYlgKlmCKFnw/yZp6" // Your AWS Secret Access Key
    }
    stages {
        stage('Clone Repositories') {
            steps {
                dir('backend') {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja-backend.git', credentialsId: 'GIT_HUB'
                }
                dir('frontend') {
                    git branch: 'master', url: 'https://github.com/WSMaan/examNinja_frontend.git', credentialsId: 'GIT_HUB'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean install'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest ."
                }
                dir('frontend') {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest ."
                }
            }
        }
        stage('Push Docker Images to ECR') {
            steps {
                script {
                    sh "export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}"
                    sh "export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                script {
                    // Configure kubectl to use the EKS cluster context
                    sh "aws eks update-kubeconfig --region ${AWS_REGION} --name examninja"
                    
                    // Apply backend deployment from the k8s directory in the backend repository
                    dir('backend/k8s') {
                        sh "kubectl apply -f backend-deployment.yaml"
                    }
                    
                    // Apply frontend deployment from the k8s directory in the frontend repository
                    dir('frontend/k8s') {
                        sh "kubectl apply -f frontend-deployment.yaml"
                    }
                    
                    // Optionally, deploy MySQL if needed
                    sh "kubectl apply -f mysql-deployment.yaml"
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
