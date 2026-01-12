

# BloggIt Backend — Production-Oriented MERN Backend

This repository contains the backend implementation of **BloggIt**, a blogging platform designed to explore **real-world backend engineering challenges** such as authentication, API design, microservice integration, containerization, and cloud deployment.

The project prioritizes **correctness, security, and deployability** over feature bloat, and reflects decisions made while deploying a backend service to production infrastructure.



## Backend Goals

The backend was designed to:

* Expose clean, RESTful APIs for frontend consumption
* Implement secure authentication and authorization
* Integrate external services via isolated microservices
* Be portable across environments using Docker
* Run reliably in a cloud environment with HTTPS
* Surface real deployment and debugging challenges



## Backend Architecture

```
Client (React)
   |
   | HTTPS (REST APIs)
   v
Nginx (Reverse Proxy, TLS Termination)
   |
   v
Node.js + Express Backend (Docker)
   |
   | Internal HTTP
   v
LanguageTool Service (Docker)
   |
   v
MongoDB Atlas
```

### Architectural Decisions

* **Express.js** was used for its simplicity and middleware ecosystem.
* **JWT authentication** was chosen to keep the backend stateless.
* **LanguageTool** was isolated as a microservice to avoid bloating the core backend.
* **Nginx** handles HTTPS and request routing instead of the application server.
* **Docker** ensures environment parity between local and production setups.



## Authentication & Authorization Design

### Why JWT?

* Stateless authentication simplifies scaling and deployment.
* No server-side session storage required.
* Works naturally with REST APIs.

### Implementation Details

* JWT is issued on login and stored in an **HTTP-only cookie**
* Cookies are configured with:

  * `Secure`
  * `SameSite=None`
* Protected routes use middleware to:

  * Validate token
  * Attach user identity to the request
* Role-based authorization restricts access to sensitive routes

### Key Learning

> Cookie-based authentication behaves differently in production due to browser security policies.
> Handling cross-origin authentication required explicit configuration of `SameSite` and HTTPS.



## API Design Principles

* RESTful endpoints with predictable semantics
* Clear separation between:

  * Authentication routes
  * Resource routes (blogs, comments)
  * Utility services (grammar checking)
* Middleware used for:

  * Authentication
  * Error handling
  * Request validation

Example route structure:

```
/api/users
/api/blogs
/api/blogs/:id/comments
/api/grammar-check
```



## Grammar Correction Microservice

### Why a Separate Service?

* Grammar checking is computationally expensive
* Keeps the core backend lightweight
* Enables independent scaling or replacement
* Encourages loose coupling

### Communication Model

* Backend sends plain text to LanguageTool via HTTP
* LanguageTool responds with structured grammar suggestions
* Backend acts as a controlled gateway for the frontend

### Learning

> Even simple microservices introduce networking, latency, and failure considerations that monolithic apps don’t expose.



##  Containerization Strategy

### Why Docker?

* Ensures identical runtime across local and production
* Simplifies dependency management
* Enables service isolation

### Containers Used

* Backend API container
* LanguageTool service container

Each container:

* Has a single responsibility
* Exposes only required ports
* Communicates over Docker’s internal network



##  Deployment Strategy

### Why AWS EC2?

* Full control over runtime and networking
* Supports long-running processes
* Allows Docker-based workloads
* Good learning platform for backend deployment

### Deployment Steps (High-Level)

1. Provision EC2 instance
2. Install Docker and Nginx
3. Run containers via Docker
4. Configure Nginx as reverse proxy
5. Enable HTTPS using Let’s Encrypt

### Why Nginx?

* Handles TLS termination efficiently
* Protects backend from direct exposure
* Simplifies routing and security headers



## HTTPS & Security Considerations

* HTTPS is mandatory for secure cookies
* Let’s Encrypt provides free TLS certificates
* Nginx redirects HTTP → HTTPS
* Environment variables used for all secrets
* No credentials committed to source control



## Environment Configuration

Backend relies on environment variables for configuration:

```env
PORT=5001
MONGO_URI=<mongodb_uri>
JWT_SECRET=<jwt_secret>
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

LANGUAGETOOL_URL=http://languagetool:8010
NODE_ENV=production
```



## Common Debugging Challenges Faced

* Cookies not being stored due to incorrect `SameSite` settings
* Mixed Content errors caused by HTTP/HTTPS mismatch
* Differences between browser and Postman behavior
* Container networking issues between services
* CORS misconfiguration for credentialed requests

Each issue required:

* Inspecting network traffic
* Understanding browser security models
* Adjusting infrastructure, not just code



## Key Backend Learnings

* Backend development doesn’t stop at APIs — deployment matters
* Browser security constraints shape backend design
* Docker simplifies shipping but introduces networking complexity
* Stateless authentication scales better but needs careful handling
* Production bugs often arise from environment differences, not logic errors



## Future Improvements

* Introduce CI/CD pipeline (GitHub Actions)
* Add centralized logging and monitoring
* Migrate deployment to ECS or managed container service
* Introduce rate limiting and request validation
* Improve service observability



## Author

**Sukirth Singh Gaur**
GitHub: [https://github.com/sukirth-singh-gaur](https://github.com/sukirth-singh-gaur)



### Final note

This backend was intentionally built to **expose real production challenges**, not hide them.
The project reflects hands-on learning across **API design, security, containerization, and cloud deployment**.

