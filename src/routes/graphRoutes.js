// src/routes/graphRoutes.js
const express = require("express");
const router = express.Router();
const graphController = require("../controllers/graphController");

router.post("/graph", graphController.createGraph);
router.get("/graph/:graphId/validate", graphController.validateGraph);
router.post("/graph/:graphId/run", graphController.runGraph);
router.get("/run/:runId/node/:nodeId/output", graphController.getRunOutput);

module.exports = router;