const validateGraphStructure = async (graph) => {
  const errors = [];
  const visited = new Set();
  const stack = new Set();

  console.log("Starting graph validation...");

  // Helper function to check for cycles
  const hasCycle = async (node) => {
    console.log(`Checking for cycles at node: ${node}`);
    if (stack.has(node)) {
      console.log(`Cycle detected: node ${node} is already in the stack.`);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    const nodeData = await graph.nodes.find((n) => n._id.toString() === node);
    if (nodeData) {
      for (const edge of nodeData.pathsOut) {
        if (hasCycle(edge.dstNode.toString())) {
          errors.push(`Cycle detected involving node ${nodeData.nodeId}`);
          console.log(`Cycle detected involving node ${nodeData.nodeId}`);
          return true;
        }
      }
    }
    stack.delete(node);
    return false;
  };

  // 1. Detect cycles in the graph
  console.log("Checking for cycles in the graph...");
  graph.nodes.forEach((node) => {
    if (!visited.has(node._id.toString())) {
      console.log(`Starting DFS for cycle detection from node ${node._id.toString()}`);
      hasCycle(node._id.toString());
    }
  });

  // 2. Check edge compatibility and duplicates
  const edgeSet = new Set();
  console.log("Checking for edge compatibility and duplicates...");
  graph.edges.forEach(async (edge) => {
    const srcNode = await graph.nodes.find((n) => n._id.toString() === edge.srcNode.toString());
    const dstNode = await graph.nodes.find((n) => n._id.toString() === edge.dstNode.toString());

    // Ensure that nodes in edges exist in the graph
    if (!srcNode || !dstNode) {
      errors.push(`Edge references non-existent nodes.`);
      console.log(`Error: Edge from ${edge.srcNode} to ${edge.dstNode} references non-existent nodes.`);
      return;
    }

    // Check for duplicate edges between the same src and dst
    const edgeKey = `${edge.srcNode.toString()}->${edge.dstNode.toString()}`;
    if (edgeSet.has(edgeKey)) {
      errors.push(`Duplicate edge detected from ${srcNode.nodeId} to ${dstNode.nodeId}`);
      console.log(`Duplicate edge detected from ${srcNode.nodeId} to ${dstNode.nodeId}`);
    } else {
      edgeSet.add(edgeKey);
    }

    // Check data type compatibility for each mapped key
    if (edge.srcToDstDataKeys) {
      for (const [srcKey, dstKey] of Object.entries(edge.srcToDstDataKeys)) {
        const srcType = typeof srcNode.dataOut[srcKey];
        const dstType = typeof dstNode.dataIn[dstKey];
        if (srcType !== dstType) {
          errors.push(
            `Incompatible data types between ${srcNode.nodeId}.${srcKey} (${srcType}) and ${dstNode.nodeId}.${dstKey} (${dstType})`
          );
          console.log(
            `Incompatible data types between ${srcNode.nodeId}.${srcKey} (${srcType}) and ${dstNode.nodeId}.${dstKey} (${dstType})`
          );
        }
      }
    }
  });

  // 3. Check for parity of edges (no islands)
  const visitedNodes = new Set();
  const traverse = async (nodeId) => {
    console.log(`Traversing for connected components from node: ${nodeId}`);
    if (visitedNodes.has(nodeId)) return;
    visitedNodes.add(nodeId);

    const node = await graph.nodes.find((n) => n._id.toString() === nodeId);
    if (node) {
      node.pathsOut.forEach((edge) => traverse(edge.dstNode.toString()));
      node.pathsIn.forEach((edge) => traverse(edge.srcNode.toString()));
    }
  };

  console.log("Checking for disconnected components (islands)...");
  await traverse(graph.nodes[0]._id.toString());
  if (visitedNodes.size !== graph.nodes.length) {
    errors.push(`The graph contains disconnected components (islands).`);
    console.log("Error: The graph contains disconnected components (islands).");
  }

  console.log("Graph validation completed with errors:", errors);
  return errors;
};

module.exports = { validateGraphStructure };
