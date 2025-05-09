HOST_IP=$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}')

docker build -t studentbackend --build-arg HOST_IP="$HOST_IP" -f ./backend/Dockerfile ./backend
docker build -t studentfrontend --build-arg HOST_IP="$HOST_IP" -f ./frontend/Dockerfile ./frontend
docker-compose -f docker-compose.yml up -d
open http://localhost:80
