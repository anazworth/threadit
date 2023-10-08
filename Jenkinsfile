pipeline {
    agent any

    stages {
      stage('Build') {
          failFast false
          parallel {
              stage('Auth-Service Build') {
                  when {
                      changeset "AuthService/**"
                  }
                  steps {
                      dir('AuthService') {
                        sh './gradlew build'
                      }
                  }
                }
            }
      }
      stage('Test') {
          failFast false
          parallel {
              stage('Auth-Service Test') {
                  when {
                      changeset "AuthService/**"
                  }
                  steps {
                      dir('AuthService') {
                        sh './gradlew test'
                      }
                  }
                }

                stage('Krakend Test') {
                    when {
                        changeset "krakend/**"
                    }
                    steps {
                        sh 'docker run -v krakend:/etc/krakend/ devopsfaith/krakend check -tlc krakend.json'
                    }
                  }
            }
      }
      stage('Push to Registry') {
          failFast false
          parallel {
              stage('Auth-Service Push') {
                  when {
                      changeset "AuthService/**"
                  }
                  environment {
                      DOCKER_REGISTRY = credentials('DockerHub')
                  }
                  steps {
                      dir('AuthService') {
                        sh './gradlew bootBuildImage --imageName=anazworth/auth-service:latest'
                        sh 'echo $DOCKER_REGISTRY_PSW | sudo docker login -u $DOCKER_REGISTRY_USR --password-stdin'
                        sh 'docker push anazworth/auth-service:latest'
                      }
                  }
                }
          }
      }
    }
}
