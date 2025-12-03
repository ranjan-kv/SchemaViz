/**
 * Converts ER diagram JSON to DOT language (Graphviz) format with proper ER notation
 * @param {Object} schema - Schema object with entities and relationships
 * @returns {string} - DOT format string
 */
export function convertToDot(schema) {
    let dot = 'digraph ERD {\n';
    dot += '  // Graph settings\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [fontname="Arial"];\n';
    dot += '  edge [fontname="Arial", fontsize=10];\n\n';

    const entities = schema.entities || {};
    const relationships = schema.relationships || {};

    // Add entities as rectangles
    dot += '  // Entities\n';
    for (const [entityName, entityData] of Object.entries(entities)) {
        dot += `  ${entityName} [shape=box, style="rounded,filled", fillcolor="#90EE90", label="${entityName}"];\n`;
    }
    dot += '\n';

    // Add attributes as ovals connected to entities
    dot += '  // Attributes\n';
    for (const [entityName, entityData] of Object.entries(entities)) {
        const attributes = entityData.attributes || {};
        for (const [attrName, attrData] of Object.entries(attributes)) {
            const attrNode = `${entityName}_${attrName}`;
            const isKey = attrData.isKey || false;
            const fillColor = isKey ? '#FFD700' : '#E0E0E0';
            const label = isKey ? `<${attrName}>` : attrName;

            dot += `  ${attrNode} [shape=ellipse, style=filled, fillcolor="${fillColor}", label="${label}"];\n`;
            dot += `  ${attrNode} -> ${entityName} [arrowhead=none];\n`;
        }
    }
    dot += '\n';

    // Add relationships as diamonds
    dot += '  // Relationships\n';
    for (const [relName, relData] of Object.entries(relationships)) {
        const relNode = `rel_${relName}`;
        dot += `  ${relNode} [shape=diamond, style=filled, fillcolor="#87CEEB", label="${relName}"];\n`;

        const card1 = relData.cardinality1 || '1';
        const card2 = relData.cardinality2 || '1';

        dot += `  ${relData.entity1} -> ${relNode} [label="${card1}", arrowhead=none];\n`;
        dot += `  ${relNode} -> ${relData.entity2} [label="${card2}", arrowhead=none];\n`;
    }

    dot += '}';
    return dot;
}

/**
 * Enhanced DOT format with colors and styling for ER diagrams
 * @param {Object} schema - Schema object with entities and relationships
 * @returns {string} - Styled DOT format
 */
export function convertToStyledDot(schema) {
    let dot = 'digraph ERD {\n';
    dot += '  // Graph styling\n';
    dot += '  graph [bgcolor="#f8f9fa", pad="0.5", ranksep="2", nodesep="1.5"];\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [fontname="Arial", fontsize=12];\n';
    dot += '  edge [fontname="Arial", fontsize=10, color="#666666"];\n\n';

    const entities = schema.entities || {};
    const relationships = schema.relationships || {};

    // Add entities as styled rectangles
    dot += '  // Entities\n';
    for (const [entityName, entityData] of Object.entries(entities)) {
        dot += `  ${entityName} [shape=box, style="rounded,filled", fillcolor="#90EE90", color="#228B22", penwidth=2, label="${entityName}"];\n`;
    }
    dot += '\n';

    // Add attributes as styled ovals
    dot += '  // Attributes\n';
    for (const [entityName, entityData] of Object.entries(entities)) {
        const attributes = entityData.attributes || {};
        for (const [attrName, attrData] of Object.entries(attributes)) {
            const attrNode = `${entityName}_${attrName}`;
            const isKey = attrData.isKey || false;
            const fillColor = isKey ? '#FFD700' : '#E8E8E8';
            const penColor = isKey ? '#DAA520' : '#999999';
            const label = isKey ? `<${attrName}>` : attrName;

            dot += `  ${attrNode} [shape=ellipse, style=filled, fillcolor="${fillColor}", color="${penColor}", penwidth=1.5, label="${label}"];\n`;
            dot += `  ${attrNode} -> ${entityName} [arrowhead=none, color="#999999"];\n`;
        }
    }
    dot += '\n';

    // Add relationships as styled diamonds
    dot += '  // Relationships\n';
    for (const [relName, relData] of Object.entries(relationships)) {
        const relNode = `rel_${relName}`;
        dot += `  ${relNode} [shape=diamond, style=filled, fillcolor="#87CEEB", color="#4682B4", penwidth=2, label="${relName}"];\n`;

        const card1 = relData.cardinality1 || '1';
        const card2 = relData.cardinality2 || '1';

        dot += `  ${relData.entity1} -> ${relNode} [label="${card1}", arrowhead=none, color="#4682B4", fontcolor="#333333"];\n`;
        dot += `  ${relNode} -> ${relData.entity2} [label="${card2}", arrowhead=none, color="#4682B4", fontcolor="#333333"];\n`;
    }

    dot += '}';
    return dot;
}
