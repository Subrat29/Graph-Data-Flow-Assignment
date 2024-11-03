// src/controllers/graphController.js
const Graph = require("../models/graph");
const Node = require("../models/node");
const Edge = require("../models/edge");
const Run = require("../models/run");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { validateGraphStructure } = require("../utils/validation");

// 1. Create Graph
exports.createGraph = async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    
    console.log("nodes: ", nodes);
    console.log("edges: ", edges);

    // Step 1: Create nodes and edges
    const savedNodes = await Node.insertMany(nodes);
    console.log("savedNodes: ", savedNodes);
    
    const savedEdges = await Edge.insertMany(edges);
    console.log("savedEdges: ", savedEdges);


    // Step 2: Create Graph
    const newGraph = new Graph({ nodes: savedNodes, edges: savedEdges });

    console.log("newGraph: ", newGraph);

    await newGraph.save();

    res.status(201).json({ graph: newGraph });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Validate Graph
exports.validateGraph = async (req, res) => {
  try {
    const { graphId } = req.params;
    const graph = await Graph.findById(graphId).populate("nodes edges");

    if (!graph) return res.status(404).json({ error: "Graph not found" });

    const validationErrors = validateGraphStructure(graph);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    res.status(200).json({ message: "Graph is valid" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Run Graph
exports.runGraph = async (req, res) => {
  try {
    const { graphId } = req.params;
    const { rootInputs, dataOverwrites, enableList, disableList } = req.body;

    const graph = await Graph.findById(graphId).populate("nodes edges");
    if (!graph) return res.status(404).json({ error: "Graph not found" });

    // Generate a new run ID
    const runId = uuidv4();

    // Create and save the run configuration
    const newRun = new Run({
      runId,
      graphId: graph._id,
      rootInputs,
      dataOverwrites,
      enableList,
      disableList,
    });
    await newRun.save();

    res.status(201).json({ runId, run: newRun });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get Run Output for a Node
exports.getRunOutput = async (req, res) => {
  try {
    const { runId, nodeId } = req.params;
    const run = await Run.findOne({ runId });
    if (!run) return res.status(404).json({ error: "Run not found" });

    const output = run.outputs.get(nodeId);
    if (!output) return res.status(404).json({ error: "Output not found for node" });

    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
