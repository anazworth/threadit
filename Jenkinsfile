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
                    //when {
                     //   changeset "Krakend/**"
                    //}
                    agent {}
                        docker {
                            image 'devopsfaith/krakend:latest'
                            args '-v /krakend/:/etc/krakend'
                        }
                    steps {
                        check '-tlc krakend.json'
                    }
                  }
            }
      }
      stage('Deploy') {
          steps {
              echo 'Deploying....'
          }
      }
    }
}
