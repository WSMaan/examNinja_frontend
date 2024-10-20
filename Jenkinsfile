pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        AWS_ACCESS_KEY_ID = "AKIAYPSFWECMLKSMLRD4" // Hardcoded Access Key ID
        AWS_SECRET_ACCESS_KEY = "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" // Hardcoded Secret Access Key
        SONAR_TOKEN = credentials('JENKINS_SONAR') // SonarQube token credential
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
                    sh 'mvn clean install' // Using installed Maven
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SQ1') {
                    dir('backend') {
                        sh 'mvn clean org.sonarsource.scanner.maven:sonar-maven-plugin:3.9.0.2155:sonar -Dsonar.projectKey=examNinja-backend -Dsonar.sources=src'
                    }
                    dir('frontend') {
                        sh 'mvn clean org.sonarsource.scanner.maven:sonar-maven-plugin:3.9.0.2155:sonar -Dsonar.projectKey=examNinja-frontend -Dsonar.sources=src'
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

        // Commented out the push to ECR stage
        // stage('Push Docker Images to ECR') {
        //     steps {
        //         sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
        //         sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend_latest"
        //         sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend_latest"
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
                // Commented out email notification
                // emailext (
                //     to: 'wsmaan896@gmail.com',
                //     subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                //     body: """<h1>Build Failed</h1>
                //               <p>Pipeline failed in the ${env.FAILURE_REASON} stage. Please check the console output at <a href="${env.RUN_DISPLAY_URL}">${env.RUN_DISPLAY_URL}</a>.</p>
                //            """,
                //     mimeType: 'text/html'
                // )
            }
        }
        success {
            script {
                echo 'Pipeline succeeded!'
                // Commented out email notification
                // emailext (
                //     to: 'wsmaan896@gmail.com',
                //     subject: "Build Succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                //     body: """<h1>Build Succeeded</h1>
                //               <p>The pipeline has completed successfully. You can view the results at <a href="${env.RUN_DISPLAY_URL}">${env.RUN_DISPLAY_URL}</a>.</p>
                //            """,
                //     mimeType: 'text/html'
                // )
            }
        }
    }
}
