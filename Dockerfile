# Use Amazon Linux latest image
FROM public.ecr.aws/amazonlinux/amazonlinux:latest

# Install necessary tools
RUN yum -y update && \
    yum -y install git tar xz gcc-c++ make

# Install Node.js v20 (LTS)
RUN curl -fsSL https://nodejs.org/dist/v20.19.0/node-v20.19.0-linux-x64.tar.xz | tar -C /usr/local --strip-components=1 -xJf -

# Confirm Node.js installation
RUN node --version && npm --version

# Install Yarn
RUN npm install -g yarn

# Confirm Yarn installation
RUN yarn --version
