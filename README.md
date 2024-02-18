# Express API Documentation

An API documentation for managing users built with Express.js.

## Getting Started

1. Clone the repository: `https://github.com/PurrCat101/express-mysql-api-middleware.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and visit: `http://localhost:3000`

## API Endpoints

### Welcome

- **URL:** `/`
- **Method:** `GET`
- **Description:** Welcome endpoint
- **Response:**
  - `200 OK` - A successful response

### Retrieve all users

- **URL:** `/users`
- **Method:** `GET`
- **Description:** Retrieve all users
- **Response:**
  - `200 OK` - A successful response with the list of users
  - `500 Internal Server Error` - Error occurred while retrieving users

### Retrieve a user by ID

- **URL:** `/users/{id}`
- **Method:** `GET`
- **Description:** Retrieve a user by ID
- **Parameters:**
  - `id` (path parameter) - ID of the user to retrieve
- **Response:**
  - `200 OK` - A successful response with user data
  - `404 Not Found` - User not found
  - `500 Internal Server Error` - Error occurred while retrieving user

### Create a new user

- **URL:** `/users`
- **Method:** `POST`
- **Description:** Create a new user
- **Request Body:**
  - `name` (string) - Name of the user
  - `email` (string) - Email of the user
- **Response:**
  - `201 Created` - User created successfully
  - `500 Internal Server Error` - Error occurred while creating user

### Partially update user by ID

- **URL:** `/users/{id}`
- **Method:** `PATCH`
- **Description:** Partially update user by ID
- **Parameters:**
  - `id` (path parameter) - ID of the user to update
- **Request Body:** Fields to be updated
- **Response:**
  - `200 OK` - User updated successfully
  - `400 Bad Request` - No fields to update
  - `404 Not Found` - User not found
  - `500 Internal Server Error` - Error occurred while updating user

### Delete user by ID

- **URL:** `/users/{id}`
- **Method:** `DELETE`
- **Description:** Delete user by ID
- **Parameters:**
  - `id` (path parameter) - ID of the user to delete
- **Response:**
  - `200 OK` - User deleted successfully
  - `404 Not Found` - User not found
  - `500 Internal Server Error` - Error occurred while deleting user

### Search users by name

- **URL:** `/users/search/{name}`
- **Method:** `GET`
- **Description:** Search users by name
- **Parameters:**
  - `name` (path parameter) - The name to search for
- **Response:**
  - `200 OK` - A list of users matching the search criteria
  - `400 Bad Request` - Name parameter is required for search
  - `500 Internal Server Error` - Error occurred while searching users

## Project Structure

The project structure follows the standard Express.js project layout:

| Name              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| app.js            | Express application                                         |
| server.js         | Node server setup                                           |
| package.json      | Contains npm dependencies as well as build scripts          |
| package-lock.json | Contains exact versions of npm dependencies in package.json |

## License

[MIT](LICENSE)
