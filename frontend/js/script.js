 // Menu functionality
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all menu items and sections
      document
        .querySelectorAll(".menu-item")
        .forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(".section")
        .forEach((s) => s.classList.remove("active"));

      // Add active class to clicked menu item and corresponding section
      this.classList.add("active");
      const sectionId = this.getAttribute("data-section");
      document.getElementById(sectionId).classList.add("active");

      // If "All Students" section is activated, fetch students
      if (sectionId === "allStudents") {
        fetchAllStudents();
      }
    });
  });

  // Notifications
  function showNotification(message, type) {
    const notificationArea = document.getElementById("notificationArea");
    notificationArea.innerHTML = `<div class="notification ${type}">${message}</div>`;

    // Clear notification after 3 seconds
    setTimeout(() => {
      notificationArea.innerHTML = "";
    }, 3000);
  }

  // Add Student Form Submission
  document
    .getElementById("studentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form data
      const name = document.getElementById("name").value;
      const rollNumber = document.getElementById("rollNumber").value;
      const marks = document.getElementById("marks").value;

      // Prepare data for POST request
      const data = {
        name: name,
        rollNumber: rollNumber,
        marks: parseInt(marks),
      };

      // Send POST request to Spring Boot API
      fetch("http://localhost:8080/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          showNotification("Student added successfully!", "success");
          document.getElementById("studentForm").reset();
        })
        .catch((error) => {
          showNotification(
            "Error adding student. Please try again.",
            "error"
          );
          console.error("Error:", error);
        });
    });

  // Find Student by ID or Roll Number Form Submission
  document
    .getElementById("findStudentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const searchType = document.getElementById("searchType").value;
      const searchValue = document.getElementById("searchValue").value;
      const studentDetails = document.getElementById("studentDetails");

      let endpoint;
      if (searchType === "id") {
        endpoint = `http://localhost:8080/api/students/${searchValue}`;
      } else {
        endpoint = `http://localhost:8080/api/students/roll/${searchValue}`;
      }

      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Student not found");
            }
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((student) => {
          studentDetails.innerHTML = `
                <div class="student-card">
                    <div class="student-detail student-name">${student.name}</div>
                    <div class="student-detail">Roll Number: ${student.rollNumber}</div>
                    <div class="student-detail">Marks: ${student.marks}</div>
                    <div class="student-detail">ID: ${student.id}</div>
                </div>
            `;
          showNotification("Student found!", "success");
        })
        .catch((error) => {
          studentDetails.innerHTML = "";
          if (error.message === "Student not found") {
            showNotification(
              `Student not found with that ${
                searchType === "id" ? "ID" : "Roll Number"
              }.`,
              "error"
            );
          } else {
            showNotification(
              "Error finding student. Please try again.",
              "error"
            );
          }
          console.error("Error:", error);
        });
    });

  // Fetch all students from the API and display them
  function fetchAllStudents() {
    const studentsList = document.getElementById("studentsList");
    studentsList.innerHTML =
      '<div style="text-align:center;padding:1rem;">Loading students...</div>';

    fetch("http://localhost:8080/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        studentsList.innerHTML = ""; // Clear the list

        if (data.length === 0) {
          studentsList.innerHTML =
            '<div style="text-align:center;padding:1rem;">No students found.</div>';
          return;
        }

        data.forEach((student) => {
          const li = document.createElement("li");
          li.innerHTML = `
                    <div class="student-detail student-name">${
                      student.name
                    }</div>
                    <div class="student-detail">Roll Number: ${
                      student.rollNumber
                    }</div>
                    <div class="student-detail">Marks: ${
                      student.marks
                    }</div>
                    <div class="student-detail">ID: ${
                      student.id || "N/A"
                    }</div>
                `;
          studentsList.appendChild(li);
        });
      })
      .catch((error) => {
        studentsList.innerHTML =
          '<div style="text-align:center;padding:1rem;color:var(--error-color);">Error loading students.</div>';
        console.error("Error fetching students:", error);
      });
  }

  // Delete Student Form Submission
  document
    .getElementById("deleteStudentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const deleteSearchType =
        document.getElementById("deleteSearchType").value;
      const deleteSearchValue =
        document.getElementById("deleteSearchValue").value;
      const deleteResult = document.getElementById("deleteResult");

      // Define the endpoint based on search type
      let endpoint;
      if (deleteSearchType === "id") {
        endpoint = `http://localhost:8080/api/students/${deleteSearchValue}`;
      } else {
        endpoint = `http://localhost:8080/api/students/roll/${deleteSearchValue}`;
      }

      // First fetch the student to confirm existence and show details
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Student not found");
            }
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((student) => {
          // Display student details for confirmation
          deleteResult.innerHTML = `
                <div class="student-card">
                    <div class="student-detail student-name">${student.name}</div>
                    <div class="student-detail">Roll Number: ${student.rollNumber}</div>
                    <div class="student-detail">Marks: ${student.marks}</div>
                    <div class="student-detail">ID: ${student.id}</div>
                    <div style="margin-top: 1rem;">
                        <button id="confirmDelete" style="background-color: var(--error-color);">Confirm Delete</button>
                        <button id="cancelDelete" style="background-color: #444; margin-top: 0.5rem;">Cancel</button>
                    </div>
                </div>
            `;

          // Setup confirm delete button
          document
            .getElementById("confirmDelete")
            .addEventListener("click", function () {
              // Send DELETE request
              fetch(`http://localhost:8080/api/students/${student.id}`, {
                method: "DELETE",
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Error deleting student");
                  }
                  deleteResult.innerHTML = "";
                  showNotification(
                    "Student deleted successfully!",
                    "success"
                  );
                  document.getElementById("deleteStudentForm").reset();

                  // Refresh all students list if it's visible
                  if (
                    document
                      .getElementById("allStudents")
                      .classList.contains("active")
                  ) {
                    fetchAllStudents();
                  }
                })
                .catch((error) => {
                  showNotification(
                    "Error deleting student. Please try again.",
                    "error"
                  );
                  console.error("Delete error:", error);
                });
            });

          // Setup cancel button
          document
            .getElementById("cancelDelete")
            .addEventListener("click", function () {
              deleteResult.innerHTML = "";
              showNotification("Delete operation cancelled.", "success");
            });
        })
        .catch((error) => {
          deleteResult.innerHTML = "";
          if (error.message === "Student not found") {
            showNotification(
              `Student not found with that ${
                deleteSearchType === "id" ? "ID" : "Roll Number"
              }.`,
              "error"
            );
          } else {
            showNotification(
              "Error finding student. Please try again.",
              "error"
            );
          }
          console.error("Error:", error);
        });
    });

  // Initial fetch of all students when page loads (but not visible until tab is selected)
  fetchAllStudents();

  // Interactive background with connecting dots
  const canvas = document.createElement("canvas");
  canvas.id = "canvas-background";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let dots = [];
  let mouse = {
    x: undefined,
    y: undefined,
    lastX: undefined,
    lastY: undefined,
    timestamp: 0,
  };
  let animationId;

  // Configuration
  const config = {
    dotSize: 3, // Dot size
    dotColor: "rgba(255, 255, 255, 0.2)", // Dot color (more subtle)
    gridSpacing: 50, // Increased space between dots for less density
    connectDistance: 120, // Reduced max distance for connections
    lineColor: "rgba(187, 134, 252, 0.6)", // Reduced brightness connecting lines
    lineWidth: 1.2, // Thinner lines
    activeDotSize: 4, // Size of dots when active
    mouseInteractionRadius: 180, // Mouse influence radius
    maxRandomConnections: 2, // Reduced number of random connections
    mouseMovementDebounce: 20, // Debounce mouse movement (ms)
    connectionFadeSpeed: 0.1, // Connection fade speed (lower = smoother)
    stableConnections: true, // Enable stable connections
  };

  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
  }

  // Initialize dots based on grid spacing
  function initDots() {
    dots = [];
    const cols = Math.ceil(canvas.width / config.gridSpacing) + 1;
    const rows = Math.ceil(canvas.height / config.gridSpacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Add a little randomness to positions to make it look more natural
        const xOffset = Math.random() * 10 - 5;
        const yOffset = Math.random() * 10 - 5;

        dots.push({
          x: i * config.gridSpacing + xOffset,
          y: j * config.gridSpacing + yOffset,
          size: config.dotSize,
          baseSize: config.dotSize,
          connections: [],
          connectionOpacity: 0,
        });
      }
    }
  }

  // Calculate distance between two points
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // Smooth mouse movement to reduce flickering
  function smoothMouseMovement(x, y) {
    const now = Date.now();

    // Debounce rapid movements
    if (now - mouse.timestamp < config.mouseMovementDebounce) {
      return;
    }

    // Store last position
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;

    // Update current position
    mouse.x = x;
    mouse.y = y;
    mouse.timestamp = now;
  }

  // Draw dots and connecting lines
  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset connections if mouse is not present
    if (!mouse.x || !mouse.y) {
      for (let i = 0; i < dots.length; i++) {
        dots[i].connections = [];
        dots[i].connectionOpacity = 0;
      }
    }

    // Draw dots and connections
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      // Reset dot size
      dot.size = dot.baseSize;

      // Draw dot
      ctx.beginPath();
      ctx.fillStyle = config.dotColor;
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();

      // Connect to mouse if close enough
      if (mouse.x && mouse.y) {
        const distToMouse = getDistance(dot.x, dot.y, mouse.x, mouse.y);

        if (distToMouse < config.mouseInteractionRadius) {
          // Enlarge dot based on proximity to mouse (subtle effect)
          const sizeFactor =
            1 - distToMouse / config.mouseInteractionRadius;
          dot.size =
            dot.baseSize +
            (config.activeDotSize - dot.baseSize) * sizeFactor * 0.7;

          // Draw line to mouse with smooth fade in/out
          const lineOpacity = Math.max(
            0,
            0.8 - distToMouse / config.mouseInteractionRadius
          );

          if (lineOpacity > 0.05) {
            // Only draw if visible enough
            ctx.beginPath();
            ctx.strokeStyle = `rgba(187, 134, 252, ${lineOpacity * 0.6})`;
            ctx.lineWidth =
              config.lineWidth *
              (1 - (distToMouse / config.mouseInteractionRadius) * 0.8);
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }

          // Find or update connections
          if (config.stableConnections) {
            if (dot.connections.length === 0) {
              // Initialize connections - find nearby dots
              const nearbyDots = [];

              for (let j = 0; j < dots.length; j++) {
                if (i !== j) {
                  const dot2 = dots[j];
                  const dist = getDistance(dot.x, dot.y, dot2.x, dot2.y);

                  if (dist < config.connectDistance) {
                    const dot2ToMouse = getDistance(
                      dot2.x,
                      dot2.y,
                      mouse.x,
                      mouse.y
                    );
                    if (dot2ToMouse < config.mouseInteractionRadius) {
                      nearbyDots.push({ dot: dot2, index: j, dist: dist });
                    }
                  }
                }
              }

              // Sort by distance
              nearbyDots.sort((a, b) => a.dist - b.dist);

              // Choose the closest few
              const connectionCount = Math.min(
                config.maxRandomConnections,
                nearbyDots.length
              );
              for (let c = 0; c < connectionCount; c++) {
                if (c < nearbyDots.length) {
                  dot.connections.push({
                    index: nearbyDots[c].index,
                    opacity: 0,
                  });
                }
              }
            }

            // Draw stable connections with smooth transitions
            for (let c = 0; c < dot.connections.length; c++) {
              const connection = dot.connections[c];
              const connectedDot = dots[connection.index];

              // Check if connected dot is still in range
              const dotToDot = getDistance(
                dot.x,
                dot.y,
                connectedDot.x,
                connectedDot.y
              );
              const dotToMouse = getDistance(
                connectedDot.x,
                connectedDot.y,
                mouse.x,
                mouse.y
              );

              // Fade connections in/out based on mouse proximity
              if (
                dotToDot < config.connectDistance &&
                dotToMouse < config.mouseInteractionRadius
              ) {
                // Fade in
                connection.opacity += config.connectionFadeSpeed;
                if (connection.opacity > 1) connection.opacity = 1;
              } else {
                // Fade out
                connection.opacity -= config.connectionFadeSpeed;
                if (connection.opacity < 0) connection.opacity = 0;
              }

              // Draw connection if visible
              if (connection.opacity > 0) {
                const baseOpacity =
                  0.3 + 0.3 * (1 - dotToDot / config.connectDistance);
                const finalOpacity = baseOpacity * connection.opacity;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(187, 134, 252, ${finalOpacity})`;
                ctx.lineWidth = config.lineWidth * 0.8 * connection.opacity;
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(connectedDot.x, connectedDot.y);
                ctx.stroke();
              }
            }

            // Remove connections that have faded out
            dot.connections = dot.connections.filter(
              (conn) => conn.opacity > 0
            );
          }
        }
      }
    }

    animationId = requestAnimationFrame(drawDots);
  }

  // Mouse movement event with debounce
  document.addEventListener("mousemove", (event) => {
    smoothMouseMovement(event.clientX, event.clientY);
  });

  // Touch support for mobile devices with debounce
  document.addEventListener("touchmove", (event) => {
    if (event.touches.length > 0) {
      smoothMouseMovement(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      event.preventDefault(); // Prevent scrolling while touching
    }
  });

  document.addEventListener("touchend", () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  // Handle window resize
  window.addEventListener("resize", resizeCanvas);

  // Initialize and start animation
  resizeCanvas();
  drawDots();