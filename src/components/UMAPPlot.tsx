import { useState, useMemo } from "react";
import { CellPoint } from "../types";
import { Lightbulb, Compass } from "lucide-react";

interface UMAPPlotProps {
  cells: CellPoint[];
  selectedClusterId: number | null;
  onSelectCluster: (clusterId: number | null) => void;
}

export default function UMAPPlot({ cells, selectedClusterId, onSelectCluster }: UMAPPlotProps) {
  const [colorMode, setColorMode] = useState<"cluster" | "batch" | "CD3E" | "CD14" | "MKI67" | "GAPDH">("cluster");
  const [hoveredCell, setHoveredCell] = useState<CellPoint | null>(null);

  // Cluster colors and names
  const clusterColors: Record<number, string> = {
    1: "#0d9488", // Teal - Resting T-cell
    2: "#2563eb", // Blue - Monocyte
    3: "#7c3aed", // Purple - Proliferating T-cell
    4: "#dc2626", // Red - Lytic
    5: "#d97706", // Amber - Phagocytic Macrophage
  };

  const clusterNames: Record<number, string> = {
    1: "Cluster 1: Jurkat T-Cells (Resting Type)",
    2: "Cluster 2: U-937 Monocytes (Immune Sensors)",
    3: "Cluster 3: Jurkat T-Cells (Actively Dividing)",
    4: "Cluster 4: Broken Cells (Lytic Debris)",
    5: "Cluster 5: Phagocytic Macrophages (Active Engulfers)",
  };

  const colorExplanations: Record<string, string> = {
    cluster: "Each dot represents an individual cell. Cells clustered closely together have highly similar protein signatures.",
    batch: "Colored by experimental replicate batch. Uniform mixing indicates that machine variations are successfully resolved.",
    CD3E: "High intensity (red) reveals helper T-Lymphocytes. Absolute baseline marker.",
    CD14: "High intensity (red) is highly specific for Monocytes / Macrophages.",
    MKI67: "Ki-67 indicates active cell division. Present in dividing Jurkat T-cells.",
    GAPDH: "Housekeeping enzyme active in almost all living, healthy mammalian cells."
  };

  // Compute boundaries for proper scaling
  const bounds = useMemo(() => {
    if (cells.length === 0) return { minX: -10, maxX: 10, minY: -10, maxY: 10 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    cells.forEach((c) => {
      if (c.x < minX) minX = c.x;
      if (c.x > maxX) maxX = c.x;
      if (c.y < minY) minY = c.y;
      if (c.y > maxY) maxY = c.y;
    });
    // Add margin
    const dx = maxX - minX;
    const dy = maxY - minY;
    return {
      minX: minX - dx * 0.05,
      maxX: maxX + dx * 0.05,
      minY: minY - dy * 0.05,
      maxY: maxY + dy * 0.05,
    };
  }, [cells]);

  const width = 500;
  const height = 400;

  // Compute centroids for each cluster to place labels directly on the graph
  const clusterCentroids = useMemo(() => {
    if (cells.length === 0) return [];
    
    const sums: Record<number, { x: number; y: number; count: number }> = {};
    cells.forEach((cell) => {
      if (!sums[cell.clusterId]) {
        sums[cell.clusterId] = { x: 0, y: 0, count: 0 };
      }
      sums[cell.clusterId].x += cell.x;
      sums[cell.clusterId].y += cell.y;
      sums[cell.clusterId].count += 1;
    });

    const labels: Record<number, string> = {
      1: "Resting T-Cells",
      2: "U-937 Monocytes",
      3: "Dividing T-Cells",
      4: "Broken Cells (Lytic Debris)",
      5: "Phagocytic Macrophages",
    };

    const centroids = Object.entries(sums).map(([idStr, val]) => {
      const id = parseInt(idStr, 10);
      const cx = val.x / val.count;
      const cy = val.y / val.count;
      
      // Convert to SVG coordinates
      const svgX = ((cx - bounds.minX) / (bounds.maxX - bounds.minX)) * width;
      const svgY = height - ((cy - bounds.minY) / (bounds.maxY - bounds.minY)) * height;

      return {
        id,
        x: svgX,
        y: svgY,
        label: labels[id] || `Cluster ${id}`,
        color: clusterColors[id] || "#4f46e5",
      };
    });

    // Simple overlap resolution in SVG coordinates
    for (let i = 0; i < centroids.length; i++) {
      for (let j = i + 1; j < centroids.length; j++) {
        const c1 = centroids[i];
        const c2 = centroids[j];
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 45) {
          // Push them apart slightly in Y direction
          const offset = (45 - dist) / 2;
          if (c1.y > c2.y) {
            c1.y += offset;
            c2.y -= offset;
          } else {
            c1.y -= offset;
            c2.y += offset;
          }
        }
      }
    }

    return centroids;
  }, [cells, bounds, clusterColors]);

  // Coordinate converter
  const getSvgX = (x: number) => {
    return ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * width;
  };

  const getSvgY = (y: number) => {
    return height - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * height;
  };

  // Determine dot color based on active mode
  const getCellColor = (cell: CellPoint) => {
    // If a cluster is selected and this cell doesn't belong to it, fade it out
    if (selectedClusterId !== null && cell.clusterId !== selectedClusterId) {
      return "rgba(203, 213, 225, 0.25)"; // pale slate
    }

    if (colorMode === "cluster") {
      return clusterColors[cell.clusterId] || "#94a3b8";
    }

    if (colorMode === "batch") {
      return cell.batch === "Batch_A" ? "#f43f5e" : "#3b82f6"; // rose vs blue
    }

    // Protein intensity gradient modes
    const val = cell.proteinAbundance[colorMode] || 0;
    if (val === 0) return "#cbd5e1"; // light gray for undetected
    
    // Scale color from light slate/blue to deep crimson
    const maxVal = colorMode === "GAPDH" ? 12 : 11;
    const ratio = Math.min(val / maxVal, 1);
    
    return `rgba(225, 29, 72, ${0.15 + ratio * 0.85})`; // Rose-600 with opacity
  };

  return (
    <div id="umap-container" className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-md font-bold text-slate-900 font-sans tracking-tight flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Interactive Single-Cell Map (UMAP)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Showing {cells.length} cells. Closely plotted dots have highly similar protein levels.</p>
        </div>

        {/* Color overlay selectors */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono px-2 font-semibold">View Protein:</span>
          {(["cluster", "batch", "CD3E", "CD14", "MKI67"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setColorMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all font-medium ${
                colorMode === mode
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Explanatory subtitle for selected color mode */}
      <div className="mb-3 bg-indigo-50/50 border border-indigo-100/60 rounded-xl px-3 py-2 text-xs text-slate-600 font-sans flex items-start gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-900 font-semibold">{colorMode.toUpperCase()} Overlay:</strong> {colorExplanations[colorMode]}
        </div>
      </div>

      <div className="relative flex-1 min-h-[300px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
        {/* Actual SVG Plot */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[380px]"
          onClick={() => {
            // Click empty space to clear selected cluster filter
            onSelectCluster(null);
          }}
        >
          {/* Scatter points */}
          {cells.map((cell) => {
            const isSelected = selectedClusterId === null || cell.clusterId === selectedClusterId;
            const r = hoveredCell?.id === cell.id ? 8 : isSelected ? 4 : 2;
            const strokeColor = hoveredCell?.id === cell.id ? "#0f172a" : "none";
            const strokeWidth = hoveredCell?.id === cell.id ? 1.5 : 0;

            return (
              <circle
                key={cell.id}
                cx={getSvgX(cell.x)}
                cy={getSvgY(cell.y)}
                r={r}
                fill={getCellColor(cell)}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCluster(cell.clusterId);
                }}
              />
            );
          })}

          {/* Direct Cluster Labels (Requested: item 3) */}
          {colorMode === "cluster" && clusterCentroids.map((c) => {
            const isFaded = selectedClusterId !== null && selectedClusterId !== c.id;
            return (
              <g
                key={c.id}
                className="transition-all duration-300 pointer-events-none"
                style={{ opacity: isFaded ? 0.35 : 0.95 }}
              >
                {/* Text background pill shadow */}
                <rect
                  x={c.x - (c.label.length * 3.1) - 6}
                  y={c.y - 10}
                  width={(c.label.length * 6.2) + 12}
                  height={18}
                  rx={9}
                  fill="white"
                  stroke={c.color}
                  strokeWidth={1.5}
                />
                {/* Small indicator circle */}
                <circle
                  cx={c.x}
                  cy={c.y + 12}
                  r={3}
                  fill={c.color}
                />
                {/* The text itself */}
                <text
                  x={c.x}
                  y={c.y + 2}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Details Card Overlay */}
        {hoveredCell && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 p-3.5 rounded-xl text-slate-800 text-xs w-[250px] pointer-events-none shadow-xl font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="font-bold text-slate-900">{hoveredCell.id}</span>
              <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                {hoveredCell.batch}
              </span>
            </div>
            <div className="text-[11px] mb-2 text-slate-800 font-sans font-bold">
              {clusterNames[hoveredCell.clusterId]}
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <span className="text-slate-500 font-sans">CD3E (T-Cell):</span>
              <span className={hoveredCell.proteinAbundance.CD3E ? "text-slate-900 font-bold" : "text-slate-400"}>
                {hoveredCell.proteinAbundance.CD3E || "Not Detected"}
              </span>
              <span className="text-slate-500 font-sans">CD14 (Monocyte):</span>
              <span className={hoveredCell.proteinAbundance.CD14 ? "text-slate-900 font-bold" : "text-slate-400"}>
                {hoveredCell.proteinAbundance.CD14 || "Not Detected"}
              </span>
              <span className="text-slate-500 font-sans">CD68 (Macrophage):</span>
              <span className={hoveredCell.proteinAbundance.CD68 ? "text-slate-900 font-bold" : "text-slate-400"}>
                {hoveredCell.proteinAbundance.CD68 || "Not Detected"}
              </span>
              <span className="text-slate-500 font-sans">MKI67 (Cell Division):</span>
              <span className={hoveredCell.proteinAbundance.MKI67 ? "text-slate-900 font-bold" : "text-slate-400"}>
                {hoveredCell.proteinAbundance.MKI67 || "Not Detected"}
              </span>
              <span className="text-slate-500 font-sans">GAPDH (Housekeeping):</span>
              <span className={hoveredCell.proteinAbundance.GAPDH ? "text-slate-900 font-bold" : "text-slate-400"}>
                {hoveredCell.proteinAbundance.GAPDH || "Not Detected"}
              </span>
            </div>
          </div>
        )}

        {/* Top-Right cluster color legend */}
        {colorMode === "cluster" && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-200/80 p-2.5 rounded-lg text-[10px] space-y-1.5 font-sans shadow-md">
            {Object.entries(clusterColors).map(([id, color]) => (
              <div key={id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: color }} />
                <span className="text-slate-700 font-medium">Cluster {id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive hints */}
      <div className="mt-2.5 text-[10px] text-slate-500 flex justify-between font-sans items-center">
        <span className="flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Hover cells to see their specific protein levels</span>
        </span>
        <span>Click cluster colors to filter lists below</span>
      </div>
    </div>
  );
}
