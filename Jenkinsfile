pipeline {
    agent { label 'dev' }

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

        stage('Lint JavaScript') {
            parallel {

                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm install
                                npm run lint
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
                            '''
                        }
                    }
                }
            }
        }

        stage('Lint Go') {
            steps {
                dir('services/auth-service') {
                    sh '''
                        go mod download
                        go vet ./...
                    '''
                }
            }
        }

        stage('Lint Python') {
            steps {
                dir('services/product-service') {
                    sh '''
                        python3 -m pip install --upgrade pip
                        python3 -m pip install -r requirements.txt
                        PYTHONPATH=. pylint app/
                    '''
                }
            }
        }
    }
}