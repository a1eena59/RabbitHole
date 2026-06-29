// frontend/src/components/graph/CytoscapeGraph.tsx
import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

// Register the advanced organic clustering layout engine with Cytoscape
cytoscape.use(coseBilkent);

interface GraphNode {
    id: string;
    data: {
        title: string;
        clusterId: number; // Controlled by the backend DBSCAN model
    };
}

interface GraphEdge {
    id: string;
    source: string;
    target: string;
    drift: boolean; // lock to chronological browsing sequence metrics
}

interface CytoscapeGraphProps {
    graphData: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
}

export function CytoscapeGraph({ graphData }: CytoscapeGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timersRef = useRef<number[]>([]);

    const clearAllTimers = () => {
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];
    };

    useEffect(() => {
        if (!containerRef.current || !graphData.nodes.length) return;

        clearAllTimers();

        // 1. Initialize Cytoscape frame mapping with clean styles
        const cy = cytoscape({
            container: containerRef.current,
            elements: [],
            boxSelectionEnabled: false,
            style: [
                {
                    selector: 'node',
                    style: {
                        'width': '34px',
                        'height': '34px',
                        'background-color': '#111827',
                        'border-width': '2px',
                        'border-color': '#00F5FF',
                        'label': 'data(label)',
                        'color': '#F8FAFC',
                        'font-size': '10px',
                        'font-family': 'monospace',
                        'text-margin-y': 6,
                        'text-wrap': 'wrap',
                        'text-max-width': '100px',
                        'shadow-color': '#00F5FF',
                        'shadow-blur': '6px',
                        'shadow-opacity': 0.4,
                        'transition-property': 'background-color, border-color, shadow-blur',
                        'transition-duration': 0.3
                    }
                },
                {
                    // Visual styling for DBSCAN categorized outlier noise points
                    selector: 'node[clusterId = -1]',
                    style: {
                        'border-color': '#FF007F',
                        'background-color': 'rgba(255, 0, 127, 0.15)',
                        'border-style': 'dashed',
                        'shadow-color': '#FF007F',
                        'shadow-blur': '4px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'rgba(0, 245, 255, 0.4)',
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': 'rgba(0, 245, 255, 0.4)',
                        'arrow-scale': 0.8,
                        'line-style': 'dashed',
                        'line-dash-pattern': [6, 4],
                        'line-dash-offset': 0
                    }
                },
                {
                    // Animate distinct stroke dashes across cluster boundaries
                    selector: 'edge[isDrift]',
                    style: {
                        'line-color': 'rgba(255, 0, 127, 0.45)',
                        'target-arrow-color': 'rgba(255, 0, 127, 0.45)'
                    }
                },
                {
                    selector: 'node:hover',
                    style: {
                        'background-color': '#00F5FF',
                        'border-color': '#FFFFFF',
                        'shadow-color': '#FFFFFF',
                        'shadow-blur': '14px',
                        'scale': 1.15
                    }
                }
            ] as any,
            layout: {
                name: 'cose-bilkent',
                randomize: true,
                tile: true
            } as any
        });

        // 2. Premium Light Travel Particle Animation Loop
        let offset = 0;
        let animationFrameId: number;

        const animateEdges = () => {
            offset = (offset - 0.4) % 40;
            if (!cy.destroyed()) {
                cy.style().selector('edge').style('line-dash-offset', offset).update();
                animationFrameId = requestAnimationFrame(animateEdges);
            }
        };
        animateEdges();

        // 3. Sequential Graph Physics Construction Replay Loop
        const addedNodes = new Set<string>();

        graphData.nodes.forEach((node, index) => {
            const timer = window.setTimeout(() => {
                if (cy.destroyed()) return;

                // Insert structural node properties cleanly
                cy.add({
                    group: 'nodes',
                    data: {
                        id: node.id,
                        label: node.data.title.length > 20 ? `${node.data.title.substring(0, 20)}...` : node.data.title,
                        clusterId: node.data.clusterId
                    }
                });

                addedNodes.add(node.id);

                // Dynamically build edges out chronologically as endpoints resolve
                graphData.edges.forEach(edge => {
                    if ((edge.source === node.id && addedNodes.has(edge.target)) ||
                        (edge.target === node.id && addedNodes.has(edge.source))) {
                        if (cy.getElementById(edge.id).length === 0) {
                            cy.add({
                                group: 'edges',
                                data: {
                                    id: edge.id,
                                    source: edge.source,
                                    target: edge.target,
                                    isDrift: edge.drift
                                }
                            });
                        }
                    }
                });

                // Execute the layout on each node addition step to simulate organic force-directed building physics
                const currentLayout = cy.makeLayout({
                    name: 'cose-bilkent',
                    animate: true,
                    animationDuration: 350,
                    randomize: false, // Maintain context structural layout coordinates across runtime ticks
                    fit: true,
                    padding: 40,
                    nodeRepulsion: 4500,
                    idealEdgeLength: 75,
                    edgeElasticity: 0.45,
                    gravity: 0.25,
                    numIter: 100
                } as any);
                currentLayout.run();

            }, index * 250); // Paced evenly for visual impact

            timersRef.current.push(timer);
        });

        return () => {
            clearAllTimers();
            cancelAnimationFrame(animationFrameId);
            cy.destroy();
        };
    }, [graphData]);

    return (
        <div className="relative w-full h-full bg-[#070A1E]/40 rounded-[20px] overflow-hidden">
            <div className="absolute top-4 left-4 z-20 flex gap-2 font-mono text-[10px] text-text-secondary select-none">
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00F5FF]" />
                    Focus Thread
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-pink shadow-[0_0_8px_#FF007F]" />
                    Semantic Drift / Noise
                </span>
            </div>
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}