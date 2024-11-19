pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
        ECS_CLUSTER = "Examninja"
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
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
                }
            }
        }
        // stage('Deploy to ECS') {
        //     steps {
        //         script {
        //             // Update ECS services
        //             sh """
        //             aws ecs update-service --cluster ${ECS_CLUSTER} \
        //                 --service backend-service \
        //                 --force-new-deployment

        //             aws ecs update-service --cluster ${ECS_CLUSTER} \
        //                 --service frontend-service \
        //                 --force-new-deployment
        //             """
        //         }
        //     }
        // }
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
            echo "Pipeline succeeded! Docker images are deployed to ECS."
        }
    }
}
