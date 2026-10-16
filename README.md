# COMP3123 Assignment 1 — Employee Management API

## 1. Overview

The Employee Management API is a RESTful backend application developed using Node.js, Express.js, and MongoDB Atlas. It provides user registration and login, JWT-based authentication, and employee record management.

Each employee record is associated with the authenticated user who created it. Users can manage their own employee records but cannot access another user's records.

## 2. Technologies Used

- **Node.js** — JavaScript runtime.
- **Express.js** — REST API framework.
- **MongoDB Atlas** — Cloud-hosted NoSQL database.
- **Mongoose** — MongoDB object modeling.
- **JSON Web Token (JWT)** — Authentication for protected routes.
- **bcryptjs** — Password hashing.
- **express-validator** — Request validation.
- **Helmet** — HTTP security headers.
- **express-rate-limit** — Protection against excessive requests.
- **Morgan** — HTTP request logging.
- **dotenv** — Environment variable configuration.
- **Postman** — API testing.

## 3. Prerequisites

Before running the application, install or prepare:

- Node.js and npm.
- A MongoDB Atlas account and database user.
- Git.
- Postman for testing API endpoints.

## 4. Installation and Configuration

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

Configure the following variables with your own values:

```dotenv
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use your actual MongoDB Atlas connection string and a strong, private JWT secret. Do not commit your `.env` file or share real credentials.

### Step 4: Start the application

Start the server:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The server uses port `3000` by default when configured that way in the environment.

## 5. API Endpoints

| Method | Endpoint | Description | Success status |
|---|---|---|---|
| GET | `/health` | Check API health | 200 OK |
| POST | `/api/v1/user/signup` | Register a new user | 201 Created |
| POST | `/api/v1/user/login` | Authenticate a user | 200 OK |
| GET | `/api/v1/emp/employees` | List the authenticated user's employees | 200 OK |
| POST | `/api/v1/emp/employees` | Create an employee record | 201 Created |
| GET | `/api/v1/emp/employees/:eid` | Retrieve an employee by ID | 200 OK |
| PUT | `/api/v1/emp/employees/:eid` | Update an employee by ID | 200 OK |
| DELETE | `/api/v1/emp/employees?eid=:eid` | Delete an employee by ID | 204 No Content |

Protected employee endpoints require a valid JWT.

## 6. Authentication

### User registration

Send a `POST` request to:

`/api/v1/user/signup`

Example request body:

```json
{
  "username": "your_username",
  "email": "you@example.com",
  "password": "your_secure_password"
}
```

### User login

Send a `POST` request to:

`/api/v1/user/login`

Example request body:

```json
{
  "username": "your_username",
  "password": "your_secure_password"
}
```

The login endpoint also supports authentication using an email address instead of a username.

A successful login returns a JWT. For protected requests in Postman, select **Authorization → Bearer Token** and provide the returned token.

Alternatively, send this HTTP header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 7. Employee Management

All employee endpoints require authentication.

Employee creation requires the employee details accepted by the API, including:

- `first_name`
- `last_name`
- `email`
- `position`
- `salary`
- `date_of_joining`
- `department`

The API validates employee input and associates the new record with the authenticated user.

The list, retrieve, and update operations restrict access to records owned by the logged-in user. Employee deletion identifies the record using the `eid` query parameter.

## 8. Security and Validation

The application includes the following security measures:

- Passwords are hashed using bcryptjs before storage.
- JWT authentication protects employee endpoints.
- Employee records are scoped to their owners.
- Request validation checks submitted user and employee data.
- Helmet configures HTTP security headers.
- Rate limiting restricts excessive requests, including authentication attempts.
- Environment variables hold sensitive configuration.
- A centralized error handler handles application errors.

## 9. Logging

Morgan records HTTP request information. The application writes access and error logs to local files in the `logs/` directory.

These logs help with troubleshooting and monitoring API activity. Log files and environment secrets should not be committed to the repository.

## 10. Testing

The API was tested using Postman.

Tests performed included:

- Successful user registration.
- Successful user login and JWT generation.
- Creating an employee with a valid token.
- Listing the authenticated user's employee records.
- Retrieving an employee by ID.
- Updating an employee record.
- Deleting an employee record.
- Verifying that a second user cannot retrieve another user's employee record.

The ownership test returned `404 Not Found`, as expected.

## 11. Environment Variables and Secrets

Use `.env.example` as a template for local configuration. Keep `.env` private and never commit actual database credentials or JWT secrets.

