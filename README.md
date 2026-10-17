# COMP3123 Assignment 1 — Employee Management API

## 1. Overview

This is a backend for COMP 3123 Assignment 1. It's a REST API built with Node.js, Express and MongoDB Atlas. Users can sign up and log in, and once they're logged in they can create and manage their own employees. Every employee belongs to the user who created it, so nobody can see or change another user's employees.

## 2. Technologies Used

- **Node.js** — JavaScript runtime.
- **Express.js** — REST API framework.
- **MongoDB Atlas** — Cloud-hosted NoSQL database.
- **Mongoose** — MongoDB object modeling.
- **JSON Web Token (JWT)** — Authentication for protected routes.
- **bcryptjs** — Password hashing.
- **express-validator** — Request validation.
- **Helmet** — HTTP security headers.
- **express-rate-limit** — Request rate limiting.
- **Morgan** — HTTP request logging.
- **dotenv** — Environment variable configuration.
- **Postman** — API testing.

## 3. Project Structure

```text
101485935_COMP3123_Assignment1/
├── config/          # Database configuration
├── controllers/     # Request handlers and business logic
├── logs/            # Local access and error logs
├── middleware/      # Authentication and rate limiting
├── models/          # Mongoose data models
├── routes/          # API route definitions
├── validators/      # Request validation rules
├── .env.example     # Environment variable template
├── .gitignore       # Git exclusions
├── package.json     # Dependencies and npm scripts
├── package-lock.json
├── README.md
└── server.js        # Application entry point
```

## 4. Prerequisites

Before running the application, ensure you have:

- Node.js and npm installed.
- A MongoDB Atlas account and database user.
- Git installed.
- Postman for testing API endpoints.

## 5. Installation and Configuration

### Step 1: Clone the repository

```bash
git clone https://github.com/Noella-nk/101485935_COMP3123_Assignment1.git
cd 101485935_COMP3123_Assignment1
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Create a `.env` file in the project root using `.env.example` as a template.

Configure the following environment variables with your own values:

```dotenv
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use your MongoDB Atlas connection string and a strong, private JWT secret. Never commit your `.env` file or share actual credentials.

### Step 4: Start the application

Start the server:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

## Starting MongoDB

This application uses MongoDB Atlas as its database.

1. Sign in to MongoDB Atlas and open your database cluster.
2. Ensure the cluster is running and accessible.
3. Add your current IP address to the Atlas Network Access allowlist, if required.
4. Create or verify a database user with the necessary database permissions.
5. Set the `MONGODB_URI` environment variable in your local `.env` file using your own Atlas connection string.
6. Start the application after confirming that the database connection settings are correct.

The application uses port `3000` when `PORT=3000` is configured.

## 6. API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/health` | Check API health | 200 OK |
| POST | `/api/v1/user/signup` | Register a new user | 201 Created |
| POST | `/api/v1/user/login` | Authenticate a user | 200 OK |
| GET | `/api/v1/emp/employees` | List the authenticated user's employees | 200 OK |
| POST | `/api/v1/emp/employees` | Create an employee record | 201 Created |
| GET | `/api/v1/emp/employees/:eid` | Retrieve an employee by ID | 200 OK |
| PUT | `/api/v1/emp/employees/:eid` | Update an employee by ID | 200 OK |
| DELETE | `/api/v1/emp/employees?eid=:eid` | Delete an employee by ID | 204 No Content |

All employee endpoints require a valid JWT.

## 7. User Authentication

### User Registration

A POST request is sent to:

`/api/v1/user/signup`

Example request body:

```json
{
  "username": "your_username",
  "email": "you@example.com",
  "password": "your_secure_password"
}
```

A successful registration returns HTTP `201 Created`.

### User Login

You can log in with either your username or your password:

`/api/v1/user/login`

Example request body:

```json
{
  "username": "your_username",
  "password": "your_secure_password"
}
```

Login also supports an email address instead of a username.

A successful login returns a JWT for accessing protected endpoints.

### Authorization

Every employee has a `user` field that stores the id of the user who created it. I never take that id from the request. The auth middleware reads it from the verified JWT, so a client can't choose who owns an employee.

When someone lists employees, I only look up the ones where `user` matches the logged-in user. For get, update and delete, I check that the employee belongs to the logged-in user before doing anything. Changing the `eid` in the URL doesn't help, because the ownership check still fails.

When I tested with a second user trying to open the first user's employee, the API returned `404 Not Found`.

## 8. Employee Management

All employee management endpoints require authentication.

Employee creation accepts the following fields:

- `first_name`
- `last_name`
- `email`
- `position`
- `salary`
- `date_of_joining`
- `department`

Example of employee request body:

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "position": "Software Developer",
  "salary": 65000,
  "date_of_joining": "2026-01-15",
  "department": "Engineering"
}
```
The employee ID returned by the API for retrieval and updates. For deletion, the employee ID is provided through the `eid` query parameter.

The API associates newly created employee records with the authenticated user and restricts employee retrieval and updates to records owned by that user.

## 9. Security and Validation

- **Password hashing:** passwords are hashed with bcryptjs before they go into the database.
- **JWT:** protects the employee routes.
- **Helmet:** adds HTTP security headers. It helps protect against things like clickjacking and MIME sniffing, and it hides the `X-Powered-By` header.
- **Rate limiting:** limits how many requests one client can make in a time window, so someone can't just keep guessing passwords. When the limit is passed, the API returns `429 Too Many Requests`.
- **Validation:** I check the data for signup, login and employees with express-validator (required fields, email format, salary is a positive number, valid date, valid ObjectId). Bad input returns 400 with a JSON message.
- **Environment variables:** the secrets live in `.env`, which is not in GitHub.
- **Error handling:** errors come back as JSON with a consistent shape, and I don't send stack traces to the client.

## 10. Logging

I use Morgan for request logging. The logs go to the `logs/` folder:

- `logs/access.log`: one line for each HTTP request
- `logs/error.log`: application errors

I don't log passwords, JWTs or database credentials. The log files are in `.gitignore`, so I included a sample or screenshots in my submission instead.

## 11. Testing

The API has been tested using Postman.

The main functional tests performed included:

- User registration.
- User login and JWT generation.
- Employee creation.
- Listing employee records.
- Retrieving an employee by ID.
- Updating an employee record.
- Deleting an employee record.
- Checking that a second user cannot retrieve another user's employee record.

The ownership test returned `404 Not Found`, as expected.

## 12 Health Check

**Endpoint:** `GET /health`

This endpoint is used to confirm that the API server is responding.

Expected response:

`HTTP 200 OK`

The response body should match the health-check response implemented in `server.js`.

Screenshots of the tests, the MongoDB collections (with hashed passwords and the owner field) and the logs are included in my submission.
