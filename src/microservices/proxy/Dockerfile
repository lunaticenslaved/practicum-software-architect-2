FROM kong:3.9.1-ubuntu

USER root
RUN apt-get update && apt-get install -y \
    gettext \
    && rm -rf /var/lib/apt/lists/*
    
# KONG_PROXY_LISTEN
# KONG_ADMIN_LISTEN

# MONOLITH_TARGET
# MOVIES_SERVICE_TARGET
# EVENTS_SERVICE_TARGET
# MOVIES_MIGRATION_PERCENT
# EVENTS_MIGRATION_PERCENT

# Set DB-less mode
ENV KONG_DATABASE=off
ENV KONG_NGINX_DAEMON=off
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
ENV KONG_PROXY_ACCESS_LOG=/dev/stdout
ENV KONG_ADMIN_ACCESS_LOG=/dev/stdout
ENV KONG_PROXY_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_ERROR_LOG=/dev/stderr
ENV KONG_PLUGINS=bundled

# Create directory for config
RUN mkdir -p /usr/local/kong/declarative

# Copy template config
COPY kong.template.yml /usr/local/kong/declarative/kong.template.yml

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE ${KONG_PROXY_PORT} ${KONG_PROXY_SSL_PORT} ${KONG_ADMIN_PORT} ${KONG_ADMIN_PORT}

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kong", "start"]
