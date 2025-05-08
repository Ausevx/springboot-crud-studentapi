# Use OpenJDK 17 base image
FROM maven:3.9.9-eclipse-temurin-17

# Create app directory inside the container
WORKDIR /app

# Copy all source files
COPY . .

RUN mvn clean package -DskipTests
RUN ["/bin/bash", "-c", "cp /app/target/*.jar app.jar"]

RUN ls

# Expose port 8080
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]