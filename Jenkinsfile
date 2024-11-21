pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        EKS_CLUSTER_NAME = "examninja"
        EKS_NAMESPACE = "default"
        BACKEND_IMAGE = "backend_latest"
        FRONTEND_IMAGE = "frontend_latest"
        BACKEND_DEPLOYMENT_FILE = "k8s/backend-deployment.yaml"
        FRONTEND_DEPLOYMENT_FILE = "k8s/frontend-deployment.yaml"
    }
    stages {
        stage('Setup AWS Credentials') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                    script {
                        env.AWS_ACCESS_KEY_ID = "${env.AWS_ACCESS_KEY_ID}"
                        env.AWS_SECRET_ACCESS_KEY = "${env.AWS_SECRET_ACCESS_KEY}"
                    }
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
        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    sh "docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_IMAGE} ."
                }
                dir('frontend') {
                    sh "docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_IMAGE} ."
                }
            }
        }
        stage('Push Docker Images to ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_IMAGE}"
                    sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_IMAGE}"
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                script {
                    sh "kubectl apply -f ${BACKEND_DEPLOYMENT_FILE}"
                    sh "kubectl apply -f ${FRONTEND_DEPLOYMENT_FILE}"
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
                echo "Pipeline failed. Please check the logs for details."
            }
        }
        success {
            echo "Pipeline succeeded! Application deployed to EKS."
        }
    }
}
