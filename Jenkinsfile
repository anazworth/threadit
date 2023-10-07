pipeline {
    agent any

    stages {
      stage('Build') {
          failFast false
          parallel {
              stage('Auth-Service') {
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
          steps {
              echo 'Testing..'
          }
      }
      stage('Deploy') {
          steps {
              echo 'Deploying....'
          }
      }
    }
}
