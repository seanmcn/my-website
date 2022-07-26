---
title: "Gitlab CI - Commit & Push in a Job"
date: "2022-07-26T22:01:00.000Z"  
slug: "2022/07/gitlab-ci-commit-and-push-in-job"  
category: "workflow-&-tools"  
tags: ["programming", "gitlab", "ci"]  
keywords: ["gitlab", "continuous integration", "gitlab ci", "gitlab runner"]
---
Recently I needed to make a GitLab CI job where when a merge to master occurs, it runs a bash script, commits the files & pushes them back to master. I needed this to build a change log out of separate files, and now I have it working; it feels like a helpful thing to share how to do.

## Get SSH fingerprint
You're going to need the SSH fingerprint of your GitLab instance. If you don't know this, you can get it by running the following command:

`ssh-keyscan yourinstance.gitlab.com`

```text
# gitlab.com:22 SSH-2.0-GitLab-SSHD
gitlab.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsj2bNKTBSpIYDEGk9KxsGh3mySTRgMtXL583qmBpzeQ+jqCMRgBqB98u3z++J1sKlXHWfM9dyhSevkMwSbhoR8XIq/U0tCNyokEi/ueaBMCvbcTHhO7FcwzY92WK4Yt0aGROY5qX2UKSeOvuP4D6TPqKF1onrSzH9bx9XUf2lEdWT/ia1NEKjunUqu1xOB/StKDHMoX4/OKyIzuS0q/T1zOATthvasJFoPrAjkohTyaDUz2LN5JoH839hViyEG82yB+MjcFV5MU3N1l1QL3cVUCh93xSaua1N85qivl+siMkPGbO5xR/En4iEY6K2XPASUEMaieWVNTRCtJ4S8H+9
# gitlab.com:22 SSH-2.0-GitLab-SSHD
gitlab.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFSMqzJeV9rUzU4kWitGjeR4PWSa29SPqJ1fVkhtj3Hw9xjLVXVYrU9QlYWrOLXBpQ6KWjbjTDTdDkoohFzgbEY=
# gitlab.com:22 SSH-2.0-GitLab-SSHD
gitlab.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAfuCHKVTjquxvt6CM6tdG4SLp1Btn/nOeHHE5UOzRdf
```

You only want the line that contains *ssh-rsa*, so for instance from above:
```text
gitlab.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsj2bNKTBSpIYDEGk9KxsGh3mySTRgMtXL583qmBpzeQ+jqCMRgBqB98u3z++J1sKlXHWfM9dyhSevkMwSbhoR8XIq/U0tCNyokEi/ueaBMCvbcTHhO7FcwzY92WK4Yt0aGROY5qX2UKSeOvuP4D6TPqKF1onrSzH9bx9XUf2lEdWT/ia1NEKjunUqu1xOB/StKDHMoX4/OKyIzuS0q/T1zOATthvasJFoPrAjkohTyaDUz2LN5JoH839hViyEG82yB+MjcFV5MU3N1l1QL3cVUCh93xSaua1N85qivl+siMkPGbO5xR/En4iEY6K2XPASUEMaieWVNTRCtJ4S8H+9
```

## Setup

- [Generate a SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key), doesn't matter where, as you just want the contents of it.
- Add the public part of the key as a [Project Deploy Key](https://docs.gitlab.com/ee/user/project/deploy_keys/#project-deploy-keys) and grant it write access.
- Create a project [CI/CD variable](https://git.kobas.co.uk/help/ci/variables/index) called `SSH_PUSH_KEY` and add the private part of your key as the value.
- Create a project [CI/CD variable](https://git.kobas.co.uk/help/ci/variables/index) called `CI_KNOWN_HOSTS` and add the SSH fingerprint of your GitLab instance as the value.




## GitLab CI config

You'll then need to add a job to your `.gitlab-ci.yml` file like so:
```yaml
build_and_commit_files:
stage: build
rules:
- if: $CI_COMMIT_BRANCH == "master" && $CI_PIPELINE_SOURCE == "push"
    when: always"
- when: never
before_script:
- mkdir ~/.ssh/
- echo "${CI_KNOWN_HOSTS}" > ~/.ssh/known_hosts
- echo "${SSH_PUSH_KEY}" > ~/.ssh/id_rsa
- chmod 600 ~/.ssh/id_rsa
- git config user.email "gitlab@yourinstance.gitlab.com"
- git config user.name "GitLab"
- git remote remove ssh_origin || true  # May not have origin yet
- git remote add ssh_origin "git@$CI_SERVER_HOST:$CI_PROJECT_PATH.git"
script:
- touch example.txt # Or any command to change files
- git add -A && git commit -m 'Commit message' || true # May not have files to commit
- git push ssh_origin HEAD:master || true # May not have any commits to push
```

The above will commit & push to `master`, if you want to push to the current branch you should use `$CI_BUILD_REF_NAME`