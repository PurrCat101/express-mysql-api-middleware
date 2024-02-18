const express = require("express");
// const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API documentation for managing users",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
    ],
  },
  apis: ["server.js"], // List of files to be scanned for annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *  get:
 *    description: Welcome endpoint
 *    responses:
 *      '200':
 *        description: A successful response
 */

// *** Logging Middleware ***
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

app.use(logger);

// Global error handling middleware
const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
};

// Error handling middleware
const notFoundHandler = (req, res, next) => {
  const error = new Error(
    "Oops! It seems you've ventured into uncharted territory!"
  );
  error.status = 404;
  next(error);
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/**
 * @openapi
 * /users:
 *  get:
 *    description: Retrieve all users
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Internal server error
 */

// Get all users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving users",
        error: err,
      });
    } else {
      res.status(200).json(results);
    }
  });
});

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    description: Retrieve a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: User not found
 */

// Get user by id
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const query = "SELECT * FROM user WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving user",
        error: err,
      });
    } else if (results.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res
        .status(200)
        .json({ message: "User retrieved successfully", data: results });
    }
  });
});

/**
 * @openapi
 * /users:
 *  post:
 *    description: Create a new user
 *    responses:
 *      '201':
 *        description: User created successfully
 *      '500':
 *        description: Internal server error
 */

// Create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const query = "INSERT INTO user (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while creating user",
        error: err,
      });
    } else {
      res
        .status(201)
        .json({ message: "User created successfully", data: results });
    }
  });
});

/**
 * @openapi
 * /users/{id}:
 *  patch:
 *    description: Partially update user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: User updated successfully
 *      '400':
 *        description: No fields to update
 *      '404':
 *        description: User not found
 *      '500':
 *        description: Internal server error
 */

// Partially update user by id (PATCH)
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const updateFields = req.body;
  const fieldNames = Object.keys(updateFields);
  if (fieldNames.length === 0) {
    return res.status(400).json({
      message: "No fields to update",
    });
  }

  let query = "UPDATE user SET ";
  const values = [];
  for (let i = 0; i < fieldNames.length; i++) {
    query += `${fieldNames[i]} = ?`;
    values.push(updateFields[fieldNames[i]]);
    if (i !== fieldNames.length - 1) {
      query += ", ";
    }
  }
  query += " WHERE id = ?";
  values.push(id);

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while updating user",
        error: err,
      });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  });
});

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    description: Delete user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: User deleted successfully
 *      '404':
 *        description: User not found
 *      '500':
 *        description: Internal server error
 */

// Delete user by id
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const query = "DELETE FROM user WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while deleting user",
        error: err,
      });
    } else if (results.affectedRows === 0) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  });
});

/**
 * @openapi
 * /users/search/{name}:
 *  get:
 *    description: Search users by name
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: The name to search for
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: A list of users matching the search criteria
 *      '400':
 *        description: Name parameter is required for search
 *      '500':
 *        description: Internal server error
 */

// Search users by name
app.get("/users/search/:name", (req, res) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({
      message: "Name parameter is required for search",
    });
  }

  const query = "SELECT * FROM user WHERE name LIKE ?";
  db.query(query, [`%${name}%`], (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while searching users",
        error: err,
      });
    } else {
      res
        .status(200)
        .json({ message: "Users retrieved successfully", data: results });
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
