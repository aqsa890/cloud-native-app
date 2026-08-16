pipeline {
    agent { label 'dev' }

    environment {
        CGO_ENABLED = '0'
    }

    stages {

        stage('Cloning Code') {
            steps {
                echo 'Cloning the Cloud-Native-App'

                git(
                    url: 'https://github.com/aqsa890/cloud-native-app.git',
                    branch: 'main'
                )
            }
        }

        stage('Gitleaks Scan') {
            steps {
                echo 'Running Gitleaks secret scan...'

                sh '''
                    gitleaks detect \
                        --source . \
                --report-format sarif \
                --report-path gitleaks-report.sarif \
                --verbose
        '''
            }
        }

        stage('Lint & Test JavaScript') {
            parallel {

                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm install
                                npm run lint
                                npm test
                            '''
                        }
                    }
                }

                stage('Gateway') {
                    steps {
                        dir('gateway') {
                            sh '''
                                npm install
                                npm run lint
                                npm test
                            '''
                        }
                    }
                }

                stage('Payment Service') {
                    steps {
                        dir('services/payment-service') {
                            sh '''
                                npm install
                                npm run lint
                                npm test
                            '''
                        }
                    }
                }
            }
        }

        stage('Lint & Test Go') {
            steps {
                dir('services/auth-service') {
                    sh '''
                        go mod download
                        go vet ./...
                        go test ./...
                    '''
                }
            }
        }

        stage('Lint & Test Python') {
            steps {
                dir('services/product-service') {
                    sh '''
                        python3 -m venv .venv
                        . .venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                        PYTHONPATH=. pylint app/
                        PYTHONPATH=. pytest
                    '''
                }
            }
        }

        stage('SCA Check') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm audit --json > npm-audit-report.json || true
                            '''
                        }
                    }
                }

                stage('Gateway') {
                    steps {
                        dir('gateway') {
                            sh '''
                                npm audit --json > npm-audit-report.json || true
                            '''
                        }
                    }
                }

                stage('Payment Service') {
                    steps {
                        dir('services/payment-service') {
                            sh '''
                                npm audit --json > npm-audit-report.json || true
                            '''
                        }
                    }
                }

                stage('Auth Service') {
                    steps {
                        dir('services/auth-service') {
                            catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                                sh '''
                                    go install golang.org/x/vuln/cmd/govulncheck@latest
                                    export PATH=$PATH:$(go env GOPATH)/bin
                                    govulncheck -json ./... > govulncheck-report.json
                                '''
                            }
                            sh '''
                                export PATH=$PATH:$(go env GOPATH)/bin
                                echo "=== govulncheck summary ==="
                                govulncheck ./... || true
                            '''
                        }
                    }
                }

                stage('Product Service') {
                    steps {
                        dir('services/product-service') {
                            sh '''
                                python3 -m venv .venv-sca
                                . .venv-sca/bin/activate

                                python -m pip install --upgrade pip
                                python -m pip install pip-audit

                                pip-audit
                            '''
                        }
                    }
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh "${tool('sonarqube-server')}/bin/sonar-scanner"
                }
            }
        }

        // Quality Gate — waits for SonarQube webhook to report pass/fail
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Hadolint'){
            steps{
                dir('services/auth-service'){
                    sh '''
                        docker run --rm -i hadolint/hadolint < Dockerfile
                    '''
                }
                dir('services/payment-service'){
                    sh '''
                        docker run --rm -i hadolint/hadolint < Dockerfile
                    '''
                }
                dir('services/product-service'){
                    sh '''
                        docker run --rm -i hadolint/hadolint < Dockerfile
                    '''
                }
                dir('gateway'){
                    sh '''
                        docker run --rm -i hadolint/hadolint < Dockerfile
                    '''
                }
                dir('frontend'){
                    sh '''
                        docker run --rm -i hadolint/hadolint < Dockerfile
                    '''
                }
            }
        }

        stage('Docker Build'){
            steps{
                dir('services/auth-service'){
                    sh '''
                        docker build -t cloud-app-auth-service:v1.0.0 .
                    '''
                }
                dir('services/payment-service'){
                    sh '''
                        docker build -t cloud-app-payment-service:v1.0.0 .
                    '''
                }
                dir('services/product-service'){
                    sh '''
                        docker build -t cloud-app-product-service:v1.0.0 .
                    '''
                }
                dir('gateway'){
                    sh '''
                        docker build -t cloud-app-gateway:v1.0.0 .
                    '''
                }
                dir('frontend'){
                    sh '''
                        docker build -t cloud-app-frontend:v1.0.0 .
                    '''
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress cloud-app-auth-service:v1.0.0 || true
                    trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress cloud-app-payment-service:v1.0.0 || true
                    trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress cloud-app-product-service:v1.0.0 || true
                    trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress cloud-app-gateway:v1.0.0 || true
                    trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress cloud-app-frontend:v1.0.0 || true
                '''
            }
        }

        stage('Pushing Docker Image to Docker Hub'){
            steps{
                echo "Pushing image"

                withCredentials([
                    usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable: "dockerHubPass",
                        usernameVariable: "dockerHubUser"
                    )
                ]){
                    sh '''
                        docker login -u $dockerHubUser -p $dockerHubPass
                        docker image tag cloud-app-frontend:v1.0.0 $dockerHubUser/cloud-app-frontend:v1.0.0
                        docker image tag cloud-app-gateway:v1.0.0 $dockerHubUser/cloud-app-gateway:v1.0.0
                        docker image tag cloud-app-product-service:v1.0.0 $dockerHubUser/cloud-app-product-service:v1.0.0
                        docker image tag cloud-app-payment-service:v1.0.0 $dockerHubUser/cloud-app-payment-service:v1.0.0
                        docker image tag cloud-app-auth-service:v1.0.0 $dockerHubUser/cloud-app-auth-service:v1.0.0

                        docker push $dockerHubUser/cloud-app-frontend:v1.0.0
                        docker push $dockerHubUser/cloud-app-gateway:v1.0.0
                        docker push $dockerHubUser/cloud-app-product-service:v1.0.0
                        docker push $dockerHubUser/cloud-app-payment-service:v1.0.0
                        docker push $dockerHubUser/cloud-app-auth-service:v1.0.0
                    '''
                }               
            }
        }

        stage('Deployment Stage'){
            steps{
                sh '''
                    # Ensure .env exists
                    if [ ! -f .env ]; then
                        cp .env.example .env
                    fi

                    # Deploy and recreate containers
                    docker compose up -d --remove-orphans --force-recreate

                    # Display running container status
                    sleep 10
                    docker compose ps
                '''
            }
        }

        post {

        success {
            script {
                emailext(
                    from: 'cutilicious1947@gmail.com',
                    to: 'rkkhan0750@gmail.com',
                    subject: "SUCCESS: Cloud Native App CI/CD Pipeline - Build #${BUILD_NUMBER}",
                    body: """
                            Hello,

                            The Cloud Native App CI/CD pipeline has completed successfully.

                            Build Details:
                            ------------------------------
                            Project     : Cloud Native App
                            Build No.   : #${BUILD_NUMBER}
                            Status      : SUCCESS
                            Branch      : ${env.GIT_BRANCH}
                            Commit      : ${env.GIT_COMMIT}
                            Job         : ${env.JOB_NAME}
                            Build URL   : ${env.BUILD_URL}

                            The application was successfully built, tested, pushed to Docker Hub,
                            and deployed successfully.

                            Regards,
                            Jenkins CI/CD Pipeline
                            """.stripIndent()
                     )
                 }
            }
        }
    }
}
