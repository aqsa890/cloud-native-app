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
    }
}