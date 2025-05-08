docker build -t studentbackend -f ./backend/Dockerfile ./backend
docker build -t studentfrontend -f ./frontend/Dockerfile ./frontend
docker-compose -f docker-compose.yml up -d
open http://localhost:80
