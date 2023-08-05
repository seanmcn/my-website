FROM public.ecr.aws/amazonlinux/amazonlinux:latest

# Install git and tar
RUN dnf install -y git tar

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Install Node.js 18.17.0
RUN . $HOME/.nvm/nvm.sh && \
    nvm install 18.17.0 && \
    nvm use 18.17.0 && \
    nvm alias default 18.17.0

# Add Node.js and npm to PATH
ENV PATH $HOME/.nvm/versions/node/v18.17.0/bin:$PATH

# Install Yarn
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo && \
    dnf install -y yarn