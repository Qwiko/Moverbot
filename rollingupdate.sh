recreate_service() {

    echo "Rolling update for $1"
    PREVIOUS_CONTAINER=$(docker ps --format "table {{.ID}}  {{.Names}}  {{.CreatedAt}}" | grep $1 | awk -F  "  " '{print $1}')
    docker compose up -d --no-deps --scale $1=3 --no-recreate $1
    sleep 10
    docker kill -s SIGTERM $PREVIOUS_CONTAINER
    sleep 1
    docker rm -f $PREVIOUS_CONTAINER
    docker compose up -d --no-deps --scale $1=2 --no-recreate $1
}

recreate_service "worker"