import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Compass, Focus, GitBranch, LayoutGrid, Activity, RefreshCw } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { CytoscapeGraph } from '../../components/graph/CytoscapeGraph';
import { Magnetic } from '../../components/ui/Magnetic';

async function fetchSessionDetails(id: string) {
    // 1. Determine if we are running locally or in production
    const isDev = import.meta.env.DEV;

    // 2. Local uses the proxy route directly. Production uses the live hosted API server.
    const baseUrl = isDev
        ? ""
        : (import.meta.env.VITE_PROD_BACKEND_URL || "https://your-production-backend.onrender.com");

    const res = await fetch(`${baseUrl}/api/session/${id}`);
    if (!res.ok) throw new Error("Data layer inaccessible");
    return res.json();
}

export default function SessionDashboard() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['session', id],
        queryFn: () => fetchSessionDetails(id || ''),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <div className="flex w-screen h-screen items-center justify-center font-mono text-accent-cyan bg-[#050814]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin shadow-[0_0_10px_#00F5FF]" />
                    <span className="animate-pulse tracking-widest text-xs mt-2">DECRYPTING SEMANTIC TOPOLOGY...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-screen h-screen flex-col items-center justify-center font-mono text-accent-pink bg-[#050814] gap-4">
                <span className="tracking-widest font-bold">DATA DECRYPTION FAILURE</span>
                <span className="text-xs text-text-secondary">{(error as Error).message}</span>
                <button 
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 text-xs border border-accent-pink/30 hover:border-accent-pink rounded-[8px] transition-colors"
                >
                    Retry connection
                </button>
            </div>
        );
    }

    // Fallback structural constants for preview loops if endpoint hasn't received payload rows yet
    const session = data || {
        metrics: { curiosity_score: 82, focus_score: 64, total_clusters: 4, total_nodes: 18 },
        graph: { nodes: [], edges: [] }
    };

    const nodes = session.graph.nodes || [];
    const edges = session.graph.edges || [];

    // Group nodes by cluster to show cluster sizes
    const clusterMap: { [key: number]: number } = {};
    nodes.forEach((n: any) => {
        const cId = Number(n.data.clusterId || 0);
        clusterMap[cId] = (clusterMap[cId] || 0) + 1;
    });

    const getClusterColorClass = (clusterId?: string | number) => {
        const id = Number(clusterId || 0);
        if (id === 0) return 'bg-accent-cyan shadow-[0_0_8px_#00F5FF]';
        if (id === 1) return 'bg-accent-purple shadow-[0_0_8px_#7C3AED]';
        if (id === 2) return 'bg-accent-pink shadow-[0_0_8px_#FF007F]';
        return 'bg-accent-success shadow-[0_0_8px_#39FF14]';
    };

    const getClusterTextColorClass = (clusterId?: string | number) => {
        const id = Number(clusterId || 0);
        if (id === 0) return 'text-accent-cyan';
        if (id === 1) return 'text-accent-purple';
        if (id === 2) return 'text-accent-pink';
        return 'text-accent-success';
    };

    const strokeDashoffset = 125 - (125 * session.metrics.curiosity_score) / 100;

    return (
        <div className="relative min-h-screen w-full px-8 py-10 z-10 max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* FLOATING GLASS NAVIGATION HEADER */}
            <GlassCard className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Magnetic>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00F5FF]" />
                            <h1 className="text-sm font-bold tracking-widest font-mono text-text-primary">RABBIT HOLE</h1>
                        </div>
                    </Magnetic>
                    <span className="h-4 w-[1px] bg-white/10" />
                    <span className="text-[10px] font-mono text-text-secondary uppercase">Session Analytics</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-text-secondary font-mono hidden md:inline truncate max-w-[250px]">
                        ID: {id || "LOCAL_DEV_PROTOTYPE"}
                    </span>
                    <Magnetic>
                        <button 
                            onClick={() => refetch()} 
                            disabled={isRefetching}
                            className="p-2 border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/15 rounded-[10px] transition-all cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-text-secondary ${isRefetching ? 'animate-spin' : ''}`} />
                        </button>
                    </Magnetic>
                </div>
            </GlassCard>

            {/* Main Bento Layout Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[160px]">

                {/* HERO CELL: Cytoscape Topology Engine Matrix */}
                <GlassCard className="lg:col-span-2 lg:row-span-4 p-4">
                    <CytoscapeGraph graphData={session.graph} />
                </GlassCard>

                {/* BENTO CELL 1: Curiosity Metrics (2 rows) */}
                <GlassCard className="p-6 flex flex-col justify-between lg:row-span-2">
                    <div className="flex justify-between items-start text-text-secondary">
                        <div>
                            <span className="font-mono text-[10px] font-bold tracking-widest block">CURIOSITY SCORE</span>
                            <span className="text-[9px] text-text-secondary font-mono mt-0.5 block">Exploration depth factor</span>
                        </div>
                        <Compass className="w-4 h-4 text-accent-cyan" />
                    </div>

                    <div className="flex items-center justify-between gap-4 my-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold tracking-tight text-accent-cyan">
                                <AnimatedCounter to={session.metrics.curiosity_score} />
                            </span>
                            <span className="text-accent-success text-[10px] font-mono font-medium">↗ +12%</span>
                        </div>

                        {/* Animated SVG circular meter */}
                        <div className="relative shrink-0 flex items-center justify-center">
                            <svg className="w-14 h-14 transform -rotate-90">
                                <circle cx="28" cy="28" r="20" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="3.5" fill="transparent" />
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="20"
                                    stroke="var(--color-accent-cyan)"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    strokeDasharray="125"
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-[9px] font-mono font-bold text-accent-cyan">
                                {session.metrics.curiosity_score}%
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                        <span className="text-[10px] font-mono text-text-secondary block">
                            Status: <span className="text-accent-cyan font-bold">Deep Explorer Mode</span>
                        </span>
                    </div>
                </GlassCard>

                {/* BENTO CELL 2: Focus Score (1 row) */}
                <GlassCard className="p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-text-secondary">
                        <span className="font-mono text-[10px] font-bold tracking-widest">FOCUS FACTOR</span>
                        <Focus className="w-4 h-4 text-accent-purple" />
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tight text-text-primary">
                                <AnimatedCounter to={session.metrics.focus_score} />
                            </span>
                            <span className="text-[10px] text-text-secondary font-mono">/ 100</span>
                        </div>
                        <span className="text-accent-purple text-[10px] font-mono font-semibold uppercase">Stable State</span>
                    </div>
                </GlassCard>

                {/* BENTO CELL 3: Cluster Count / Rabbit Holes (1 row) */}
                <GlassCard className="p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-text-secondary">
                        <span className="font-mono text-[10px] font-bold tracking-widest">RABBIT HOLES</span>
                        <GitBranch className="w-4 h-4 text-accent-pink" />
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-4xl font-bold tracking-tight text-accent-pink">
                            <AnimatedCounter to={session.metrics.total_clusters} />
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono uppercase">semantic branches</span>
                    </div>
                </GlassCard>

                {/* BENTO CELL 4: Timeline Activity Feed (ColSpan 2, RowSpan 2) */}
                <GlassCard className="lg:col-span-2 lg:row-span-2 p-6 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-accent-cyan animate-pulse animate-duration-3000" />
                            <span className="font-mono text-[10px] font-bold tracking-widest">CHRONOLOGICAL TRAIL</span>
                        </div>
                        <span className="text-[9px] text-text-secondary font-mono">{nodes.length} nodes logged</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex flex-col gap-3.5">
                            {nodes.length === 0 ? (
                                <div className="text-text-secondary font-mono text-[11px] text-center py-10">
                                    No node details present. Begin browsing with the extension.
                                </div>
                            ) : (
                                nodes.map((node: any, index: number) => (
                                    <div key={node.id} className="flex gap-4 items-start relative group">
                                        {index < nodes.length - 1 && (
                                            <div className="absolute left-[5px] top-[14px] w-[1px] h-full bg-white/5 group-hover:bg-white/10 transition-colors" />
                                        )}
                                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${getClusterColorClass(node.data.clusterId)}`} />
                                        
                                        <div className="flex-1 min-w-0 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-[10px] px-3.5 py-2.5 transition-all">
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[11px] font-medium text-text-primary font-mono truncate">
                                                    {node.data.title}
                                                </span>
                                                <span className="text-[8px] font-mono shrink-0 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.02] text-text-secondary uppercase">
                                                    {node.data.eventType || 'navigate'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className={`text-[9px] font-mono ${getClusterTextColorClass(node.data.clusterId)}`}>
                                                    Thread #{node.data.clusterId ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* BENTO CELL 5: Sampled Pages Stats (1 col, 2 rows) */}
                <GlassCard className="p-6 flex flex-col justify-between gap-4 lg:row-span-2">
                    <div className="flex justify-between items-start text-text-secondary border-b border-white/5 pb-3">
                        <span className="font-mono text-[10px] font-bold tracking-widest">THREAD DISTRIBUTION</span>
                        <LayoutGrid className="w-4 h-4 text-accent-success" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[11px] font-mono text-text-secondary">Total Nodes</span>
                            <span className="text-xl font-bold font-mono text-text-primary">
                                <AnimatedCounter to={session.metrics.total_nodes} />
                            </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-[11px] font-mono text-text-secondary">Total Edges</span>
                            <span className="text-xl font-bold font-mono text-text-primary">
                                <AnimatedCounter to={edges.length} />
                            </span>
                        </div>

                        {/* Thread node sizes lists */}
                        <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
                            <span className="text-[9px] font-mono text-text-secondary uppercase block mb-1">Nodes per Thread</span>
                            <div className="flex flex-col gap-1.5 max-h-[90px] overflow-y-auto custom-scrollbar">
                                {Object.entries(clusterMap).map(([clusterId, count]) => (
                                    <div key={clusterId} className="flex justify-between items-center text-[10px] font-mono">
                                        <span className={`flex items-center gap-1.5 ${getClusterTextColorClass(clusterId)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getClusterColorClass(clusterId)}`} />
                                            Thread #{clusterId}
                                        </span>
                                        <span className="text-text-primary font-bold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 text-[10px] font-mono text-text-secondary">
                        Processing: <span className="text-accent-success font-bold">{session.processingTimeMs || 0}ms</span>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}