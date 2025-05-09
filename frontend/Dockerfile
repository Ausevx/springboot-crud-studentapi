# Use the official Nginx image as the base
FROM nginx:alpine

# Remove default Nginx index page (optional)
RUN rm -rf /usr/share/nginx/html/*

# Accept HOST_IP as a build argument
ARG HOST_IP

# Set HOST_IP as an environment variable
ENV HOST_IP=${HOST_IP}


# Copy your index.html into the default Nginx web directory
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
RUN find /usr/share/nginx/html/js/ -type f -name "*.js" -exec sed -i "s/localhost/${HOST_IP}/g" {} +

# Expose port 80
EXPOSE 80
