pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = "AKIAYPSFWECMLKSMLRD4" // Hardcoded Access Key ID
        AWS_SECRET_ACCESS_KEY = "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" // Hardcoded Secret Access Key
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
            post {
                failure {
                    script {
                        currentBuild.result = 'FAILURE'
                    }
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
            post {
                failure {
                    script {
                        currentBuild.result = 'FAILURE'
                    }
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
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
                sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
            }
        }

        // stage('Deploy to EKS') {
        //     steps {
        //         sh "aws eks --region ${AWS_REGION} update-kubeconfig --name examninja"
        //         dir('backend') {
        //             sh 'kubectl apply -f k8s/backend-deployment.yaml'
        //         }
        //         dir('frontend') {
        //             sh 'kubectl apply -f k8s/frontend-deployment.yaml'
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
                echo "Pipeline failed due to failure in the ${env.FAILURE_REASON} stage."
            }
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
