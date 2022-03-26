pipeline {
  agent {
    label 'freebsd&&nodejs'
  }

  environment {
    NEXUS = "https://colossus.kruemel.home/nexus/"
    REPOSITORY = "repository/memberberry-web-raw"
    VERSION = sh returnStdout: true, script: 'jq -r .version package.json | tr -d \'\\n\''
  }

  triggers {
    cron '@daily'
  }

  options {
    ansiColor('xterm')
    timestamps()
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '15')
    disableConcurrentBuilds()
  }

  stages {
    stage('install packages') {
      steps {
        configFileProvider([configFile(fileId: 'a7bcaf1c-8a86-4633-bc22-2755c797b0fa', targetLocation: '.npmrc')]) {
          sh 'npm install'
        }
      }
    }

    stage('build') {
      steps {
        sh 'npm run-script build'
      }
    }

    stage('verify version') {
      when {
        branch "main"
        not {
          triggeredBy "TimerTrigger"
        }
      }

      steps {
        withCredentials([usernameColonPassword(credentialsId: '4395eb59-c7bc-47b6-95c5-6795d8fb7f0b', variable: 'CREDENTIALS')]) {
          sh '''
if curl -f -k -u "$CREDENTIALS" -I "${NEXUS}${REPOSITORY}/${VERSION}/meberberry-web-${VERSION}.tar.gz" >/dev/null
then
  echo "### Version ${VERSION} already exists in repository" >&2
  exit 1
else
  echo "Version ${VERSION} not found in repository. Good!"
fi
'''
        }
      }
    }

    stage('publish to repo') {
      when {
        branch "main"
        not {
          triggeredBy "TimerTrigger"
        }
      }

      steps {
        sh 'tar -C dist/meberberry-web -cvzf meberberry-web-${VERSION}.tar.gz .'

        withCredentials([usernameColonPassword(credentialsId: '4395eb59-c7bc-47b6-95c5-6795d8fb7f0b', variable: 'CREDENTIALS')]) {
          sh 'curl -k -u "$CREDENTIALS" --upload-file meberberry-web-${VERSION}.tar.gz "${NEXUS}${REPOSITORY}/${VERSION}/"'
        }
      }
    }

    stage('deploy') {
      when {
        branch "main"
        not {
          triggeredBy "TimerTrigger"
        }
      }

      steps {
        script {
          def version = env.VERSION
          step([$class                 : "RundeckNotifier",
                includeRundeckLogs     : true,
                jobId                  : "8156a78b-2908-4a96-8a2d-1d071c1e92c5",
                options                : "version=$version",
                rundeckInstance        : "gizmo",
                shouldFailTheBuild     : true,
                shouldWaitForRundeckJob: true,
                tailLog                : true])
        }
      }
    }
  }

  post {
    unsuccessful {
      mail to: "rafi@guengel.ch",
        subject: "${JOB_NAME} (${BRANCH_NAME};${env.BUILD_DISPLAY_NAME}) -- ${currentBuild.currentResult}",
        body: "Refer to ${currentBuild.absoluteUrl}"
    }
  }
}
