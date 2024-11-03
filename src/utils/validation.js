// src/utils/validation.js
const validateGraphStructure = (graph) => {
    const errors = [];
    
    // Example validation: Check for circular dependencies
    const visited = new Set();
    const stack = new Set();
  
    const hasCycle = (node) => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;
  
      visited.add(node);
      stack.add(node);
  
      const nodeData = graph.nodes.find((n) => n._id.toString() === node);
      if (nodeData) {
        for (const edge of nodeData.pathsOut) {
          if (hasCycle(edge.dstNode.toString())) {
            errors.push(`Cycle detected involving node ${nodeData.nodeId}`);
            return true;
          }
        }
      }
      stack.delete(node);
      return false;
    };
  
    graph.nodes.forEach((node) => {
      if (!visited.has(node._id.toString())) hasCycle(node._id.toString());
    });
  
    return errors;
  };
  
  module.exports = { validateGraphStructure };
  