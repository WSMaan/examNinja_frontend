pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = ''
        AWS_SECRET_ACCESS_KEY = ''
        BACKEND_DIR = "backend" // Define the backend directory
        FRONTEND_DIR = "frontend" // Define the frontend directory
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
                // Configure kubectl for the EKS cluster
                sh 'aws eks --region ${AWS_REGION} update-kubeconfig --name examninja'

                // Deploy MySQL
                dir(BACKEND_DIR) {
                    sh 'kubectl apply -f k8s/mysql-deployment.yaml'
                }

                // Deploy Backend
                dir(BACKEND_DIR) {
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                }

                // Deploy Frontend
                dir(FRONTEND_DIR) {
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                }
            }
        }

        stage('Populate MySQL Database') {
            steps {
                script {
                    // Wait for MySQL pod to be ready
                    sh 'kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s'

                    // Copy and run SQL script inside MySQL pod
                    sh '''
                    MYSQL_POD=$(kubectl get pods -l app=mysql -o jsonpath="{.items[0].metadata.name}")
                    kubectl cp ${BACKEND_DIR}/init_data.sql $MYSQL_POD:/tmp/init_data.sql
                    kubectl exec -i $MYSQL_POD -- mysql -uroot -proot@123 exam_ninja < /tmp/init_data.sql
                    '''
                }
            }
        }
    }
}
