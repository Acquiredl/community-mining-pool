# Use a lightweight Debian Linux base
FROM debian:stable-slim

# The Official Ravencoin Version
ARG RAVEN_VERSION=4.6.1

# 1. Install necessary tools
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    && rm -rf /var/lib/apt/lists/*

# 2. Download and Install Ravencoin (Fixed URL for v4.6.1)
# Note: v4.6.1 has a unique filename including the commit hash '7864c39c2'
RUN wget https://github.com/RavenProject/Ravencoin/releases/download/v${RAVEN_VERSION}/raven-${RAVEN_VERSION}-7864c39c2-x86_64-linux-gnu.tar.gz \
    && tar -xzvf raven-${RAVEN_VERSION}-7864c39c2-x86_64-linux-gnu.tar.gz \
    && cp raven-*/bin/* /usr/local/bin/ \
    && rm -rf raven-*

# 3. Create a safe user (don't run as root)
RUN useradd -m -u 1000 raven
USER raven
WORKDIR /home/raven

# 4. Create the data directory
RUN mkdir -p /home/raven/.raven

# 5. Tell Docker which ports we need
EXPOSE 8766 8767

# 6. Start the Node
ENTRYPOINT ["ravend"]