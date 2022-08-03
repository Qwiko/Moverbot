cd cache
docker build . -t moverbot-cache:latest
docker tag moverbot-cache:latest moverbot-cache:local
#docker tag cache:latest 192.168.0.30:5000/cache:latest
#docker push 192.168.0.30:5000/cache:latest

cd ../gateway
docker build . -t moverbot-gateway:latest
docker tag moverbot-gateway:latest moverbot-gateway:local
#docker tag gateway:latest 192.168.0.30:5000/gateway:latest
#docker push 192.168.0.30:5000/gateway:latest

cd ../worker
docker build . -t moverbot-worker:latest
docker tag moverbot-worker:latest moverbot-worker:v0.0.1
#docker tag worker:latest 192.168.0.30:5000/worker:latest
#docker push 192.168.0.30:5000/worker:latest