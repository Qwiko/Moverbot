recreate_service() {

    echo "Rolling update for $1"
    PREVIOUS_CONTAINER=$(docker ps --format "table {{.ID}}  {{.Names}}  {{.CreatedAt}}" | grep $1 | awk -F  "  " '{print $1}')
    CURRENT_COUNT=$(echo $PREVIOUS_CONTAINER | wc -l)
    echo "Current count: $CURRENT_COUNT"
    docker compose up -d --no-deps --scale $1=$(($CURRENT_COUNT+1)) --no-recreate $1
    sleep 10
    echo "Removing the old services"
    docker kill -s SIGTERM $PREVIOUS_CONTAINER
    sleep 1
    docker rm -f $PREVIOUS_CONTAINER
    echo "Reverting back to $CURRENT_COUNT amount"
    docker compose up -d --no-deps --scale $1=$CURRENT_COUNT --no-recreate $1
}

recreate_service "worker"