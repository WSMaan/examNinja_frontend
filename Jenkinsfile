pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
    }
    stages {
        stage('Setup AWS Registry') {
            steps {
                script {
                    env.ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                }
            }
        }
        stage('Setup AWS Credentials') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                    echo 'AWS Credentials configured'
                }
            }
        }
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
      stage('Push Docker Images to ECR and Deploy to EKS') {
    steps {
        script {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                // Log in to ECR and push Docker images
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
            }
            
            // Configure kubectl for the EKS cluster
            sh "aws eks --region ${AWS_REGION} update-kubeconfig --name examninja"

            // Deploy backend and MySQL to EKS
            dir('backend') {
                sh 'kubectl apply -f k8s/backend-deployment.yaml'
                sh 'kubectl apply -f k8s/mysql-deployment.yaml'
            }
            
            // Deploy frontend to EKS
            dir('frontend') {
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }
    }
}

    }
    post {
        always {
            cleanWs()
        }
        failure {
            script {
                echo "Pipeline failed in stage: ${env.STAGE_NAME}"
            }
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
