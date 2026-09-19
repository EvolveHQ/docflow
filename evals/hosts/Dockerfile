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

FROM base AS grok
RUN npm install --global @xai-org/grok-cli@latest && npm cache clean --force
USER node

FROM base AS cursor
RUN npm install --global cursor-agent@latest && npm cache clean --force
USER node

FROM base AS omp
RUN npm install --global @can1357/oh-my-pi@18.2.4 && npm cache clean --force
USER node

FROM base AS copilot
RUN npm install --global @github/copilot@1.0.85 && npm cache clean --force
USER node

