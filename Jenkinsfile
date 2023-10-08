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
                  steps {
                      dir('AuthService') {
                        sh './gradlew bootBuildImage --imageName=anazworth/auth-service:latest'
                        docker.withRegistry("docker.io") {
                          sh 'docker push anazworth/auth-service:latest'
                        }
                      }
                  }
                }
          }
      }
    }
}
