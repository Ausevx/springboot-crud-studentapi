# Use the official Nginx image as the base
FROM nginx:alpine

# Remove default Nginx index page (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy your index.html into the default Nginx web directory
COPY index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80
