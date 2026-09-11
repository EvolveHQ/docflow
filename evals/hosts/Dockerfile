FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git gh gnupg python3 ripgrep procps tini unzip \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /workspace /results && chown node:node /workspace /results
ENV CI=1 NO_COLOR=1
WORKDIR /workspace
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sleep", "infinity"]

FROM base AS claude
RUN npm install --global @anthropic-ai/claude-code@2.1.269 && npm cache clean --force
ENV DISABLE_AUTOUPDATER=1 DISABLE_TELEMETRY=1
USER node

FROM base AS codex
RUN npm install --global @openai/codex@0.154.0 && npm cache clean --force
USER node

FROM base AS pi
RUN npm install --global --ignore-scripts @earendil-works/pi-coding-agent@0.84.4 && npm cache clean --force
ENV PI_TELEMETRY=0
USER node

FROM base AS opencode
RUN npm install --global opencode-ai@1.18.30 && npm cache clean --force
USER node

FROM base AS cowork
RUN curl -fsSLo /usr/share/keyrings/claude-desktop-archive-keyring.asc https://downloads.claude.ai/claude-desktop/key.asc \
    && gpg --show-keys --with-colons /usr/share/keyrings/claude-desktop-archive-keyring.asc | rg '31DDDE24DDFAB679F42D7BD2BAA929FF1A7ECACE'
RUN echo 'deb [signed-by=/usr/share/keyrings/claude-desktop-archive-keyring.asc] https://downloads.claude.ai/claude-desktop/apt/stable stable main' > /etc/apt/sources.list.d/claude-desktop.list \
    && apt-get update && apt-get install -y --no-install-recommends claude-desktop xvfb dbus-x11 xauth \
    && rm -rf /var/lib/apt/lists/*
ENV DISPLAY=:99
USER node

