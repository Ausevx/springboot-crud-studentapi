# Spring Boot CRUD Student API

This project provides a **Spring Boot CRUD API** for managing students with a **MySQL** database. It supports basic operations like **Create**, **Read**, **Update**, and **Delete** (CRUD) for student records.

## Features

- **Create**: Add a new student to the database.
- **Read**: Retrieve a list of students or a specific student by ID/roll-number.
- **Update**: Modify the details of an existing student.
- **Delete**: Remove a student from the database.

## Technologies Used

- **Spring Boot**: For creating REST APIs
- **MySQL**: For database management
- **Docker**: Containerize the application for easy deployment

## Requirements

Before running the application, make sure you have the following installed:

- **JDK 17** or higher
- **Maven** (or use IntelliJ’s built-in Maven support)
- **Docker** (optional for running MySQL in a container)


## Setup MySQL Database (Docker)

To set up MySQL using Docker, follow these steps:

1. **Run the MySQL Docker container:**

   If you don’t have Docker installed, you can follow the official [Docker installation guide](https://docs.docker.com/get-docker/) for your operating system.

2. **Create and start the MySQL container** on port **3308** by running the following command:

   ```bash
   docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=1234 -p 3308:3306 -d mysql:latest


### 1. Clone the Repository

```bash
git clone https://github.com/your-username/springboot-crud-studentapi.git
