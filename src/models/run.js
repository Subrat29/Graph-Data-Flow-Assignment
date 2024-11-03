// src/models/run.js
const mongoose = require("mongoose");

const runSchema = new mongoose.Schema({
  runId: { type: String, unique: true, required: true },
  graphId: { type: mongoose.Schema.Types.ObjectId, ref: "Graph", required: true },
  rootInputs: { type: Map, of: mongoose.Schema.Types.Mixed },
  dataOverwrites: { type: Map, of: mongoose.Schema.Types.Mixed },
  enableList: [String],
  disableList: [String],
  outputs: { type: Map, of: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("Run", runSchema);
