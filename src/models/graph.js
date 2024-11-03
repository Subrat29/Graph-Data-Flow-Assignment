// src/models/graph.js
const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema({
  nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Node" }],
  edges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Edge" }],
});

module.exports = mongoose.model("Graph", graphSchema);
