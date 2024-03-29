recreate_service() {

    echo "Building new images for $1."

    docker compose build worker

    echo "Rolling update for $1."
    PREVIOUS_CONTAINER=$(docker ps --format "table {{.ID}}  {{.Names}}  {{.CreatedAt}}" | grep $1 | awk -F  "  " '{print $1}')
    CURRENT_COUNT=$(echo $PREVIOUS_CONTAINER | wc -w)
    echo "Current count: $CURRENT_COUNT, adding $CURRENT_COUNT more."
    docker compose up -d --no-deps --scale $1=$(($CURRENT_COUNT+$CURRENT_COUNT)) --no-recreate $1
    echo "Sleeping 20 seconds to make sure the containers have started correctly."
    sleep 20
    echo "Killing and removing old containers."
    docker kill -s SIGTERM $PREVIOUS_CONTAINER
    sleep 1
    docker rm -f $PREVIOUS_CONTAINER
    echo "Reverting back to $CURRENT_COUNT amount."
    docker compose up -d --no-deps --scale $1=$CURRENT_COUNT --no-recreate $1
}
#Always do a git pull before applying an update
git pull

recreate_service "worker"