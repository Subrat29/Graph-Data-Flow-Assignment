// src/models/edge.js
const mongoose = require("mongoose");

const edgeSchema = new mongoose.Schema({
  srcNode: { type: String, ref: "Node", required: true },
  dstNode: { type: String, ref: "Node", required: true },
  srcToDstDataKeys: { type: Map, of: String },
});

module.exports = mongoose.model("Edge", edgeSchema);
