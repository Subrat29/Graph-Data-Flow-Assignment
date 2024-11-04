# Graph-Data-Flow-Assignment Backend

## Overview

This project provides a RESTful API for creating, validating, executing, and retrieving output data from a graph-based processing system. Each graph is composed of nodes and edges, allowing for flexible workflows with data validation, cyclic detection, and controlled execution. This backend is built with Node.js and Express and interfaces with a MongoDB database.

## Project Structure

The project has the following structure:

```
.
├── src
│   ├── config
│   │   └── db.js                 # Database configuration and connection setup
│   ├── controllers
│   │   └── graphController.js    # Controller logic for handling graph-related endpoints
│   ├── models
│   │   ├── edge.js               # Mongoose schema/model for edges
│   │   ├── graph.js              # Mongoose schema/model for graphs
│   │   ├── node.js               # Mongoose schema/model for nodes
│   │   └── run.js                # Mongoose schema/model for graph runs
│   ├── routes
│   │   └── graphRoutes.js        # API route definitions
│   ├── utils
│   │   └── validation.js         # Graph validation logic
│   └── app.js                    # Main application entry point
├── .env                          # Environment variables
└── package.json                  # Project dependencies and scripts
```

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Subrat29/Graph-Data-Flow-Assignment.git
   cd Graph-Data-Flow-Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Configure your `.env` file based on `.env.example` with the following variables:
   - `MONGO_URI` - MongoDB connection string

4. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### 1. **Create Graph**

   - **Endpoint:** `POST /api/graph`
   - **Description:** Creates a new graph with nodes and edges.
   - **Request Body:**
     ```json
     {
       "nodes": [
         { "nodeId": "node1", "dataIn": {}, "dataOut": {} },
         { "nodeId": "node2", "dataIn": {}, "dataOut": {} }
       ],
       "edges": [
         { "srcNode": "node1", "dstNode": "node2", "srcToDstDataKeys": { "outputKey": "inputKey" } }
       ]
     }
     ```
   - **Response:** `201 Created` with the graph data.

### 2. **Validate Graph**

   - **Endpoint:** `GET /api/graph/:graphId/validate`
   - **Description:** Validates the graph structure, checking for cycles, disconnected nodes, and edge compatibility.
   - **Response:** `200 OK` if valid, or `400 Bad Request` with validation errors.

### 3. **Run Graph**

   - **Endpoint:** `POST /api/graph/:graphId/run`
   - **Description:** Executes a graph run with specified root inputs, data overwrites, and enabled/disabled nodes.
   - **Request Body:**
     ```json
     {
       "rootInputs": { "node1": { "inputKey": "initialValue" } },
       "dataOverwrites": { "node2": { "inputKey": "overwriteValue" } },
       "enableList": ["node1", "node2"]
     }
     ```
   - **Response:** `201 Created` with run details.

### 4. **Get Node Output**

   - **Endpoint:** `GET /api/run/:runId/node/:nodeId/output`
   - **Description:** Retrieves the output of a specific node in a graph run.
   - **Response:** `200 OK` with the node output data.

### 5. **Retrieve All Nodes**

   - **Endpoint:** `GET /api/graph/:graphId/nodes`
   - **Description:** Fetches all nodes in the specified graph.
   - **Response:** `200 OK` with node details.

### 6. **Retrieve All Edges**

   - **Endpoint:** `GET /api/graph/:graphId/edges`
   - **Description:** Fetches all edges in the specified graph.
   - **Response:** `200 OK` with edge details.

### 7. **Error Handling for Non-Existent Node**

   - **Endpoint:** `GET /api/run/:runId/node/:nonExistentNodeId/output`
   - **Description:** Returns a 404 error if the node does not exist in the specified run.
   - **Response:** `404 Not Found` with error message.

## Test Cases

The following test cases ensure correct functionality of the API endpoints. Use a tool like Postman to test each endpoint:

1. **Create Graph** - Verifies the graph creation with nodes and edges.
2. **Validate Graph (Simple Valid Graph)** - Checks that a valid graph passes validation.
3. **Validate Graph (Invalid due to Cycle)** - Adds a cycle to test cycle detection.
4. **Run Graph with Root Inputs and Data Overwrites** - Executes the graph with initial input and overwritten data.
5. **Get Node Output After Run** - Retrieves output data from a specific node post-run.
6. **Run Graph with Disabled Node** - Executes the graph with a node disabled to check correct exclusion.
7. **Retrieve All Nodes for a Graph** - Confirms all nodes are returned for a given graph.
8. **Retrieve All Edges for a Graph** - Confirms all edges are returned for a given graph.
9. **Error Handling for Non-Existent Graph or Node** - Tests error responses for invalid graph or node IDs.

## Future Enhancements

1. **Authentication and Authorization** - Add user-based authentication to restrict access.
2. **Graph Data Export** - Enable data export for offline analysis or backup.
3. **Enhanced Validation Rules** - Improve validation to handle more complex scenarios.
4. **Graph Analytics** - Add statistics on graph complexity, execution time, and performance metrics.

## Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change. Pull requests are welcome, but make sure to follow the style guide and add relevant tests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For any queries or issues, please contact subratyadav29@example.com.

---