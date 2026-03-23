#!/bin/sh
set -e


if [ "$GRADUAL_MIGRATION" = "true" ] || [ "$GRADUAL_MIGRATION" = "1" ]; then
    echo "Gradual migration ENABLED"
    
    export MONOLITH_MOVIES_PERCENT=$((100 - MOVIES_MIGRATION_PERCENT))
else
    echo "Gradual migration DISABLED"

    export MONOLITH_MOVIES_PERCENT=100
    export MOVIES_MIGRATION_PERCENT=0
fi

# Substitute environment variables in the config template
envsubst < /usr/local/kong/declarative/kong.template.yml > /usr/local/kong/declarative/kong.yml

cat /usr/local/kong/declarative/kong.yml;

# Validate Kong configuration
kong check /usr/local/kong/declarative/kong.yml --vv

# Start Kong
exec "$@"
