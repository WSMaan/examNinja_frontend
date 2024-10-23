pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        SONAR_TOKEN = credentials('JENKINS_SONAR') // SonarQube token credential
        AWS_ACCESS_KEY_ID = "AKIAYPSFWECMLKSMLRD4" // Hardcoded AWS Access Key
        AWS_SECRET_ACCESS_KEY = "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" // Hardcoded AWS Secret Key

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
        // stage('SonarQube Analysis') {
        //     steps {
        //         withSonarQubeEnv('SQ1') {
        //             dir('backend') {
        //                 sh """
        //                 mvn clean install
        //                 mvn org.jacoco:jacoco-maven-plugin:prepare-agent install
        //                 mvn org.sonarsource.scanner.maven:sonar-maven-plugin:3.9.0.2155:sonar \
        //                 -Dsonar.projectKey=examNinja-backend \
        //                 -Dsonar.sources=src \
        //                 -Dsonar.java.binaries=target/classes \
        //                 -Dsonar.exclusions=**/src/test/** \
        //                 -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
        //                 """
        //             }
        //         }
        //     }
        // }
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
                    // Set AWS credentials for the AWS CLI
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
                // Ensure kubectl is configured for your EKS cluster
                sh 'aws eks --region ${AWS_REGION} update-kubeconfig --name examninja' // Change 'my-cluster' to your cluster name
                // Apply Kubernetes deployment files
                dir(BACKEND_DIR) {
                    sh 'kubectl apply -f k8s/backend-deployment.yaml' // Ensure your backend deployment file is correctly defined
                }
                dir(FRONTEND_DIR) {
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml' // Ensure your frontend deployment file is correctly defined
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
                echo "Pipeline failed due to failure in the ${env.FAILURE_REASON} stage."
            }
        }
        success {
            script {
                echo 'Pipeline succeeded!'
            }
        }
    }
}
