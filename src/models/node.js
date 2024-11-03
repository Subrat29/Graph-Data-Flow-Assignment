// src/models/node.js
const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
    nodeId: { type: String, unique: true, required: true },
    dataIn: { type: Map, of: mongoose.Schema.Types.Mixed },
    dataOut: { type: Map, of: mongoose.Schema.Types.Mixed },
    pathsIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Edge" }],
    pathsOut: [{ type: mongoose.Schema.Types.ObjectId, ref: "Edge" }],
});

module.exports = mongoose.model("Node", nodeSchema);
