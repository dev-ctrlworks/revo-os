"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import type { GraphEdge, GraphNode, GraphSelection } from "@/lib/graph";
import { RELATION_META } from "@/lib/graph";
import { cn } from "@/lib/utils";

interface ViewTransform {
  k: number;
  x: number;
  y: number;
}

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface GraphCanvasHandle {
  focus: (id: string) => void;
  reset: () => void;
}

export interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  visibleIds: Set<string>;
  activeIds: Set<string>;
  labelIds: Set<string>;
  selected: GraphSelection | null;
  hoveredId: string | null;
  onNodeClick: (id: string) => void;
  onNodeHover: (id: string | null) => void;
  onEdgeClick: (id: string) => void;
  onBackgroundClick: () => void;
  ref?: Ref<GraphCanvasHandle>;
}

export function GraphCanvas({
  nodes,
  edges,
  width,
  height,
  visibleIds,
  activeIds,
  labelIds,
  selected,
  hoveredId,
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onBackgroundClick,
  ref,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<ViewTransform>({ k: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; view: ViewTransform } | null>(null);

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const pointToSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  };

  const zoomAt = useCallback((factor: number, clientX?: number, clientY?: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const point = pointToSvg(
      clientX ?? rect.left + rect.width / 2,
      clientY ?? rect.top + rect.height / 2
    );
    setView((current) => {
      const k = clamp(current.k * factor, MIN_ZOOM, MAX_ZOOM);
      const ratio = k / current.k;
      return {
        k,
        x: point.x - (point.x - current.x) * ratio,
        y: point.y - (point.y - current.y) * ratio,
      };
    });
  }, []);

  const focus = useCallback(
    (id: string) => {
      const subset = nodes.filter(
        (node) =>
          visibleIds.has(node.id) &&
          (node.id === id || neighborSet(id, edges).has(node.id))
      );
      if (!subset.length) return;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const node of subset) {
        minX = Math.min(minX, node.x - node.r);
        minY = Math.min(minY, node.y - node.r);
        maxX = Math.max(maxX, node.x + node.r);
        maxY = Math.max(maxY, node.y + node.r);
      }
      const boxW = Math.max(1, maxX - minX);
      const boxH = Math.max(1, maxY - minY);
      const k = clamp(Math.min(width / boxW, height / boxH) * 0.55, MIN_ZOOM, 2.4);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      setView({ k, x: width / 2 - centerX * k, y: height / 2 - centerY * k });
    },
    [nodes, edges, visibleIds, width, height]
  );

  const reset = useCallback(() => setView({ k: 1, x: 0, y: 0 }), []);

  useImperativeHandle(ref, () => ({ focus, reset }), [focus, reset]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomAt(factor, event.clientX, event.clientY);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const selectedNodeId = selected?.type === "node" ? selected.id : null;
  const selectedEdgeId = selected?.type === "edge" ? selected.id : null;

  const edgeActive = (edge: GraphEdge) =>
    selectedEdgeId === edge.id ||
    (activeIds.has(edge.source) && activeIds.has(edge.target));

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest("[data-node],[data-edge]")) return;
    drag.current = { x: event.clientX, y: event.clientY, view };
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const ctm = svgRef.current?.getScreenCTM();
    const scale = ctm && ctm.a ? ctm.a : 1;
    const dx = (event.clientX - drag.current.x) / scale;
    const dy = (event.clientY - drag.current.y) / scale;
    setView({ ...drag.current.view, x: drag.current.view.x + dx, y: drag.current.view.y + dy });
  };

  const endDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    drag.current = null;
    svgRef.current?.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/50 to-card/10">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        role="img"
        aria-label="Memory graph showing how your memories, topics, people, and places connect"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => {
          if (!(event.target as Element).closest("[data-node],[data-edge]")) onBackgroundClick();
        }}
      >
        <defs>
          <pattern id="graph-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" className="text-border" opacity="0.55" />
          </pattern>
          <marker
            id="graph-arrow-source"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
          </marker>
        </defs>

        <rect x={0} y={0} width={width} height={height} fill="url(#graph-dots)" />

        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {nodes
            .filter((node) => node.hub)
            .map((node) => (
              <circle
                key={`glow-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={170}
                fill={node.color}
                opacity={activeIds.has(node.id) ? 0.07 : 0.03}
                className="transition-opacity duration-300"
              />
            ))}

          {edges.map((edge) => {
            const from = nodeById.get(edge.source);
            const to = nodeById.get(edge.target);
            if (!from || !to) return null;
            const meta = RELATION_META[edge.relation];
            const active = edgeActive(edge);
            const isSelected = selectedEdgeId === edge.id;
            return (
              <line
                key={edge.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isSelected ? "#ec4899" : meta.color}
                strokeWidth={isSelected ? meta.width + 1.4 : meta.width}
                strokeOpacity={active ? (isSelected ? 0.95 : 0.5) : 0.08}
                strokeDasharray={meta.dashed ? "4 5" : undefined}
                markerEnd={edge.relation === "source-of" ? "url(#graph-arrow-source)" : undefined}
                className="transition-[stroke-opacity,stroke-width] duration-200"
              />
            );
          })}

          <g data-edge-layer>
            {edges.map((edge) => {
              const from = nodeById.get(edge.source);
              const to = nodeById.get(edge.target);
              if (!from || !to) return null;
              return (
                <line
                  key={`hit-${edge.id}`}
                  data-edge={edge.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="transparent"
                  strokeWidth={12}
                  className="cursor-pointer"
                  style={{ pointerEvents: "stroke" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdgeClick(edge.id);
                  }}
                />
              );
            })}
          </g>

          {edges
            .filter((edge) => edge.relation === "discovered")
            .map((edge) => {
              const from = nodeById.get(edge.source);
              const to = nodeById.get(edge.target);
              if (!from || !to) return null;
              const active = edgeActive(edge);
              return (
                <circle
                  key={`spark-${edge.id}`}
                  cx={(from.x + to.x) / 2}
                  cy={(from.y + to.y) / 2}
                  r={2.4}
                  fill="#ec4899"
                  opacity={active ? 0.85 : 0.1}
                  className="pointer-events-none transition-opacity duration-200"
                />
              );
            })}

          {nodes.map((node) => {
            const active = activeIds.has(node.id);
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredId === node.id;
            const isHub = Boolean(node.hub);
            const isMemory = node.kind === "memory";
            const showLabel = isHub || !isMemory || labelIds.has(node.id) || isSelected || isHovered;

            return (
              <g
                key={node.id}
                data-node={node.id}
                transform={`translate(${node.x} ${node.y})`}
                className={cn(
                  "cursor-pointer transition-opacity duration-200",
                  active ? "opacity-100" : "opacity-25"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onNodeClick(node.id);
                }}
                onMouseEnter={() => onNodeHover(node.id)}
                onMouseLeave={() => onNodeHover(null)}
              >
                {(isSelected || isHovered) && (
                  <circle r={node.r + 6} fill={node.color} opacity={0.16} />
                )}
                {isHub ? (
                  <>
                    <circle
                      r={node.r + 3}
                      fill={node.color}
                      opacity={isSelected || isHovered ? 0.22 : 0.12}
                      stroke={node.color}
                      strokeOpacity={isSelected ? 0.95 : 0.5}
                      strokeWidth={1.4}
                      className="transition-all duration-200"
                    />
                    <circle r={node.r} fill={node.color} fillOpacity={0.92} />
                    {node.emoji && (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={node.r * 0.95}
                        className="select-none"
                      >
                        {node.emoji}
                      </text>
                    )}
                  </>
                ) : isMemory ? (
                  <circle
                    r={isSelected || isHovered ? node.r + 1.5 : node.r}
                    fill={node.color}
                    fillOpacity={isSelected || isHovered ? 0.95 : 0.4}
                    stroke={node.color}
                    strokeWidth={1.2}
                    className="transition-all duration-200"
                  />
                ) : (
                  <circle
                    r={isSelected || isHovered ? node.r + 1.5 : node.r}
                    fill={node.color}
                    fillOpacity={0.16}
                    stroke={node.color}
                    strokeWidth={1.6}
                    className="transition-all duration-200"
                  />
                )}

                {showLabel && (
                  <text
                    y={node.r + (isHub ? 17 : 13)}
                    textAnchor="middle"
                    fontSize={isHub ? 12.5 : 9.5}
                    fontWeight={isHub ? 600 : 500}
                    fill={node.color}
                    stroke="white"
                    strokeWidth={2.6}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    className="pointer-events-none select-none"
                  >
                    {node.label.length > 26 ? `${node.label.slice(0, 25)}…` : node.label}
                  </text>
                )}
                <title>{node.label}</title>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-4 hidden text-[11px] text-muted-foreground sm:block">
        Scroll to zoom · drag to pan · click a node or connection
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card/90 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => zoomAt(1.3)}
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center border-b border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomAt(1 / 1.3)}
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center border-b border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset view"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Maximize2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function neighborSet(id: string, edges: GraphEdge[]): Set<string> {
  const set = new Set<string>();
  for (const edge of edges) {
    if (edge.source === id) set.add(edge.target);
    else if (edge.target === id) set.add(edge.source);
  }
  return set;
}
