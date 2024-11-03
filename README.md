```
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── graphController.js
│   ├── models
│   │   ├── edge.js
│   │   ├── graph.js
│   │   ├── node.js
│   │   └── run.js
│   ├── routes
│   │   └── graphRoutes.js
│   ├── utils
│   │   └── validation.js
│   └── app.js
└── .env
└── package.json
```

Here are several test cases for verifying different scenarios in the backend with Postman. These cases will ensure that graph creation, validation, running, and output retrieval work as expected.

### 1. **Test Case: Create Graph**

**Endpoint:** `POST /api/graph`  
**Description:** This request creates a simple graph with two nodes and one edge between them.

#### Request Body:
```json
{
  "nodes": [
    {
      "nodeId": "node1",
      "dataIn": {},
      "dataOut": {},
      "pathsIn": [],
      "pathsOut": []
    },
    {
      "nodeId": "node2",
      "dataIn": {},
      "dataOut": {},
      "pathsIn": [],
      "pathsOut": []
    }
  ],
  "edges": [
    {
      "srcNode": "node1",
      "dstNode": "node2",
      "srcToDstDataKeys": { "outputKey": "inputKey" }
    }
  ]
}
```

#### Expected Response:
- **Status**: `201 Created`
- **Body**:
  ```json
  {
    "graph": {
      "_id": "your_graph_id",
      "nodes": [
        { "nodeId": "node1", "dataIn": {}, "dataOut": {}, "_id": "node1_id" },
        { "nodeId": "node2", "dataIn": {}, "dataOut": {}, "_id": "node2_id" }
      ],
      "edges": [
        {
          "srcNode": "node1_id",
          "dstNode": "node2_id",
          "srcToDstDataKeys": { "outputKey": "inputKey" }
        }
      ]
    }
  }
  ```

### 2. **Test Case: Validate Graph (Simple Valid Graph)**

**Endpoint:** `GET /api/graph/:graphId/validate`  
**Description:** Verifies that a created graph is valid (no cycles, all nodes connected, and correct data mapping).

#### Expected Response:
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "message": "Graph is valid"
  }
  ```

### 3. **Test Case: Validate Graph (Invalid due to Cycle)**

**Request:** Add an edge that points back from `node2` to `node1` in the graph created above.

#### New Edge Request Body:
```json
{
  "srcNode": "node2",
  "dstNode": "node1",
  "srcToDstDataKeys": {}
}
```

**Endpoint:** `GET /api/graph/:graphId/validate`

#### Expected Response:
- **Status**: `400 Bad Request`
- **Body**:
  ```json
  {
    "errors": ["Cycle detected involving node node1"]
  }
  ```

### 4. **Test Case: Run Graph with Root Inputs and Data Overwrites**

**Endpoint:** `POST /api/graph/:graphId/run`  
**Description:** Runs the graph with a set of `rootInputs` and `dataOverwrites`.

#### Request Body:
```json
{
  "rootInputs": {
    "node1": {
      "inputKey": "initialValue"
    }
  },
  "dataOverwrites": {
    "node2": {
      "inputKey": "overwriteValue"
    }
  },
  "enableList": ["node1", "node2"]
}
```

#### Expected Response:
- **Status**: `201 Created`
- **Body**:
  ```json
  {
    "runId": "your_run_id",
    "run": {
      "runId": "your_run_id",
      "graphId": "your_graph_id",
      "rootInputs": { "node1": { "inputKey": "initialValue" } },
      "dataOverwrites": { "node2": { "inputKey": "overwriteValue" } },
      "enableList": ["node1", "node2"],
      "disableList": []
    }
  }
  ```

### 5. **Test Case: Get Node Output After Run**

**Endpoint:** `GET /api/run/:runId/node/:nodeId/output`  
**Description:** Retrieve the output data of `node2` from the graph run.

#### Expected Response:
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "output": { "inputKey": "overwriteValue" }
  }
  ```

### 6. **Test Case: Run Graph with Disabled Node**

**Endpoint:** `POST /api/graph/:graphId/run`  
**Description:** Runs the graph with `node2` disabled, which should result in `node2` being skipped.

#### Request Body:
```json
{
  "rootInputs": {
    "node1": { "inputKey": "initialValue" }
  },
  "disableList": ["node2"]
}
```

#### Expected Response:
- **Status**: `201 Created`
- **Body**:
  ```json
  {
    "runId": "your_run_id",
    "run": {
      "runId": "your_run_id",
      "graphId": "your_graph_id",
      "rootInputs": { "node1": { "inputKey": "initialValue" } },
      "dataOverwrites": {},
      "enableList": [],
      "disableList": ["node2"]
    }
  }
  ```

### 7. **Test Case: Retrieve All Nodes for a Graph**

**Endpoint:** `GET /api/graph/:graphId/nodes`  
**Description:** Retrieves all nodes within a specific graph.

#### Expected Response:
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "nodes": [
      {
        "_id": "node1_id",
        "nodeId": "node1",
        "dataIn": {},
        "dataOut": {},
        "pathsIn": [],
        "pathsOut": []
      },
      {
        "_id": "node2_id",
        "nodeId": "node2",
        "dataIn": {},
        "dataOut": {},
        "pathsIn": [],
        "pathsOut": []
      }
    ]
  }
  ```

### 8. **Test Case: Retrieve All Edges for a Graph**

**Endpoint:** `GET /api/graph/:graphId/edges`  
**Description:** Retrieves all edges within a specific graph.

#### Expected Response:
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "edges": [
      {
        "_id": "edge_id",
        "srcNode": "node1_id",
        "dstNode": "node2_id",
        "srcToDstDataKeys": { "outputKey": "inputKey" }
      }
    ]
  }
  ```

### 9. **Test Case: Error Handling for Non-Existent Graph or Node**

**Endpoint:** `GET /api/run/:runId/node/:nonExistentNodeId/output`  
**Description:** Attempt to retrieve output from a node that doesn’t exist in the specified run.

#### Expected Response:
- **Status**: `404 Not Found`
- **Body**:
  ```json
  {
    "error": "Output not found for node"
  }
  ```

---