# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS build

# Create app directory inside the container
WORKDIR /app

# Copy only the pom.xml file to download dependencies
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy the rest of the source files
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre

# Create app directory inside the container
WORKDIR /app

# Accept HOST_IP as a build argument
ARG HOST_IP

# Set HOST_IP as an environment variable
ENV HOST_IP=${HOST_IP}

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]