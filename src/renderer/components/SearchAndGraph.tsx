import { useState, useEffect, useRef } from 'react';
import { FileCode2, Network, Search } from 'lucide-react';

interface NoteData {
  path: string;
  content: string;
}

interface SearchAndGraphProps {
  notesData: NoteData[];
  onSelectNote: (note: string) => void;
  selectedNote: string | null;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Link {
  source: string;
  target: string;
}

export default function SearchAndGraph({ notesData, onSelectNote, selectedNote }: SearchAndGraphProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Index notes content and build nodes + links relationships
  useEffect(() => {
    // 1. Setup nodes
    const activeNodes: Node[] = notesData.map((note, index) => {
      // Find matching label (basename of path without extension)
      const label = note.path.replace(/\.(md|mdx)$/, '');
      const angle = (index / notesData.length) * 2 * Math.PI || 0;
      const radius = 165 + ((index * 17) % 36);

      // Spawn nodes in circular pattern
      return {
        id: note.path,
        label,
        x: 300 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });

    // 2. Setup links (scanning wikilinks like [[Note Name]] in note body)
    const activeLinks: Link[] = [];
    const nodeLabelMap = new Map(activeNodes.map(n => [n.label.toLowerCase(), n.id]));

    notesData.forEach((note) => {
      const wikilinkRegex = /\[\[(.*?)\]\]/g;
      let match;
      while ((match = wikilinkRegex.exec(note.content)) !== null) {
        const targetLabel = match[1].trim().toLowerCase();
        const targetId = nodeLabelMap.get(targetLabel);
        if (targetId && targetId !== note.path) {
          activeLinks.push({
            source: note.path,
            target: targetId,
          });
        }
      }
    });

    setNodes(activeNodes);
    setLinks(activeLinks);
  }, [notesData]);

  // Force-directed simulation ticks
  useEffect(() => {
    if (nodes.length === 0) return;

    let animId: number;
    const width = 600;
    const height = 500;
    const kForce = 0.05; // link strength
    const kRepel = 250; // repulsion strength
    const kCenter = 0.01; // centering strength
    const friction = 0.85;

    const tick = () => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map(n => ({ ...n }));

        // 1. Repulsion force between node pairs
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n1 = nextNodes[i];
            const n2 = nextNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 200) {
              const force = kRepel / (dist * dist);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // 2. Attraction force along link paths
        links.forEach((link) => {
          const sNode = nextNodes.find(n => n.id === link.source);
          const tNode = nextNodes.find(n => n.id === link.target);
          if (sNode && tNode) {
            const dx = tNode.x - sNode.x;
            const dy = tNode.y - sNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = dist * kForce;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            sNode.vx += fx;
            sNode.vy += fy;
            tNode.vx -= fx;
            tNode.vy -= fy;
          }
        });

        // 3. Gravity/Center force
        nextNodes.forEach((n) => {
          const cx = width / 2;
          const cy = height / 2;
          n.vx += (cx - n.x) * kCenter;
          n.vy += (cy - n.y) * kCenter;

          // Apply velocity and friction
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= friction;
          n.vy *= friction;

          // Constrain to border bounds
          n.x = Math.max(40, Math.min(width - 40, n.x));
          n.y = Math.max(40, Math.min(height - 40, n.y));
        });

        return nextNodes;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [links, nodes.length]);

  const handleNodeClick = (id: string) => {
    onSelectNote(id);
  };

  // Filter notes/results matching search
  const searchFilteredNotes = notesData.filter((note) => {
    const label = note.path.replace(/\.(md|mdx)$/, '');
    const matchesSearch = label.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return searchTerm !== '' && matchesSearch;
  });

  return (
    <div className="canvas-surface flex h-full w-full flex-col font-sans">
      {/* Header bar */}
      <header className="pane-header flex items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 text-accent">
          <Network className="h-4 w-4" />
          <span className="text-xs font-medium text-primary">Knowledge graph</span>
          <span className="font-mono text-[11px] text-muted">{nodes.length} notes · {links.length} links</span>
        </div>
        <label className="relative w-72">
          <span className="sr-only">Search note content</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search filenames and content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field py-1.5 pl-8 pr-3 font-mono text-xs"
          />
        </label>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Dynamic Visual Graph */}
        <div className="relative flex-1 select-none">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 600 500"
          >
            {/* Draw Links */}
            {links.map((link, idx) => {
              const sNode = nodes.find(n => n.id === link.source);
              const tNode = nodes.find(n => n.id === link.target);
              if (!sNode || !tNode) return null;
              return (
                <line
                  key={`link-${idx}`}
                  x1={sNode.x}
                  y1={sNode.y}
                  x2={tNode.x}
                  y2={tNode.y}
                  className="stroke-slate-700 stroke-[1.25px]"
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNote === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="graph-node group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${node.label}`}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleNodeClick(node.id);
                    }
                  }}
                >
                  {/* Outer glow wrapper */}
                  <circle
                    r={isSelected ? 10 : 6}
                    className={`interactive ${
                      isSelected
                        ? 'fill-emerald-400/20 stroke-emerald-300 stroke-2'
                        : 'fill-slate-900 stroke-slate-600 stroke-1 group-hover:fill-emerald-400/10 group-hover:stroke-emerald-300'
                    }`}
                  />
                  {/* Inner Node Center */}
                  <circle
                    r={isSelected ? 4 : 2}
                    className={isSelected ? 'fill-emerald-300' : 'fill-slate-400 group-hover:fill-emerald-300'}
                  />
                  {/* Text labels */}
                  <text
                    y={-12}
                    className={`pointer-events-none select-none text-center font-mono text-[9px] font-medium ${
                      isSelected
                        ? 'fill-emerald-300'
                        : 'fill-slate-500 group-hover:fill-slate-200'
                    }`}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
          {nodes.length === 0 && <div className="absolute inset-0 grid place-items-center text-sm text-muted">Create two linked notes to map their relationship.</div>}
          <div className="absolute bottom-3 right-4 font-mono text-[10px] text-muted">
            Wiki-links connect matching filenames
          </div>
        </div>

        {/* Right Side: Graph Search Content Matches */}
        {searchTerm !== '' && (
          <aside aria-label="Graph search results" className="work-surface flex w-80 flex-col overflow-y-auto border-l p-3 font-mono">
            <h2 className="mb-2 flex items-center justify-between border-b divider-color pb-2 text-xs font-medium text-secondary"><span>Search results</span><span className="tabular-nums text-muted">{searchFilteredNotes.length}</span></h2>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {searchFilteredNotes.map((note) => {
                const label = note.path.replace(/\.(md|mdx)$/, '');
                return (
                  <button
                    type="button"
                    key={note.path}
                    onClick={() => handleNodeClick(note.path)}
                    className="interactive note-row flex w-full cursor-pointer flex-col gap-1 p-2.5 text-left"
                  >
                    <span className="flex items-center gap-1.5 truncate text-xs font-medium text-primary"><FileCode2 className="h-3.5 w-3.5 text-accent" />{label}</span>
                    <p className="line-clamp-3 text-[10px] leading-4 text-secondary">{note.content}</p>
                  </button>
                );
              })}
              {searchFilteredNotes.length === 0 && (
                <span className="block px-2 py-8 text-center text-xs leading-5 text-muted">No note content matches this query.</span>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
