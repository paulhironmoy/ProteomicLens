export interface QCResults {
  cellsPassed: number;
  cellsRemoved: number;
  filterAMinCount: number;
  filterBMaxMissing: number;
  filterCHousekeeping: number;
  topInformative: { protein: string; rate: number }[];
}

export interface BatchCorrectionRound {
  round: number;
  entropy: number;
  interpretation: string;
}

export interface BatchCorrectionResults {
  batchesDetected: boolean;
  numBatches: number;
  rounds: BatchCorrectionRound[];
  finalEntropy: number;
  retainedCells: number;
}

export interface UniProtEntry {
  protein: string;
  accession: string;
  fullName: string;
  gene: string;
  function: string;
  disease: string;
  alphafoldLink: string;
  structure: string;
}

export interface PaperEntry {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  relevance: string;
}

export interface ClusterInfo {
  id: number;
  cellCount: number;
  percentage: number;
  markersQuantity: string[];
  markersDetection: string[];
  markersBoth: string[];
  proposedLabel: string;
  tier: "TIER 1" | "TIER 2" | "TIER 3";
  confidenceBasis: string;
  inferredTissue: string;
  coMarkers: string[];
  contradictions: string[];
  contradictionExplanation: string;
  significance: string;
  uniprot: UniProtEntry[];
  papers: PaperEntry[];
}

export interface CellPoint {
  id: string;
  x: number;
  y: number;
  clusterId: number;
  batch: string;
  proteinAbundance: Record<string, number>;
}

export interface PipelineData {
  experimentId: string;
  filename: string;
  totalCells: number;
  totalProteins: number;
  missingnessPercent: number;
  qc: QCResults;
  batch: BatchCorrectionResults;
  clusters: ClusterInfo[];
  cells: CellPoint[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "system" | "assistant";
  text: string;
  timestamp: string;
}
