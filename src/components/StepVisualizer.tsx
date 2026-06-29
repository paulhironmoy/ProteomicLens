import { useState, useEffect } from "react";
import { PipelineData, ChatMessage } from "../types";
import { CLUSTER_EXPLANATIONS, PROTEIN_EXPLANATIONS, PAPER_EXPLANATIONS } from "../data/stageData";
import UMAPPlot from "./UMAPPlot";
import ChatConsole from "./ChatConsole";
import { 
  CheckCircle, 
  Database, 
  Info, 
  Award, 
  Activity, 
  Layers, 
  Compass, 
  BrainCircuit, 
  Zap, 
  BookOpen, 
  FileText, 
  Lock, 
  Loader2,
  Sparkles,
  Check,
  Fingerprint,
  Download,
  Dna,
  GraduationCap,
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Coins,
  ShieldCheck,
  Beaker,
  Cpu,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface PitchSlidePoint {
  category: string;
  title: string;
  text: string;
  highlight: string;
  icon: string;
  color: string;
}

interface PitchSlideData {
  title: string;
  subtitle: string;
  alignment: string;
  points: PitchSlidePoint[];
}

const getPitchSlideContent = (step: number): PitchSlideData => {
  const slides: PitchSlideData[] = [
    {
      title: "Data Loading: High-Sparsity sc-Proteomics Ingestion",
      subtitle: "Parsing peptide spectral matches into high-fidelity datasets in under 2 seconds.",
      alignment: "Douglas Crawford Value Thesis: High-throughput ingestion replaces slow, manual custom scripting.",
      points: [
        {
          category: "The Bottleneck",
          title: "Stochastic Sparsity Loss",
          text: "Raw single-cell mass spectrometry datasets suffer from severe stochastic missingness (typically 32%+ missingness gaps), stalling clinical pipelines.",
          highlight: "Saves 12+ Bioinformatic Hours",
          icon: "Database",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "Streaming PSM Ingestion",
          text: "Our fast processing engine automates peptide counts and indexes metadata in real-time, providing immediate zero-data-loss validation.",
          highlight: "Speed: <1.8s Ingestion",
          icon: "Zap",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Scalable Data Foundation",
          text: "Removes spreadsheet wrangling, allowing enterprise lab clients to double their weekly processing throughput without hiring more analysts.",
          highlight: "100% Automated Pre-processing",
          icon: "TrendingUp",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Quality Control: Adaptive Density Filtering",
      subtitle: "Removing lysed cellular debris while perfectly preserving rare physiological lineages.",
      alignment: "Brian Cheung ML Integrity Thesis: Perfect training data guarantees robust downstream cell classifications.",
      points: [
        {
          category: "The Bottleneck",
          title: "Ruptured Cell Debris",
          text: "Lysed cell debris contaminates runs. Standard static thresholding mistakenly discards rare cell lineages or allows trash through.",
          highlight: "Prevents Batch Contamination",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "GAPDH Housekeeping Bounds",
          text: "We use standard deviation markers (like metabolic GAPDH levels) to dynamically track signal density thresholds.",
          highlight: "Adaptive Quality Control",
          icon: "Layers",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Model Training Integrity",
          text: "Delivers pristine inputs to downstream classifier embeddings. Downstream deep learning models learn true biology instead of prep noise.",
          highlight: "Zero Garbage-In Noise",
          icon: "ShieldCheck",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Batch Alignment: Entropy-Guided Calibration",
      subtitle: "Aligning multi-run instrument variance while protecting real biological signals.",
      alignment: "Dr. Verba Scientific Validation: Standardizing multiple instrument runs makes longitudinal studies directly comparable.",
      points: [
        {
          category: "The Bottleneck",
          title: "Instrument & Vacuum Drift",
          text: "Mass spec runs suffer from severe non-biological batch effects due to instrument calibration shifts and temperature drift.",
          highlight: "Unaligned Runs Mask Signals",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "Entropy Minimization Alignment",
          text: "Deploys an iterative coordinate-scaling optimization that maximizes batch mixing to Shannon Entropy scores approaching 1.0.",
          highlight: "Shannon Entropy ~ 1.0",
          icon: "Zap",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Global Multi-Site Pooling",
          text: "Enables clinical labs across the globe to pool their raw mass-spec data into a single, standardized immunotherapy biomarker repository.",
          highlight: "Universal Data Interchange",
          icon: "Coins",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Unsupervised Clustering: Latent SNN Graph Partitioning",
      subtitle: "Mapping complex cell neighborhoods entirely unbiased by machine-learning priors.",
      alignment: "Platform Uniqueness: Pure math community detection maps cell groupings with zero training bias.",
      points: [
        {
          category: "The Bottleneck",
          title: "Subjective Gating Limits",
          text: "Bioinformaticians traditionally group cells by manual multi-marker gates, introducing personal bias and missing novel phenotypes.",
          highlight: "Subjective & Sluggish",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "SNN Graph & Leiden Community Detection",
          text: "Constructs a Shared Nearest-Neighbor (SNN) graph and leverages Leiden community detection to automatically group similar cells.",
          highlight: "Interactive UMAP Canvas",
          icon: "Compass",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Accelerated Target Discovery",
          text: "Instant visual partitioning of resting T-cells, dividing T-cells, and monocytes based on complete high-dimensional protein levels.",
          highlight: "Discover Rare Cell Phenotypes",
          icon: "Award",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Double-Check ID: Multi-Agent Clinical Consensus",
      subtitle: "Our Core Secret Sauce: Auditing boundary markers with cooperative clinical LLM agents.",
      alignment: "The Agentic Advantage: Utilizing cooperative models as a clinical audit board reduces labeling errors to near zero.",
      points: [
        {
          category: "The Bottleneck",
          title: "Mismarked Boundary Cells",
          text: "Border cell clusters co-expressing lymphoid and myeloid markers are typically labeled as errors and discarded by rigid systems.",
          highlight: "Traditional Pipelines Fail",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "3-Round Agentic Verification",
          text: "Cooperative agents audit marker levels, volumetric constraints, and biological contradictions, proving active phagocytic swallowing.",
          highlight: "Discovered Phagocytosis Live",
          icon: "BrainCircuit",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "High-Value Diagnostic Discoveries",
          text: "Captures active cell-to-cell immune interactions in real-time that traditional software misses entirely, unlocking massive licensing potential.",
          highlight: "Immuno-Oncology Goldmine",
          icon: "Sparkles",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Map Proteins: Standardized AlphaFold 3D Folds",
      subtitle: "Bridging expression metrics with real physical folded protein receptor structures.",
      alignment: "Dr. Verba Structural Target: Fast structural viewing facilitates instant compound virtual screening.",
      points: [
        {
          category: "The Bottleneck",
          title: "Abstract Statistical Gaps",
          text: "Knowing a protein's numerical expression doesn't tell you its physical shape, stalling downstream drug-receptor design.",
          highlight: "Bridges Code & Biology",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "AlphaFold & UniProt Mapping",
          text: "Directly maps quantitative markers to UniProt accession codes and loads folded 3D structures from the AlphaFold database.",
          highlight: "Real-Time 3D Fold Viewer",
          icon: "Layers",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Targeted virtual screening",
          text: "Allows researchers to instantly look up active receptor pocket shapes and evaluate binding affinities in seconds.",
          highlight: "Compresses Timelines by Months",
          icon: "Award",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Literature Scan: Real-Time PubMed Grounding",
      subtitle: "Searching peer-reviewed global libraries to provide validated scientific literature proof.",
      alignment: "Technical Rigor: High-fidelity citations ensure clinical compliance and prevent AI hallucinations.",
      points: [
        {
          category: "The Bottleneck",
          title: "Manual Research Overhead",
          text: "Validating novel marker groupings requires clinical scientists to manually parse hundreds of journals, taking weeks.",
          highlight: "Prone to AI Hallucinations",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "Live PubMed Database Crawler",
          text: "Automatically query NCBI/PubMed databases to match identified markers, extracting real PMIDs, DOIs, and paper abstracts.",
          highlight: "Grounded in Global Literature",
          icon: "BookOpen",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "Uncompromising Clinical Audit Trail",
          text: "Provides a robust, fully-referenced validation record that streamlines FDA filings and clinical peer reviews instantly.",
          highlight: "100% Verifiable Citations",
          icon: "ShieldCheck",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    },
    {
      title: "Venture Summary: High-Throughput Value Scorecard",
      subtitle: "Translating sophisticated multi-agent pipeline discoveries into real labor savings and B2B SaaS ROI.",
      alignment: "Douglas Crawford Commercial Thesis: ProteomicLens is a high-yield enterprise workflow accelerator.",
      points: [
        {
          category: "The Bottleneck",
          title: "The Commercial Translation Gap",
          text: "Advanced scientific platforms are rarely built with clear commercial ROI metrics, leaving VCs and lab buyers guessing the value.",
          highlight: "High Science, Low Usability",
          icon: "Activity",
          color: "text-rose-600 bg-rose-50 border border-rose-100"
        },
        {
          category: "Our Innovation",
          title: "Integrated Venture Scorecard",
          text: "Calculates fully-burdened scientific hourly wage savings (UCSF premium vs USA vs Global) to visualize operational metrics.",
          highlight: "Publication-Ready Output",
          icon: "FileText",
          color: "text-amber-600 bg-amber-50 border border-amber-100"
        },
        {
          category: "Judge / Market Case",
          title: "High-Margin B2B SaaS",
          text: "Saves up to $18,400 per experimental project, supporting high-tier enterprise subscription licensing models.",
          highlight: "Massive Commercial Scalability",
          icon: "Coins",
          color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
        }
      ]
    }
  ];

  return slides[step] || slides[0];
};

function PitchIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Database":
      return <Database className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Coins":
      return <Coins className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Award":
      return <Award className={className} />;
    case "BrainCircuit":
      return <BrainCircuit className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "FileText":
      return <FileText className={className} />;
    default:
      return <Activity className={className} />;
  }
}

interface PitchComparativeData {
  result: string;
  realLab: string;
  techImplementation: string;
}

const getPitchComparativeData = (step: number): PitchComparativeData => {
  const data: PitchComparativeData[] = [
    {
      result: "Instant high-fidelity cell-by-protein matrix generated in under 2 seconds. Identifies exact sample parameters and highlights 32% precursor ionization missingness.",
      realLab: "A postdoc spending 12 to 16 hours running custom R/Python parser scripts, wrestling with inconsistent format anomalies, and manually patching spreadsheets.",
      techImplementation: "FileReader API streaming buffer parser, local metadata indexing, and binary matrix loading architecture for rapid in-browser memory caching."
    },
    {
      result: "100% of non-viable ruptured cells and debris filtered out automatically while retaining rare high-value biological cell lineages.",
      realLab: "Static arbitrary cutoff values (e.g., throwing out any well with >10% missing values), causing researchers to accidentally discard rare phenotypes or keep noise.",
      techImplementation: "Metabolic standard deviation markers (GAPDH expression bounds) mapped against local density-based signal-to-noise thresholds."
    },
    {
      result: "Batch-to-batch run variance perfectly corrected, achieving a cross-plate Shannon Entropy score of ~0.98 for reliable cross-experimental comparison.",
      realLab: "Extreme instrument vacuum and temperature fluctuations across different days go uncorrected, creating massive artificial signals (false positives).",
      techImplementation: "High-dimensional coordinate scaling and iterative entropy-minimization alignment that standardizes baseline levels across multiple physical run IDs."
    },
    {
      result: "Cells automatically grouped into 5 distinct biological phenotypes and beautifully projected onto an interactive coordinate-mapped UMAP canvas.",
      realLab: "Bioinformaticians manually drawing arbitrary 2D polygon gates over classic flow-cytometry scatter plots, leading to subjective, non-reproducible cell types.",
      techImplementation: "Latent Shared Nearest-Neighbor (SNN) graph partitioning combined with the Leiden community detection algorithm and dynamic canvas coordinates."
    },
    {
      result: "Ambiguous double-positive cells audited over 3 collaborative rounds, validating Cluster 5 as a macrophage actively engulfing a T-cell.",
      realLab: "Unusual multi-marker cells are simply discarded as doublet errors or labeled as pipeline noise, missing precious immunological signaling moments.",
      techImplementation: "3-Round cooperative multi-agent consensus protocol leveraging Gemini 3.5 Flash APIs to audit peptide levels and volumetric bounds."
    },
    {
      result: "Identified biomarkers instantly matched to UniProt IDs and fully folded 3D structures loaded from the AlphaFold DB in real-time.",
      realLab: "Manually copying protein symbols into public web portals and downloading separate slow modeling software to load static, heavy pdb files.",
      techImplementation: "Asynchronous REST requests to UniProt & PDBe APIs, binding dynamic 3D molecular structures to our responsive WebGL/canvas ribbon viewer."
    },
    {
      result: "Automated crawling of global peer-reviewed libraries pulls precise PubMed abstracts, PMIDs, and DOIs to validate discoveries.",
      realLab: "Spending weeks copy-pasting DOIs into local folders and manually writing reviews to prove the biological validity of identified cell markers.",
      techImplementation: "Live PubMed NCBI E-utilities API search crawler with automated clinical abstract summarization and cross-referenced PMID/DOI cataloging."
    },
    {
      result: "Interactive financial dashboard compiles saving margins ($18,400+ saved per project) and structures a publication-ready clinical scorecard.",
      realLab: "Drafting final reports and budget impact statements manually by looking up lab technician hourly rates across spreadsheets.",
      techImplementation: "Dynamic financial math engine using fully burdened salary models coupled with our automated CSV/PDF report-generation subsystem."
    }
  ];

  return data[step] || data[0];
};

interface PipelineStepDetail {
  title: string;
  engine: string;
  details: string;
  visualState: string[];
}

const getPipelineStepDetails = (step: number): PipelineStepDetail => {
  const details: PipelineStepDetail[] = [
    {
      title: "Data Loading & Ingestion",
      engine: "FileReader API & Binary Ingestor",
      details: "Parsing complex single-cell mass spectrometry datasets (Leduc SCoPE2) directly in-browser. Extracting high-dimensional expression matrices, loading row metadata, and preparing data buffers.",
      visualState: [
        "Streaming raw cell-by-protein expression matrix from Leduc SCoPE2 repository (gzip format).",
        "Validating column-wise and row-wise headers for 1,490 single-cell channels.",
        "Initializing metadata indexes for peptide identifications and cell-origin tags.",
        "Parsing spectral intensity profiles and cross-referencing precursor mass-to-charge ratios (m/z).",
        "Verifying file checksum integrity (SHA-256) and parsing header metadata XML formats.",
        "Storing localized, low-latency binary floats in an in-memory high-density matrix."
      ]
    },
    {
      title: "Clean Debris & QC Filters",
      engine: "Sparsity Thresholds & Housekeeping Bounds",
      details: "Sorting healthy target cells from damaged cellular debris. Gauging cell viability against GAPDH expression baselines to automatically filter out popped or empty wells.",
      visualState: [
        "Calculating signal-to-noise ratio (SNR) thresholds across all loaded protein channels.",
        "Applying adaptive sparsity cutoff filters (dropping wells with >75% missing signals).",
        "Auditing cell viability metrics against absolute housekeeping control (GAPDH & ACTB) expression.",
        "Calculating and excluding statistical outliers beyond 3 standard deviations from the median intensity.",
        "Flagging and segregating lysed cellular debris from intact single-cell populations.",
        "Registering filtered 984 QC-passed high-fidelity cells for downstream mathematical processing."
      ]
    },
    {
      title: "Align Batches & Calibrations",
      engine: "Entropy-Guided Coordinate Scaling",
      details: "Correcting for natural machine fluctuations across separate experiment runs. Normalizing baseline expression offsets so only true biology remains comparable.",
      visualState: [
        "Inspecting systematic batch offsets across distinct microfluidic run plates.",
        "Executing entropy-guided multi-batch scaling calibration to minimize run-to-run drift.",
        "Applying median-of-ratios normalization to align absolute intensity scales.",
        "Correcting instrument thermal and detector gas pressure drift profiles.",
        "Confirming alignment accuracy using pre-computed batch mixing coefficients.",
        "Preserving critical biological variance while successfully eliminating batch-specific technical noise."
      ]
    },
    {
      title: "Group Cells & Partitioning",
      engine: "Leiden Graph Partitioning & UMAP Projection",
      details: "Building a high-dimensional Shared Nearest-Neighbor (SNN) graph of single-cell profiles. Dividing cells into cohesive neighborhoods representing exact lineages.",
      visualState: [
        "Running Principal Component Analysis (PCA) to extract top 15 high-variance coordinates.",
        "Building a high-dimensional Shared Nearest-Neighbor (SNN) graph using Euclidean distances.",
        "Tuning unsupervised Leiden clustering algorithm parameters (Resolution: 0.50).",
        "Executing graph partition iterations to separate distinct cellular lineages.",
        "Applying UMAP manifold learning to project clusters onto clean 2D coordinates.",
        "Pinpointing cluster boundary centroids for 5 highly distinct cellular clusters."
      ]
    },
    {
      title: "Double-Check ID & Audits",
      engine: "3-Round Agentic Verification (Gemini 3.5)",
      details: "Evaluating co-expression conflicts where a cluster displays macrophage and T-cell markers. The AI double-checks molecular parameters to confirm cell engulfment.",
      visualState: [
        "Loading LLM lineage rules engine to review overlapping receptor signatures.",
        "Running multi-round agentic auditing consensus on problematic cluster 4.",
        "Evaluating cell-engulfment and phagocytosis markers (CD14 vs CD3D co-expression conflicts).",
        "Re-annotating ambiguous cell divisions through iterative profile comparison.",
        "Verifying marker intensity scores against reference hematopoiesis lineages.",
        "Establishing absolute confidence scores for all 5 mapped cell types."
      ]
    },
    {
      title: "Map Proteins & AlphaFold",
      engine: "UniProt Reference Linker & WebGL 3D Folds",
      details: "Mapping high-variance cell-surface proteins to standard UniProt database records and pulling active 3D structures from AlphaFold to locate active binding sites.",
      visualState: [
        "Querying UniProt API to map target biomarker symbols (e.g., CD14, KRT8) to accession codes.",
        "Linking mapped accessions to active PDB ids and retrieving 3D structure metadata.",
        "Downloading folded peptide coordinate files from deep AlphaFold database.",
        "Identifying highly active binding sites, surface receptors, and ligand-binding pockets.",
        "Pre-rendering 3D interactive molecular ribbon representations using custom WebGL shader buffers.",
        "Enriching data model with exact protein functional descriptions, domains, and active sites."
      ]
    },
    {
      title: "Literature Scan & Search",
      engine: "Agentic NCBI PubMed API Crawler",
      details: "Crawling international science publication repositories for validation. Finding peer-reviewed studies and PMIDs that corroborate discovered biomarker profiles.",
      visualState: [
        "Launching agentic search query crawler on NCBI PubMed and Europe PMC APIs.",
        "Scraping active publication indexes for multi-marker co-occurrence literature.",
        "Filtering and cross-referencing peer-reviewed papers containing DOI coordinates.",
        "Mapping verified cell annotations to historical published clinical trial cohorts.",
        "Extracting relevant PMIDs and author publications validating our exact discoveries.",
        "Generating a contextual bibliographic database for the identified single-cell clusters."
      ]
    },
    {
      title: "Summary Report & Savings",
      engine: "Burdened Labor Metric Engine",
      details: "Consolidating all pipeline discoveries. Calculating saved researcher-hours, project margin gains, and packaging a publication-ready clinical scorecard.",
      visualState: [
        "Consolidating diagnostic metrics, cluster distributions, and biomarker pathways.",
        "Performing burdened labor calculations (estimating saved manual research hours).",
        "Computing cost efficiency gains based on fully-burdened biostatistician salary models.",
        "Compiling a comprehensive clinical scorecard with verified PMIDs, cell proportions, and QC scores.",
        "Generating JSON and PDF export schemas for laboratory review panels.",
        "Packaging final dataset output for automated downstream electronic lab notebook (ELN) ingestion."
      ]
    }
  ];
  return details[step] || details[0];
};

interface StepVisualizerProps {
  pipelineData: PipelineData | null;
  selectedClusterId: number | null;
  onSelectCluster: (clusterId: number | null) => void;
  isRunning: boolean;
  activeStep: number;
  setActiveStep: (step: number) => void;
  executingStep: number;
  stageProgress: number[];
  stageTimes: string[];
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onClearHistory: () => void;
}

const getClusterColor = (id: number) => {
  const colors: Record<number, { bg: string; border: string; text: string; ring: string; dot: string; hover: string; accent: string }> = {
    1: { bg: "bg-teal-50/70", border: "border-teal-200/80", text: "text-teal-900", ring: "ring-teal-400", dot: "bg-teal-500", hover: "hover:bg-teal-50", accent: "text-teal-600" },
    2: { bg: "bg-blue-50/70", border: "border-blue-200/80", text: "text-blue-900", ring: "ring-blue-400", dot: "bg-blue-500", hover: "hover:bg-blue-50", accent: "text-blue-600" },
    3: { bg: "bg-purple-50/70", border: "border-purple-200/80", text: "text-purple-900", ring: "ring-purple-400", dot: "bg-purple-500", hover: "hover:bg-purple-50", accent: "text-purple-600" },
    4: { bg: "bg-rose-50/70", border: "border-rose-200/80", text: "text-rose-900", ring: "ring-rose-400", dot: "bg-rose-500", hover: "hover:bg-rose-50", accent: "text-rose-600" },
    5: { bg: "bg-amber-50/70", border: "border-amber-200/80", text: "text-amber-900", ring: "ring-amber-400", dot: "bg-amber-500", hover: "hover:bg-amber-50", accent: "text-amber-600" },
  };
  return colors[id] || { bg: "bg-slate-50", border: "border-slate-200/80", text: "text-slate-900", ring: "ring-slate-400", dot: "bg-slate-500", hover: "hover:bg-slate-50", accent: "text-slate-600" };
};

export default function StepVisualizer({
  pipelineData,
  selectedClusterId,
  onSelectCluster,
  isRunning,
  activeStep,
  setActiveStep,
  executingStep,
  stageProgress = [0, 0, 0, 0, 0, 0, 0, 0],
  stageTimes = ["", "", "", "", "", "", "", ""],
  chatHistory = [],
  onSendMessage,
  isThinking,
  onClearHistory,
}: StepVisualizerProps) {
  const [resolution, setResolution] = useState(0.5);
  const [audience, setAudience] = useState<"researcher" | "biologist" | "general" | "pitch">("researcher");
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setAudience("researcher");
  }, [activeStep]);

  const toggleExplanation = (key: string) => {
    setExpandedExplanations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderExplainSection = (key: string, data: { explanation: string; sources: { name: string; type: string; relevance: string }[] } | undefined) => {
    if (!data) return null;
    const isExpanded = !!expandedExplanations[key];
    return (
      <div className="mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExplanation(key);
          }}
          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 text-[11px] font-extrabold rounded-xl transition-all inline-flex items-center gap-1 border border-indigo-100 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isExpanded ? "Hide Scientific Explanation" : "Explain This AI Decision"}</span>
        </button>

        {isExpanded && (
          <div className="mt-2.5 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 text-slate-700 text-xs leading-relaxed font-sans shadow-inner space-y-3">
            <div>
              <span className="font-bold text-indigo-950 block text-[10px] uppercase tracking-wider mb-1 font-mono">
                Plain-Language Explanation
              </span>
              <p className="text-slate-600 font-medium">{data.explanation}</p>
            </div>
            
            <div className="pt-2.5 border-t border-indigo-100">
              <span className="font-bold text-indigo-950 block text-[10px] uppercase tracking-wider mb-2 font-mono">
                Source Citations & Reference Literature
              </span>
              <div className="space-y-2">
                {data.sources.map((src, i) => (
                  <div key={i} className="bg-white/95 p-2.5 rounded-xl border border-indigo-100/40 flex flex-col gap-0.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-800 text-[11px]">{src.name}</span>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-indigo-100/70 text-indigo-800 rounded uppercase">
                        {src.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500"><strong className="text-indigo-900 font-semibold">Relevance:</strong> {src.relevance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!pipelineData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Database className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
        <h3 className="text-md font-bold text-slate-800 font-sans">No Experiment Loaded</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed">
          Please upload your proteomics CSV file or click the <strong>Load Demo Leduc SCoPE2 Dataset</strong> button above to run the pipeline.
        </p>
      </div>
    );
  }

  const steps = [
    { num: 0, title: "1. Data Loading", desc: "Upload raw cell matrix file" },
    { num: 1, title: "2. Clean Debris", desc: "Filter out empty or dying cells" },
    { num: 2, title: "3. Align Batches", desc: "Calibrate different instrument runs" },
    { num: 3, title: "4. Group Cells", desc: "Group cells using AI clustering" },
    { num: 4, title: "5. Double-Check ID", desc: "3-round identity checks" },
    { num: 5, title: "6. Map Proteins", desc: "Look up 3D protein structures" },
    { num: 6, title: "7. Literature Scan", desc: "Auto-search published research papers" },
    { num: 7, title: "8. Summary Report", desc: "Review saved hours & summary" },
  ];

  const audienceExplanations = [
    {
      agentic: false,
      researcher: {
        title: "scp-MS Quantitative Expression Matrix Ingestion",
        text: "Automated ingestion of raw high-dimensional single-cell proteomics datasets. Parses peptide spectral matches (PSMs) into a validated cell-by-protein expression matrix. Analyzes row-level metadata, normalizes starting ionization baselines, and flags stochastic missingness (sparsity typical of low-input single-cell mass spectrometry).",
        insight: "Technical Rigor: Analyzes 32% missingness arising from stochastic precursor ion selection in Orbitrap analyzers."
      },
      biologist: {
        title: "Translating Cellular Proteins into Quantitative Data",
        text: "In this starting stage, we load the raw protein profiles from individual immune cells. The experiment analyzes a mixture of Jurkat T-lymphocytes (adaptive immune cell model) and U-937 monocytes (innate immune myeloid model). The mass spectrometer vaporizes cell peptides to count their relative abundances.",
        insight: "Biological Context: Outlines the relative baseline proteome of immune lineages prior to any computational correction."
      },
      general: {
        title: "Digital Molecular Photo Scan Ingestion",
        text: "This step takes a high-definition molecular photo of individual cells. Since cells are extremely microscopic, the scanner misses a few faint spots (marked as 'N/D' or Not Detected blanks), but it successfully creates a comprehensive master list of all proteins found in each cell.",
        insight: "Everyday Analogy: Think of it as scanning the barcodes of groceries across 100 shopping carts to audit the inventory."
      },
      pitch: {
        title: "Data Loading: Solving High-Sparsity sc-Proteomics Ingestion",
        text: "ProteomicLens automates the loading of raw single-cell proteomics runs, parsing complex peptide spectral matches into a high-fidelity cell-by-protein matrix in under 2 seconds. It immediately flags the 32% precursor ionization missingness (sparsity typical of low-input mass spectrometry), laying a rigorous mathematical foundation for downstream analysis without manual spreadsheet wrangling.",
        insight: "💡 VC Value Prop (Douglas Crawford): Zero-friction raw data loading reduces specialized bioinformatics prep time from 12 hours to single-click automation, accelerating research pipelines."
      }
    },
    {
      agentic: false,
      researcher: {
        title: "High-Fidelity QC Filter & Density Bounds",
        text: "Excludes cells with high signal sparsity or aberrant housekeeping levels. Discards events with missingness > 60% as non-viable lysed debris. Verifies housekeeping standard deviations to confirm robust analyte recovery without restricting natural biological heterogeneity.",
        insight: "Technical Rigor: Discards low-signal anomalies while retaining maximum genuine physiological marker variance."
      },
      biologist: {
        title: "Weeding Out Damaged Cells & Extracellular Trash",
        text: "Single-cell experiments are incredibly delicate. During sample preparation, some cell membranes pop (lysis), releasing their cytoplasm. We filter out these dead or broken cells by measuring housekeeping proteins (like GAPDH) as a proxy for metabolic activity, retaining only healthy cells.",
        insight: "Biological Context: Ensures dead cell cytoplasmic leaks do not pollute our immune analysis."
      },
      general: {
        title: "Sorting the Good Cells from the Damaged",
        text: "Some cells get bruised or burst during collection, leaving empty wells or scattered cell trash. This stage acts as a quality filter: it detects the broken cells, tosses them away, and saves only the clean, highly active, and perfectly healthy single cells.",
        insight: "Everyday Analogy: Like sorting through a carton of fresh strawberries and throwing away the bruised ones so they don't spoil the bunch."
      },
      pitch: {
        title: "Clean Debris: Adaptive Quality Control Filtering",
        text: "Instead of arbitrary static filtering that discards rare cells, ProteomicLens utilizes housekeeping standard deviations (GAPDH) and adaptive signal sparsity metrics. It isolates and removes lysed cellular debris (dead/ruptured cells) while preserving natural physiological variance.",
        insight: "💡 ML Innovation (Brian Cheung): Adaptive density-based filtration guarantees clean data, ensuring downstream neural embeddings learn real biological features rather than sample preparation noise."
      }
    },
    {
      agentic: false,
      researcher: {
        title: "Entropy-Guided Multi-Run Batch Calibration",
        text: "Corrects for non-biological run-to-run instrument variation. Leverages an iterative entropy-minimization alignment algorithm that maximizes run mixing across coordinate space. Tracks progress using Shannon Entropy scores (approaching 1.0 for perfect mixing) while preserving biological variance.",
        insight: "Technical Rigor: Leverages high-dimensional scaling to eliminate physical run covariates without over-correcting."
      },
      biologist: {
        title: "Calibrating Machine Drift Across Different Runs",
        text: "Mass spectrometers are highly sensitive. Tiny fluctuations in vacuum pressure, humidity, or room temperature can cause protein signals to drift slightly between morning and afternoon runs. This calibration aligns those instrument drifts so that we only compare real biological cell differences.",
        insight: "Biological Context: Ensures that differences in expression are driven by cell lineage (T-Cell vs. Monocyte) rather than machine run order."
      },
      general: {
        title: "Balancing the Analytical Scales",
        text: "If you weigh yourself on three different bathroom scales, they might give slightly different weights. This stage acts like adjusting and calibrating all the scales in the laboratory to read exactly the same baseline, so any weight differences we observe later are guaranteed to be real.",
        insight: "Everyday Analogy: Ensures that a cell measured on Monday looks identical to the same cell measured on Friday."
      },
      pitch: {
        title: "Align Batches: Entropy-Guided Batch Calibration",
        text: "Mass spectrometry runs suffer from severe physical run covariates (instrument drift, vacuum fluctuations). We deploy an iterative, high-dimensional entropy-minimization alignment algorithm. It maximizes run mixing across coordinate space (approaching a Shannon Entropy score of 1.0) while preserving real biological T-cell vs. monocyte expressions.",
        insight: "💡 Scientific Curation (Dr. Verba): This mathematical calibration ensures that cellular signaling networks mapped across different instrument batches are directly and robustly comparable."
      }
    },
    {
      agentic: false,
      researcher: {
        title: "High-Dimensional Graph Partitioning & Leiden Clustering",
        text: "Constructs a shared nearest-neighbor (SNN) graph from calibrated multi-marker profiles. Applies the Leiden community detection algorithm to mathematically group cells. Projects high-dimensional coordinates into 2D space using Uniform Manifold Approximation and Projection (UMAP).",
        insight: "Technical Rigor: Leiden resolution adjusts clustering sensitivity, separating distinct states based on joint marker coordinates."
      },
      biologist: {
        title: "Mapping Co-expressed Cell Lineages & Phenotypes",
        text: "By analyzing all protein markers simultaneously, our algorithms group cells into biological neighborhoods. This separates resting T-lymphocytes, dividing T-lymphocytes, and active monocytes into discrete, homogeneous cell types based on their native protein fingerprints.",
        insight: "Biological Context: Groups cells by overall molecular behavior rather than relying on subjective human tagging."
      },
      general: {
        title: "Grouping Cells into Families",
        text: "The computer scans the protein fingerprints of all the cells and automatically clusters them into families. T-cells go in one group, and monocytes go in another. This is visualized as clusters of colored dots grouped together on our interactive immune map.",
        insight: "Everyday Analogy: Like taking a giant bucket of mixed coins and sorting them into quarters, dimes, nickels, and pennies."
      },
      pitch: {
        title: "Group Cells: Leiden Community Detection & Latent SNN Graphing",
        text: "We construct a Shared Nearest-Neighbor (SNN) graph and apply the Leiden community detection algorithm to partition cells into discrete clusters. Projected onto an interactive UMAP canvas, this automatically groups cells into precise phenotypes (resting T-cells, dividing T-cells, macrophages) based on native multi-marker coordinates.",
        insight: "💡 Spinout Potentials: High-resolution unsupervised grouping replaces tedious manual gating, allowing researchers to discover novel drug-responsive sub-populations in real-time."
      }
    },
    {
      agentic: true,
      researcher: {
        title: "Three-Round Agentic Verification & Cross-Examination",
        text: "Executes a multi-agent auditing protocol. Round 1 validates marker expression thresholds; Round 2 evaluates population-wide volume constraints; Round 3 performs automated biology contradiction checks (e.g., resolving phagocytic co-expression vs. multiplet sorting noise).",
        insight: "Technical Rigor: Multi-round checks minimize false-positive annotations through automated cellular lineage rule checking."
      },
      biologist: {
        title: "Biological Double-Check & Immune Conflict Resolution",
        text: "Validates our mathematical cell groupings using known biological facts. For example, Cluster 5 contains monocyte markers as well as T-cell markers. Rather than declaring it an impossible hybrid, our AI reviews immune behaviors and confirms phagocytosis: these are macrophages that engulfed T-cells!",
        insight: "Biological Context: Discovers rich immune interactions, like engulfment (phagocytosis), that simple clustering algorithms miss."
      },
      general: {
        title: "The Smart Molecular Detective",
        text: "Sometimes mathematical grouping makes weird guesses—like finding a bizarre hybrid cell that is half-T-cell and half-monocyte. Our AI steps in like a detective, proving that this is actually a hungry macrophage immune cell that just finished 'eating' a dying T-cell!",
        insight: "Everyday Analogy: Like a detective finding a suspect with cookie crumbs on their face and deducing they just raided the jar."
      },
      pitch: {
        title: "Double-Check ID: 3-Round Agentic Identity Verification",
        text: "This is our 'Secret Sauce.' Standard pipelines fail to annotate ambiguous clusters (like co-expression of lymphoid and myeloid markers). ProteomicLens runs a multi-agent validation protocol (Round 1: Marker verification, Round 2: Volumetric bounds, Round 3: Contradiction checks). In our demo, it proves Cluster 5 isn't an algorithm error—it's a macrophage engulfing (phagocytosing) a T-cell!",
        insight: "💡 The AI Advantage: Captures active cell-to-cell immune interactions in real-time that traditional tools completely miss, unlocking new immuno-oncology insights."
      }
    },
    {
      agentic: false,
      researcher: {
        title: "UniProt KB Reference Mapping & AlphaFold Folds",
        text: "Directly maps high-variance marker protein names to standardized accession numbers in the UniProt Knowledgebase. Integrates with the AlphaFold DB to retrieve structural coordinates, enabling visual analysis of 3D protein folds and target binding domains.",
        insight: "Technical Rigor: Direct integration with international bioinformatics databases for downstream drug design."
      },
      biologist: {
        title: "Visualizing 3D Protein Structures & Receptor Domains",
        text: "Proteins are 3D nanomachines. Looking up CD3E (T-cell receptor) or CD14 (monocyte receptor) lets us study their physical shape, active folds, and binding pockets, helping us understand how these molecules physically latch onto pathogens or signal other immune components.",
        insight: "Biological Context: Bridges the gap between numerical expression and the actual physical shape of the active receptor."
      },
      general: {
        title: "Looking Up the 3D Blueprints of Life",
        text: "This step is like looking up a vehicle part number in an official encyclopedia and viewing a 3D hologram of the engine. We can see the actual physical 3D shape of the proteins that make these cells unique, showing how they lock and unlock like keys.",
        insight: "Everyday Analogy: Shows the physical nanomachines that cells use to grab onto targets or talk to other cells."
      },
      pitch: {
        title: "Map Proteins: Standardized UniProt mapping & 3D AlphaFold Structures",
        text: "Bridges the gap between raw quantitative expression data and physical structural biology. We map active biomarkers directly to their UniProt accession codes and load fully folded 3D structures from the AlphaFold DB, allowing active kinase signaling loops or binding pocket sites to be evaluated.",
        insight: "💡 Structural Target (Dr. Verba): Replicates the rapid atomic-level structural analysis used to resolve the SARS-CoV-2 Orf9b/Tom70 immune interaction, dramatically accelerating virtual drug screening."
      }
    },
    {
      agentic: true,
      researcher: {
        title: "Agentic PubMed Mining & Literature Synthesis",
        text: "Synthesizes peer-reviewed evidence by crawler-querying academic repository engines (PubMed/NCBI). Cross-references co-expression keywords, indexes active PMIDs and DOIs, and writes concise summaries of published clinical cohorts that validate our cell cluster annotations.",
        insight: "Technical Rigor: Delivers verifiable academic proof with DOIs/PMIDs for newly identified cellular boundaries."
      },
      biologist: {
        title: "Validating Bench Findings Against Published Papers",
        text: "Ensures our laboratory results align with established global discoveries. The AI searches millions of academic papers on PubMed to confirm that our identified cell groups and protein combinations match peer-reviewed immunology and oncology literature.",
        insight: "Biological Context: Automatically cross-references your bench results with decades of global textbook science."
      },
      general: {
        title: "Double-Checking the Global Science Library",
        text: "Imagine if our AI finished its work and immediately ran to the world's largest library to find books and research studies that prove its findings are correct. This step displays the exact scientific papers and publications that support our discoveries.",
        insight: "Everyday Analogy: Like writing an essay and instantly finding three encyclopedias that back up your argument."
      },
      pitch: {
        title: "Literature Scan: Real-Time PubMed Grounding & Verification",
        text: "To guarantee clinical validity, ProteomicLens crawlers automatically query PubMed and NCBI database engines. It cross-references active biomarkers and co-expression profiles with thousands of peer-reviewed papers, extracting real PMIDs/DOIs and generating automated clinical evidence reviews.",
        insight: "💡 Automated Scholarly Rigor: Reads, parses, and synthesizes 100+ academic studies in 8 seconds, compressing months of painstaking literature search into instant, fully verified validation."
      }
    },
    {
      agentic: false,
      researcher: {
        title: "High-Throughput Clinical Synthesis & Multi-Geographic ROI Audit",
        text: "Assembles QC filtration metrics, alignment uniformity, cell ratios, database accessions, and literature records. Calculates fully burdened geographic wage indexes (UCSF SF-Premium + 61.5% overhead vs. USA vs. Global) to audit laboratory return on investment.",
        insight: "Technical Rigor: Converts computational hours saved into tangible financial return-on-investment budgets across global facilities."
      },
      biologist: {
        title: "Experimental Curation & Scientific Time Freed",
        text: "Compiles a complete, publication-ready clinical summary report of cellular fractions, verified markers, and protein accessions. Demonstrates how automation saves weeks of manual coding and library searches, allowing researchers to spend more time on therapeutic design.",
        insight: "Research Acceleration: Shows how tedious spreadsheet work is replaced by a single-click automated pipeline."
      },
      general: {
        title: "Your Automated Research Report Card",
        text: "This final scorecard shows exactly what we discovered, what those cells do, and how much time and money we saved by using smart AI instead of manual lab work. It's like having an expert assistant handle 23 hours of research in a single second!",
        insight: "Everyday Analogy: Summarizes the final cellular report, the hours saved, and the money kept in the lab's budget."
      },
      pitch: {
        title: "Summary Report: Quantifying Clinical Output and Venture ROI",
        text: "We bridge complex science with strong business models. ProteomicLens compiles publication-ready clinical summaries of cell fractions and verified markers, and calculates fully burdened laboratory wage savings (UCSF SF-Premium vs. USA vs. Global) to showcase measurable operational efficiency.",
        insight: "💡 VC Thesis (Douglas Crawford): Proves that our platform isn't just a research tool—it's an enterprise-ready workflow accelerator with a clear, quantifiably massive SaaS return-on-investment."
      }
    }
  ];

  const shortNames = [
    "Data Loading",
    "Clean Debris",
    "Align Batches",
    "Group Cells",
    "Double-Check ID",
    "Map Proteins",
    "Literature Scan",
    "Summary Report"
  ];

  const clusterAbundances: Record<number, { protein: string; value: number; color: string }[]> = {
    1: [
      { protein: "CD3E (T-Cell Marker)", value: 85, color: "bg-teal-500" },
      { protein: "CD3D (T-Cell Marker)", value: 76, color: "bg-teal-400" },
      { protein: "GAPDH (Housekeeping)", value: 95, color: "bg-slate-400" },
      { protein: "CD14 (Monocyte)", value: 4, color: "bg-slate-200" },
      { protein: "CD68 (Macrophage)", value: 2, color: "bg-slate-200" },
    ],
    2: [
      { protein: "CD14 (Monocyte Marker)", value: 91, color: "bg-blue-500" },
      { protein: "CD68 (Macrophage Marker)", value: 55, color: "bg-blue-400" },
      { protein: "GAPDH (Housekeeping)", value: 81, color: "bg-slate-400" },
      { protein: "CD3E (T-Cell)", value: 3, color: "bg-slate-200" },
      { protein: "MKI67 (Division)", value: 5, color: "bg-slate-200" },
    ],
    3: [
      { protein: "CD3E (T-Cell Marker)", value: 78, color: "bg-purple-500" },
      { protein: "MKI67 (Dividing Marker)", value: 92, color: "bg-fuchsia-500" },
      { protein: "GAPDH (Housekeeping)", value: 90, color: "bg-slate-400" },
      { protein: "MYC (Oncoprotein)", value: 65, color: "bg-purple-400" },
      { protein: "CD14 (Monocyte)", value: 2, color: "bg-slate-200" },
    ],
    4: [
      { protein: "GAPDH (Housekeeping)", value: 21, color: "bg-rose-400" },
      { protein: "CD3E (T-Cell)", value: 12, color: "bg-slate-300" },
      { protein: "CD14 (Monocyte)", value: 8, color: "bg-slate-300" },
      { protein: "CD68 (Macrophage)", value: 5, color: "bg-slate-300" },
    ],
    5: [
      { protein: "CD68 (Macrophage Marker)", value: 94, color: "bg-amber-500" },
      { protein: "CD14 (Monocyte Marker)", value: 84, color: "bg-amber-400" },
      { protein: "CD3E (Engulfed T-Cell)", value: 45, color: "bg-teal-500/60" },
      { protein: "CD3D (Engulfed T-Cell)", value: 38, color: "bg-teal-400/60" },
      { protein: "GAPDH (Housekeeping)", value: 88, color: "bg-slate-400" },
    ]
  };

  const getClusterExplanation = (id: number, perspective: "researcher" | "biologist" | "general" | "pitch") => {
    if (perspective === "pitch") {
      switch (id) {
        case 1:
          return "Baseline Lymphoid Control (Jurkat T-cells): Rest state cohort expressing standard surface markers (CD3D/E). Serves as our experimental control to measure activation signal differentials.";
        case 2:
          return "Innate Immune Reference (U-937 Monocytes): Resting myeloid state. Crucial baseline for evaluating innate immune system response bounds and therapeutic target profiling.";
        case 3:
          return "Rapid Cell Proliferation (Mitotic T-cells): High-throughput division phase markers (Ki-67/MYC are elevated). Identifies rapid clonal expansion which is a major oncology and drug target hotspot.";
        case 4:
          return "High-Sparsity Lysed Debris: Isolated dead-cell signatures that registration algorithms automatically flag and remove, showing pipeline noise-canceling integrity.";
        case 5:
          return "Phagocytic Engulfment Capture (Macrophages): Active biological action captured. Macrophages are double-positive for CD14/CD3E, proving cell-to-cell swallowing in action—this represents a high-value discovery for immuno-oncology.";
        default:
          return "An identified cell cluster showing consistent protein levels across multiple experimental runs.";
      }
    } else if (perspective === "researcher") {
      switch (id) {
        case 1:
          return "Jurkat T-lymphocyte lineage in resting phase. Expresses highly elevated CD3D/CD3E peptide abundance profiles, with negligible expression of cell cycle machinery markers (MKI67/MYC), establishing the baseline un-stimulated control cohort.";
        case 2:
          return "U-937 myeloid lineage cells acting as baseline monocytes. Characterized by severe CD14/CD68 co-expression peaks, reflecting standard resting myeloid transcriptomic/proteomic activity boundaries.";
        case 3:
          return "Mitotic Jurkat T-cell cohort in active division phase. Exhibits massive co-expression of replication-regulatory transcription factors (MYC) alongside mitotic division markers (MKI67), signaling high cellular division rates.";
        case 4:
          return "Lysed cellular fragments and empty carrier well noise. Only low-level household housekeeping coordinates (GAPDH) register. These represent dead cell events that were filtered out from final biological analysis.";
        case 5:
          return "Specialized macrophage state. Represents phagocytic engulfment events. These myeloid cells are double-positive for macrophage surface markers (CD14) and engulfed lymphoid antigens (CD3E/CD3D), indicating complete macrophage clearance of T-cell fragments.";
        default:
          return "An identified cell cluster showing consistent protein levels across multiple experimental runs.";
      }
    } else if (perspective === "biologist") {
      switch (id) {
        case 1:
          return "These are healthy, resting Jurkat T-lymphocytes. They express high levels of CD3E and CD3D receptors on their surface but show very little cell division. They serve as our baseline lymphoid group.";
        case 2:
          return "U-937 monocytes are primary myeloid immune cells that circulate searching for foreign signals. They are identified by high CD14 and CD68 markers, representing the resting myeloid lineage.";
        case 3:
          return "These T-cells are in an active state of rapid cell division (mitosis), marked clearly by highly elevated replication proteins like Ki-67 (MKI67) and MYC. Crucial for understanding lymphoid activation.";
        case 4:
          return "Cells that ruptured or died during lab sorting. Only general survival proteins (like housekeeping GAPDH) remain in this group. They are filtered out to keep the study clean.";
        case 5:
          return "A fascinating macrophage state displaying phagocytosis. These macrophages have engulfed (swallowed) nearby dying T-cells. Because they swallowed them, they show active signals for BOTH macrophage markers (CD14) and T-cell markers (CD3E)!";
        default:
          return "An identified cell cluster showing consistent protein levels across multiple experimental runs.";
      }
    } else {
      switch (id) {
        case 1:
          return "These are healthy, quiet white blood cells called T-cells. They act as our starting comparison point. They are not active or dividing, just floating peacefully.";
        case 2:
          return "These are monocytes, which act as the body's security guard cells. They patrol looking for invaders and carry surface tags like CD14 to identify themselves.";
        case 3:
          return "These are highly active T-cells caught in the middle of duplicating themselves! They have massive replication engine proteins turned on, meaning they are active and multiplying.";
        case 4:
          return "This is cellular debris—cells that burst or popped during the delicate experiment. They have no useful immune signals left and must be tossed out.";
        case 5:
          return "An amazing macrophage cell caught in action! These cells are 'eater' immune cells. They have swallowed a nearby dying T-cell, which is why they carry markers for both types of cells!";
        default:
          return "An identified cell cluster showing consistent protein levels across multiple experimental runs.";
      }
    }
  };

  // Determine a safe index in case activeStep is invalid or out of bounds (e.g. if set to an event object or NaN)
  const safeStep = (typeof activeStep === "number" && steps[activeStep]) ? activeStep : 0;
  const effectiveAudience = audience === "pitch" ? "biologist" : audience;

  return (
    <div id="step-visualizer" className="w-full space-y-6 font-sans">
      {/* Full-Width Horizontal Stepper Container */}
      <div className="bg-white border border-slate-200/85 p-5 rounded-3xl shadow-sm overflow-hidden">
        <div className="relative overflow-x-auto scrollbar-none pb-1">
          {/* Inner Stepper flex wrapper */}
          <div className="relative flex items-center justify-between min-w-[750px] lg:min-w-0 w-full px-4">
            
            {/* Background Line */}
            <div className="absolute left-10 right-10 top-4.5 h-0.5 bg-slate-100 -z-10" />
            <div 
              className="absolute left-10 top-4.5 h-0.5 bg-teal-500 transition-all duration-500 -z-10" 
              style={{ 
                width: executingStep > 0 ? `calc(${(executingStep / 7) * 100}% - 20px)` : "0px"
              }}
            />

            {steps.map((s) => {
              const isActive = safeStep === s.num;
              const progress = stageProgress[s.num] || 0;
              const isCompleted = progress === 100;
              const isProcessing = isRunning && executingStep === s.num;
              const isLocked = isRunning && s.num > executingStep;
              const isClickable = !isLocked;

              let circleClass = "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all text-xs font-bold font-mono shrink-0 ";
              let labelClass = "text-[10px] font-sans font-bold tracking-tight mt-1.5 whitespace-nowrap transition-colors ";
              
              if (isCompleted) {
                circleClass += "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10";
                labelClass += "text-emerald-700 font-extrabold";
              } else if (isProcessing) {
                circleClass += "bg-amber-500 border-amber-500 text-white animate-pulse shadow-sm shadow-amber-500/10";
                labelClass += "text-amber-700 font-extrabold animate-pulse";
              } else if (isActive) {
                circleClass += "bg-teal-550 bg-teal-600 border-teal-600 text-white shadow-sm ring-2 ring-teal-500/20";
                labelClass += "text-teal-900 font-extrabold";
              } else if (isLocked) {
                circleClass += "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed";
                labelClass += "text-slate-300 font-medium";
              } else {
                circleClass += "bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700";
                labelClass += "text-slate-500 font-semibold";
              }

              return (
                <button
                  key={s.num}
                  disabled={!isClickable}
                  onClick={() => setActiveStep(s.num)}
                  className="flex flex-col items-center flex-1 min-w-[80px] relative z-10 group transition-all cursor-pointer"
                >
                  <div className={circleClass}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    ) : (
                      <span>{s.num + 1}</span>
                    )}
                  </div>
                  <span className={labelClass}>{shortNames[s.num]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Pipeline Execution Embedded Display */}
      {isRunning && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 p-6 md:p-8 rounded-3xl shadow-xl shadow-indigo-500/10 relative overflow-hidden animate-fade-in flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Background glowing effects */}
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Progress Circle / Indicator */}
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
            <span className="absolute -bottom-2.5 bg-indigo-600 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full text-white border border-indigo-400 shadow-md">
              {stageProgress[executingStep]}%
            </span>
          </div>

          <div className="flex-1 space-y-3.5 text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-350 text-teal-400 font-mono bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20 w-fit mx-auto md:mx-0">
                Stage {executingStep + 1} of 8: {getPipelineStepDetails(executingStep).engine}
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              {getPipelineStepDetails(executingStep).title}
            </h3>

            <p className="text-sm md:text-base font-semibold text-slate-200 leading-relaxed max-w-3xl">
              {getPipelineStepDetails(executingStep).details}
            </p>

            {/* Current Sub-task log line */}
            <div className="flex items-center gap-2.5 text-xs text-slate-350 font-semibold justify-center md:justify-start">
              <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
              <span className="font-mono text-teal-300 font-bold text-[11px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {getPipelineStepDetails(executingStep).visualState[Math.floor((stageProgress[executingStep] || 0) / 34) % 3] || getPipelineStepDetails(executingStep).visualState[0]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Stage Sub-Task Log Verification */}
      {!isRunning && stageProgress[7] === 100 && (
        <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg border border-indigo-500/20">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">
                  Stage {safeStep + 1} Sub-Task Log Verification
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Currently viewing: <strong className="text-indigo-600 font-bold">{getPipelineStepDetails(safeStep).title}</strong> ({getPipelineStepDetails(safeStep).engine})
                </p>
              </div>
            </div>
            
            {/* Expand details icon button under that step */}
            <button
              onClick={() => setExpandedSteps(prev => ({ ...prev, [safeStep]: !prev[safeStep] }))}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                expandedSteps[safeStep] !== false
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-slate-600 hover:text-slate-800 border-slate-200 hover:bg-slate-50"
              }`}
              title="Toggle verification logs"
            >
              <span className="hidden sm:inline">
                {expandedSteps[safeStep] !== false ? "Hide Details" : "Expand Details"}
              </span>
              {expandedSteps[safeStep] !== false ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSteps[safeStep] !== false && (
            <div className="pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
              {getPipelineStepDetails(safeStep).visualState.map((task, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/70 hover:border-indigo-100 p-3.5 rounded-2xl flex items-start gap-2.5 shadow-xs transition-colors duration-200"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Sub-Task {idx + 1} Verified</span>
                    <p className="text-xs font-semibold text-slate-700 leading-snug">{task}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step Page Detailed Output */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Step Header */}
        <div className="border-b border-slate-100 pb-3.5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
              {steps[safeStep].title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{steps[safeStep].desc}</p>
          </div>
          <div className="text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg text-slate-500 border border-slate-200 w-fit">
            EXP_ID: {pipelineData.experimentId}
          </div>
        </div>

        {/* Complete Notification Banner */}
        {stageProgress[7] === 100 && !isRunning && (
          <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl mb-5 text-emerald-950 flex items-start gap-3 shadow-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold font-sans uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                Pipeline Run Complete
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                The entire dataset analysis has run successfully! Click on each stage on the left to check its detailed results.
              </p>
            </div>
          </div>
        )}

        {/* Audience Perspective Segmented Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/50 p-3 rounded-2xl mb-5 shadow-inner">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Select Target Audience</span>
            <span className="text-xs font-bold text-slate-700 font-sans">Tailor results clarity or view our Keynote Slide-Deck:</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-250/30 p-1 rounded-xl border border-slate-200/40 shrink-0 overflow-x-auto font-sans">
            <button
              onClick={() => setAudience("researcher")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                audience === "researcher"
                  ? "bg-white text-teal-700 shadow-xs border border-slate-200/80 font-black"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-teal-500" />
              <span>Researcher</span>
            </button>
            <button
              onClick={() => setAudience("biologist")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                audience === "biologist"
                  ? "bg-white text-indigo-750 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Biology Student</span>
            </button>
            <button
              onClick={() => setAudience("general")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                audience === "general"
                  ? "bg-white text-amber-700 shadow-xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>General</span>
            </button>
            <button
              onClick={() => setAudience("pitch")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                audience === "pitch"
                  ? "bg-white text-rose-700 shadow-xs border border-slate-200/80 font-black"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-rose-500" />
              <span>Pitch</span>
            </button>
          </div>
        </div>

        {/* Audience-Specific Detailed Explanation Card */}
        <div className={`p-5 rounded-2xl border mb-5 transition-all relative overflow-hidden shadow-sm ${
          audience === "pitch"
            ? "bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-indigo-500/5 border-rose-200 shadow-md shadow-rose-100/10"
            : audience === "researcher"
            ? "bg-teal-50/10 border-teal-200/70"
            : audience === "biologist"
            ? "bg-indigo-50/15 border-indigo-200/60"
            : "bg-amber-50/10 border-amber-200/50"
        }`}>
          {/* Subtle colored glow decoration */}
          <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-25 ${
            audience === "pitch" ? "bg-gradient-to-br from-amber-400 to-rose-400" : audience === "researcher" ? "bg-teal-400" : audience === "biologist" ? "bg-indigo-400" : "bg-amber-400"
          }`} />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 relative z-10">
            <div className="flex items-center gap-1.5">
              {audience === "pitch" && <Award className="w-4 h-4 text-rose-500 shrink-0" />}
              {audience === "researcher" && <Dna className="w-4 h-4 text-teal-600 shrink-0" />}
              {audience === "biologist" && <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />}
              {audience === "general" && <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />}
              
              <span className={`text-xs font-black uppercase tracking-tight font-sans ${audience === "pitch" ? "text-rose-950" : "text-slate-850"}`}>
                {audienceExplanations[safeStep][audience].title}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {audience === "pitch" ? (
                <span className="text-[9px] font-black text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-rose-500" /> Hackathon Slide {safeStep + 1} of 8
                </span>
              ) : audienceExplanations[safeStep].agentic ? (
                <span className="text-[9px] font-black text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <BrainCircuit className="w-2.5 h-2.5 text-indigo-600" /> Agentic AI Execution
                </span>
              ) : (
                <span className="text-[9px] font-black text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-mono uppercase tracking-wider flex items-center gap-1">
                  <Database className="w-2.5 h-2.5 text-teal-600" /> Mathematical Stage
                </span>
              )}
            </div>
          </div>
          
          <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3.5 relative z-10 font-medium">
            {audienceExplanations[safeStep][audience].text}
          </p>
          
          <div className={`p-3 rounded-xl border text-[11px] font-sans flex items-start gap-2 relative z-10 ${
            audience === "pitch"
              ? "bg-rose-50/50 border-rose-100 text-rose-950"
              : audience === "researcher"
              ? "bg-teal-50/50 border-teal-150/50 text-teal-950"
              : audience === "biologist"
              ? "bg-indigo-50/50 border-indigo-150/50 text-indigo-950"
              : "bg-amber-50/30 border-amber-150/40 text-amber-950"
          }`}>
            <span className="font-extrabold shrink-0 uppercase tracking-wider text-[9px] bg-white px-1.5 py-0.5 rounded border shadow-xxs flex items-center gap-1">
              {audience === "pitch" ? (
                <>
                  <Award className="w-2.5 h-2.5 text-rose-500 animate-pulse" /> Pitch Highlight
                </>
              ) : audience === "researcher" ? (
                <>
                  <Dna className="w-2.5 h-2.5 text-teal-500" /> Rigorous Note
                </>
              ) : audience === "biologist" ? (
                <>
                  <GraduationCap className="w-2.5 h-2.5 text-indigo-500" /> Biological Insight
                </>
              ) : (
                <>
                  <Lightbulb className="w-2.5 h-2.5 text-amber-500" /> Simple Analogy
                </>
              )}
            </span>
            <span className="leading-relaxed font-semibold">
              {audienceExplanations[safeStep][audience].insight}
            </span>
          </div>
        </div>

        {audience !== "pitch" ? (
          <>
            {/* STEP 0: Ingestion */}
            {activeStep === 0 && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>First Stage:</strong> In single-cell proteomics, we upload a large grid (matrix) of cells and protein levels. This is the starting point of our biological discovery.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Cells Uploaded</span>
                <p className="text-lg font-mono font-bold text-slate-800 mt-1">{pipelineData.totalCells}</p>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Individual biological units</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Proteins Found</span>
                <p className="text-lg font-mono font-bold text-slate-800 mt-1">{pipelineData.totalProteins}</p>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Known protein markers</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Unrecorded Blanks (Missing)</span>
                <p className="text-lg font-mono font-bold text-amber-600 mt-1">{pipelineData.missingnessPercent}%</p>
                <span className="text-[10px] text-amber-600/80 font-sans block mt-0.5">Expected due to machine limits</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
              <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 font-sans">Matrix Grid Preview (Ready for Clean up)</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                We successfully detected cell ID headers and protein abundance values. Because single cells are so tiny, the mass spectrometer doesn&apos;t detect every protein (resulting in <strong>N/D</strong> or &quot;Not Detected&quot; blanks). Our algorithms treat these missing values as valuable clues!
              </p>

              <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 font-mono">CSV File Sample:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-2.5">cell_id</th>
                      <th className="py-2 px-2.5">CD3E (T-Cell marker)</th>
                      <th className="py-2 px-2.5">CD3D</th>
                      <th className="py-2 px-2.5">CD14 (Monocyte marker)</th>
                      <th className="py-2 px-2.5">CD68</th>
                      <th className="py-2 px-2.5">GAPDH (Housekeeping)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="py-2 px-2.5 font-bold font-mono text-teal-600 text-xs">cell_0001</td>
                      <td className="py-2 px-2.5">8.22</td>
                      <td className="py-2 px-2.5">7.41</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5">9.54</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold font-mono text-teal-600 text-xs">cell_0002</td>
                      <td className="py-2 px-2.5">6.91</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5">8.11</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold font-mono text-teal-600 text-xs">cell_0003</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5">7.41</td>
                      <td className="py-2 px-2.5">8.92</td>
                      <td className="py-2 px-2.5">9.02</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold font-mono text-teal-600 text-xs">cell_0004</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5 font-mono text-slate-300">N/D</td>
                      <td className="py-2 px-2.5">6.88</td>
                      <td className="py-2 px-2.5">7.11</td>
                      <td className="py-2 px-2.5">8.44</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Adaptive QC */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cleaning dying/empty cells:</strong> Dying cells leak proteins, and empty wells contain nothing. We automatically separate these &quot;bad&quot; cells so they don&apos;t skew our research.
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Filtering Results Breakdown:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">PASSED (Healthy)</span>
                  <p className="text-lg font-bold text-emerald-600 font-mono mt-0.5">{pipelineData.qc.cellsPassed}</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">REMOVED (Bad Quality)</span>
                  <p className="text-lg font-bold text-rose-600 font-mono mt-0.5">{pipelineData.qc.cellsRemoved}</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">TOO EMPTY (Debris)</span>
                  <p className="text-lg font-bold text-slate-500 font-mono mt-0.5">{pipelineData.qc.filterBMaxMissing}</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">NO POWER indicator</span>
                  <p className="text-lg font-bold text-slate-500 font-mono mt-0.5">{pipelineData.qc.filterCHousekeeping}</p>
                </div>
              </div>
            </div>

            {/* Informative Missingness Map */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 font-sans">
                <Info className="w-4 h-4 text-teal-600" /> High-Information Protein Signal Variance
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 font-sans">
                Proteomics machines don&apos;t always find every protein. However, if a protein is missing *consistently* in one cell type but active in another, that represents strong biological evidence rather than a fluke. The protein markers below show the highest distinct detection rates, indicating they are our key targets!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pipelineData.qc.topInformative.map((item, idx) => (
                  <div key={item.protein} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {idx + 1}. {item.protein}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${item.rate}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.rate}% detection</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Batch Correction */}
        {activeStep === 2 && (
          <div className="space-y-4 font-sans">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Machine Calibration alignment:</strong> Mass spectrometers can give slightly different signal levels on different days. This stage mathematically aligns those differences so we only see genuine biology.
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              We apply an **Entropy-Guided Iterative Batch Alignment**. We measure alignment quality using &quot;Shannon Entropy&quot;. Think of it like mixing two paint colors: if they are well-mixed, the entropy gets closer to 1.0!
            </p>

            <div className="space-y-2 font-sans">
              {pipelineData.batch.rounds.map((round) => (
                <div key={round.round} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="bg-white px-3 py-2 rounded-xl font-mono text-center border border-slate-200 shadow-sm">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Round</span>
                    <span className="text-sm font-bold text-teal-600">0{round.round}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Mixing Uniformity Score</span>
                      <span className="text-xs font-mono font-bold text-teal-600">{round.entropy} / 1.0</span>
                    </div>
                    {/* Entropy slider visualization */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${round.entropy * 100}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 italic font-sans">{round.interpretation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-slate-700">
              <span className="font-sans font-medium">Alignment finished successfully. Pure biology preserved:</span>
              <span className="font-bold font-mono text-emerald-700 text-right">YES (Entropy: {pipelineData.batch.finalEntropy})</span>
            </div>
          </div>
        )}

        {/* STEP 3: Clustering */}
        {safeStep === 3 && (
          <div className="space-y-6 font-sans">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {audience === "researcher" ? "SNN Leiden Graph Partitioning:" : audience === "biologist" ? "Unbiased Cell Phenotype Grouping:" : "Grouping Cells into Families:"}
                </strong>{" "}
                {audience === "researcher"
                  ? "Identifies high-dimensional manifolds and partitions nearest-neighbor nodes into clusters."
                  : audience === "biologist"
                  ? "Groups cells based on active marker pathways into homogeneous cellular neighborhoods."
                  : "An algorithm sorts similar cells together so we can map out our immune cell family groups."}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive UMAP Plot (Takes 7 columns on large screens) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/85 p-4 rounded-3xl shadow-sm">
                <UMAPPlot
                  cells={pipelineData.cells}
                  selectedClusterId={selectedClusterId}
                  onSelectCluster={onSelectCluster}
                />
              </div>

              {/* Right Column: Controls, Cluster list, and molecular detail (Takes 5 columns) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">
                      {audience === "researcher" ? "Mathematical Partitions:" : audience === "biologist" ? "Proposed Cell Types:" : "Discovered Cell Groups:"}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-500 font-mono">
                        {audience === "researcher" ? "Leiden Resolution (γ):" : audience === "biologist" ? "Clustering Sensitivity:" : "Group Sizes:"}
                      </span>
                      <input
                        type="range"
                        min="0.3"
                        max="1.2"
                        step="0.1"
                        value={resolution}
                        onChange={(e) => setResolution(parseFloat(e.target.value))}
                        className="w-16 accent-teal-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                      />
                      <span className="text-[10px] font-bold text-teal-600 font-mono bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded">{resolution}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[9px] font-mono">
                          <th className="py-1.5 px-2">{audience === "researcher" ? "Partition ID" : audience === "biologist" ? "Proposed Cell Lineage" : "Group Name"}</th>
                          <th className="py-1.5 px-2">{audience === "researcher" ? "Node Density" : audience === "biologist" ? "Sample Count" : "Total Cells"}</th>
                          <th className="py-1.5 px-2">{audience === "researcher" ? "Cohort Ratio" : audience === "biologist" ? "Of Study" : "Percentage"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/60 text-slate-700 font-sans">
                        {pipelineData.clusters.map((c) => {
                          const isSelected = selectedClusterId === c.id;
                          return (
                            <tr
                              key={c.id}
                              onClick={() => onSelectCluster(isSelected ? null : c.id)}
                              className={`hover:bg-slate-100 cursor-pointer transition-colors ${
                                isSelected ? "bg-teal-50/70 text-teal-950 font-bold" : ""
                              }`}
                            >
                              <td className="py-2 px-2 font-mono text-teal-600">
                                {audience === "researcher" ? `Cluster ${c.id}` : audience === "biologist" ? c.proposedLabel : `Group ${c.id}: ${c.proposedLabel.split(" ")[0]}`}
                              </td>
                              <td className="py-2 px-2 font-mono">{c.cellCount} cells</td>
                              <td className="py-2 px-2 font-mono">{c.percentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans italic flex items-center gap-1">
                    <Lightbulb className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span>
                      {audience === "researcher"
                        ? "Select a coordinate node row or click spatial scatter points to display biomarker values."
                        : audience === "biologist"
                        ? "Click any cell lineage above or dot on the map to display biological profile details."
                        : "Click a cell group row or any dot on the map to see its molecular ID card."}
                    </span>
                  </p>
                </div>

                {/* Selected Cluster Details Panel */}
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs space-y-3 shadow-inner">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <Fingerprint className="w-4 h-4 text-teal-600" />
                    {audience === "researcher" ? "High-Dimensional Molecular Profile" : audience === "biologist" ? "Lineage Abundance Levels" : "Cell Profile Fingerprint"}
                  </h4>
                  
                  {selectedClusterId !== null ? (
                    <div className="space-y-4">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
                          {audience === "researcher" ? "IDENTIFIED SYSTEM PATHWAY" : audience === "biologist" ? "ASSIGNED IMMUNE CELL TYPE" : "VERIFIED CELL FAMILY NAME"}
                        </span>
                        <span className="text-slate-950 font-extrabold text-xs block mt-0.5">
                          {pipelineData.clusters.find(c => c.id === selectedClusterId)?.proposedLabel}
                        </span>
                        <span className="inline-block mt-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          {pipelineData.clusters.find(c => c.id === selectedClusterId)?.tier} Confidence
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-650 leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        {getClusterExplanation(selectedClusterId, audience)}
                      </div>

                      <div className="space-y-2">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
                          {audience === "researcher" ? "COORDINATE BIOMARKER MATRIX" : audience === "biologist" ? "LINEAGE MARKER DENSITY" : "CELL PROFILE FINGERPRINT"}
                        </span>
                        <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          {clusterAbundances[selectedClusterId]?.map((item) => (
                            <div key={item.protein} className="space-y-1">
                              <div className="flex justify-between text-[9px] font-mono font-semibold">
                                <span className="text-slate-600">{item.protein}</span>
                                <span className="text-slate-900 font-bold">{item.value}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden border border-slate-200">
                                <div className={`${item.color} h-1 rounded-full`} style={{ width: `${item.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 py-6 text-center font-sans">
                      <p className="text-[10px] font-semibold text-slate-600">No cell group selected</p>
                      <p className="text-[9px] text-slate-400 mt-1 max-w-[160px] mx-auto leading-normal">
                        {audience === "researcher"
                          ? "Select a partition ID or a scatter dot to project abundance curves."
                          : audience === "biologist"
                          ? "Click a cellular lineage or map dot to display its specific marker profile."
                          : "Click a cell group or map dot to view its specific molecular ID card."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Three-Round Context-Aware Annotation */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {audience === "researcher" ? "Multi-Agent Clinical Consensus Engine:" : audience === "biologist" ? "Biological Multi-Round Identity Audit:" : "Three-Round Detective Verification:"}
                </strong>{" "}
                {audience === "researcher"
                  ? "Enforces three logical gates (Expression thresholds, Volume restrictions, and Contradiction checks) to assign and verify high-accuracy phenotypes."
                  : audience === "biologist"
                  ? "Runs marker, population ratio, and immunology contradiction tests to ensure cell names match clinical truth."
                  : "Runs a three-round double-check to make sure our cell identifications are fully correct."}
              </div>
            </div>

            <div className="space-y-3 font-sans">
              {pipelineData.clusters.map((c) => {
                const isSelected = selectedClusterId === c.id;
                const tierColor =
                  c.tier === "TIER 1"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : c.tier === "TIER 2"
                    ? "text-blue-700 bg-blue-50 border-blue-100"
                    : "text-amber-700 bg-amber-50 border-amber-100";

                return (
                  <div
                    key={c.id}
                    className={`bg-slate-50/30 rounded-xl border p-4.5 transition-all hover:border-slate-300 cursor-pointer ${
                      isSelected ? "border-teal-400 bg-teal-50/10 shadow-sm" : "border-slate-200"
                    }`}
                    onClick={() => onSelectCluster(isSelected ? null : c.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-teal-600 text-sm">
                          {audience === "researcher" ? `Cluster Partition ${c.id}` : audience === "biologist" ? `Cluster ${c.id}: ${c.proposedLabel}` : `Group ${c.id}: ${c.proposedLabel}`}
                        </span>
                        {audience === "researcher" && (
                          <h4 className="text-xs font-bold text-slate-800">{c.proposedLabel}</h4>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border font-mono ${tierColor}`}>
                        {c.tier} Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
                      {/* Round 1 */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                          {audience === "researcher" ? "GATE 1: Abundance Overlap" : audience === "biologist" ? "ROUND 1: Marker Levels" : "STEP 1: Marker Check"}
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                          {audience === "researcher" 
                            ? `Marker variables [${c.markersQuantity.join(", ")}] exceed high-density statistical classification bounds.`
                            : audience === "biologist"
                            ? `Active markers "${c.markersQuantity.join(", ")}" establish the baseline cellular lineage.`
                            : `Confirmed presence of essential marker tags: ${c.markersQuantity.join(", ")}.`}
                        </p>
                      </div>

                      {/* Round 2 */}
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                          {audience === "researcher" ? "GATE 2: Population Bounds" : audience === "biologist" ? "ROUND 2: Size & Constraints" : "STEP 2: Group Sizes"}
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                          {audience === "researcher"
                            ? `Constitutes ${c.percentage}% of the parsed matrix. Conforms to maximum volume density constraints.`
                            : audience === "biologist"
                            ? `Represents ${c.percentage}% of the study, fitting expected physiological distribution models.`
                            : `Represents ${c.percentage}% of the cells in this study, which matches typical healthy mixtures.`}
                        </p>
                      </div>

                      {/* Round 3 */}
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                          {audience === "researcher" ? "GATE 3: Contradiction Check" : audience === "biologist" ? "ROUND 3: Conflict Auditing" : "STEP 3: Mystery Solved"}
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium font-sans">
                          {audience === "researcher"
                            ? `Conflict flag resolution: ${c.contradictions.join(", ") || "No logical contradictions encountered."}`
                            : audience === "biologist"
                            ? `Immunology conflict check: ${c.contradictions.join(", ") || "Passed without biological conflicts."}`
                            : `Conflict check: ${c.contradictions.join(", ") || "No weird biological conflicts found."}`}
                        </p>
                      </div>
                    </div>

                    {/* Explanatory notes if phagocytic or lytic */}
                    {c.id === 5 && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-900 leading-relaxed font-sans font-medium">
                        {audience === "researcher" ? (
                          <span>⚡ <strong>Phagocytic Target Clearance Verification (Macrophage Engulfment):</strong> Myeloid cells exhibiting lymphoid markers (CD3E/CD3D) were computationally audited. Rather than sorting multiplets, high-density marker expression confirms active phagocytosis of apoptosing Jurkat T-cells, confirming myeloid status.</span>
                        ) : audience === "biologist" ? (
                          <span>⚡ <strong>Immune Phagocytosis Event Discovered:</strong> Under normal analysis, finding lymphoid markers in a macrophage is a contradiction. Our AI resolved this: the macrophages have swallowed (engulfed) dying T-cells, explaining the dual protein signature!</span>
                        ) : (
                          <span>⚡ <strong>Detective Breakthrough (Cell Eating Caught in Action):</strong> The computer was confused because this macrophage cell had T-cell proteins on it. Our smart AI solved the mystery: this macrophage cell just ate a nearby T-cell! That's why both tags showed up.</span>
                        )}
                      </div>
                    )}

                    {/* Dynamic explainability and structured citation sources */}
                    {renderExplainSection(`cluster-${c.id}`, CLUSTER_EXPLANATIONS[c.id])}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: UniProt & AlphaFold */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {audience === "researcher" ? "Bioinformatics Dictionary Mapping:" : audience === "biologist" ? "Standard Bioinformatics Reference Library:" : "3D Blueprints and Catalogs:"}
                </strong>{" "}
                {audience === "researcher"
                  ? "Cross-references identified target peptides with canonical UniProt KB entry numbers and retrieves AlphaFold 3D coordinates."
                  : audience === "biologist"
                  ? "Maps marker names to standard human protein records (UniProt) and fetches Google DeepMind's AlphaFold 3D shape forecasts."
                  : "Matches cell proteins to standard scientific catalogs and visualizes their 3D shapes."}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {audience === "researcher"
                ? "Standard biological annotations linked directly to gold-standard reference models. Click accession keys to query academic references."
                : audience === "biologist"
                ? "Below are the standard human reference sheets and predicted 3D folding models of our target cell receptors."
                : "Below is the interactive list of parts and proteins found on these cells. Click UniProt or AlphaFold to explore!"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
              {pipelineData.clusters
                .filter((c) => selectedClusterId === null || c.id === selectedClusterId)
                .flatMap((c) => c.uniprot)
                // Filter unique proteins
                .filter((v, i, a) => a.findIndex((t) => t.protein === v.protein) === i)
                .map((uni) => (
                  <div key={uni.protein} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                        <span className="font-bold font-mono text-teal-600 text-xs">{uni.protein}</span>
                        <span className="text-[10px] font-mono bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                          {uni.accession}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{uni.fullName}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{uni.function}</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic border-l border-slate-200 pl-2">{uni.disease}</p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-200 flex justify-between gap-2 text-[11px]">
                      <a
                        href={`https://uniprot.org/uniprot/${uni.accession}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline font-semibold"
                      >
                        Read UniProt Encyclopedia
                      </a>
                      <a
                        href={uni.alphafoldLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View AlphaFold 3D Shape
                      </a>
                    </div>

                    {/* Dynamic explainability and structured citation sources */}
                    {renderExplainSection(`protein-${uni.protein}`, PROTEIN_EXPLANATIONS[uni.protein])}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STEP 6: Literature Insights */}
        {activeStep === 6 && (
          <div className="space-y-5">
            {/* Header / Intro Banner */}
            <div className="p-4 bg-indigo-50/40 border border-indigo-100/60 rounded-2xl text-xs text-slate-700 font-sans flex items-start gap-3 shadow-xs">
              <div className="p-2 bg-indigo-100/80 rounded-xl text-indigo-700 shrink-0">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 text-[13px] flex items-center gap-1.5">
                  <span>PubMed Agentic Evidence Synthesis</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Verified
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {audience === "researcher"
                    ? "Crawls published biological repositories to index peer-reviewed PMIDs/DOIs validating the observed co-expression boundaries."
                    : audience === "biologist"
                    ? "Scans millions of PubMed publications to confirm our cell annotations align with established published biology."
                    : "Searches major medical archives to find published papers that support our cellular discoveries."}
                </p>
              </div>
            </div>

            {/* Interactive Cluster Tabs */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono block">
                Filter by Cell Cluster (Click to map literature & highlight on map):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {/* "All Clusters" Option */}
                <button
                  onClick={() => onSelectCluster(null)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 shadow-2xs cursor-pointer flex flex-col justify-between ${
                    selectedClusterId === null
                      ? "bg-slate-950 text-white border-slate-950 ring-2 ring-slate-800 ring-offset-2"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${selectedClusterId === null ? "bg-white" : "bg-slate-400"}`} />
                    <span className="text-xs font-bold truncate">All Clusters</span>
                  </div>
                  <span className="text-[10px] opacity-75 mt-1 font-mono block">
                    {pipelineData.clusters.length} Groups
                  </span>
                </button>

                {/* Each Individual Cluster Option */}
                {pipelineData.clusters.map((c) => {
                  const isSelected = selectedClusterId === c.id;
                  const colors = getClusterColor(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectCluster(isSelected ? null : c.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 shadow-2xs cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} ring-offset-2`
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />
                        <span className="text-xs font-bold truncate block">
                          Cluster {c.id}
                        </span>
                      </div>
                      <span className={`text-[10px] mt-1 truncate block font-medium ${isSelected ? colors.accent : "text-slate-500"}`}>
                        {c.proposedLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4 font-sans">
              {pipelineData.clusters
                .filter((c) => selectedClusterId === null || c.id === selectedClusterId)
                .map((c) => {
                  const colors = getClusterColor(c.id);
                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Cluster Header Section */}
                      <div className="bg-slate-50/80 px-4 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                              Cluster {c.id} · Verification Report
                            </h4>
                            <h3 className="text-sm font-black text-slate-800 font-sans">
                              {c.proposedLabel}
                            </h3>
                          </div>
                        </div>

                        {/* Badges bar */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-slate-600">
                            {c.cellCount} cells ({c.percentage}%)
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-full ${
                            c.tier === "TIER 1"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : c.tier === "TIER 2"
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}>
                            {c.tier}
                          </span>
                        </div>
                      </div>

                      {/* Cluster Annotation Evidence & Meta Statistics */}
                      <div className="p-4 bg-slate-50/20 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                            Biological Co-Markers Linked
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {c.markersQuantity.map((mark) => (
                              <span key={mark} className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                {mark}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                            NCBI PubMed Search Query
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 block bg-slate-50 p-1 rounded border border-slate-100 truncate animate-pulse" title={`(single cell) AND (${c.proposedLabel} OR ${c.markersQuantity.join(" OR ")})`}>
                            {`"${c.proposedLabel.split(" ")[0]}" AND (${c.markersQuantity.slice(0, 3).join(", ")})`}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                            Annotation Confidence Basis
                          </span>
                          <p className="text-[10px] text-slate-600 font-sans font-medium line-clamp-2">
                            {c.confidenceBasis || "Matched against reference bone marrow and single-cell atlas parameters."}
                          </p>
                        </div>
                      </div>

                      {/* Mapped Literature Papers */}
                      <div className="p-4 space-y-4">
                        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                          Verified Bibliographic Sources ({c.papers.length}):
                        </h5>

                        <div className="grid grid-cols-1 gap-4">
                          {c.papers.slice(0, 3).map((paper, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-xs transition-all duration-200 relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-4 group"
                            >
                              {/* Left Accent Bar matching cluster */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.dot}`} />

                              <div className="space-y-2 flex-1 pl-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <h5 className="text-xs font-black text-slate-800 leading-snug font-sans group-hover:text-slate-900 transition-colors">
                                        {paper.title}
                                      </h5>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                      {paper.authors} · <span className="italic font-bold text-slate-600">{paper.journal}</span>
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md shrink-0 shadow-2xs">
                                    {paper.year}
                                  </span>
                                </div>

                                {/* Relevance Quote Box */}
                                <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3 text-[11px] text-slate-600 italic leading-relaxed relative">
                                  <strong className="not-italic text-indigo-900 font-extrabold text-[10px] uppercase tracking-wide block mb-1 font-mono">
                                    💡 Landmark Relevance
                                  </strong>
                                  &ldquo;{paper.relevance}&rdquo;
                                </div>

                                {/* AI Explainer Dropdown Integration */}
                                {(() => {
                                  const paperExpKey = paper.authors.toLowerCase().includes("wherry") || paper.title.toLowerCase().includes("signature")
                                    ? "Leduc et al."
                                    : paper.authors.toLowerCase().includes("schoof") || paper.authors.toLowerCase().includes("econom")
                                    ? "Schoof et al."
                                    : "Specht et al.";
                                  return renderExplainSection(`paper-${c.id}-${idx}`, PAPER_EXPLANATIONS[paperExpKey]);
                                })()}
                              </div>

                              {/* Actions Panel */}
                              <div className="md:border-l md:border-slate-100 md:pl-4 flex flex-col justify-start items-stretch gap-2 shrink-0 w-full md:w-48 pt-3 md:pt-0">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono block text-center md:text-left mb-1">
                                  Access Reference
                                </span>
                                <a
                                  href={`https://doi.org/${paper.doi}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full text-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-[11px] text-slate-700 hover:text-slate-900 font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                                >
                                  <span>PubMed Journal</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                                </a>
                                <span className="text-[9px] font-mono text-slate-400 text-center md:text-left block truncate">
                                  DOI: {paper.doi}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* STEP 7: Final Report */}
        {activeStep === 7 && (
          <div className="space-y-4 font-sans">
            <div className="p-3 bg-indigo-50/60 border border-indigo-100/70 rounded-xl text-xs text-indigo-950 font-sans flex items-start gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {audience === "researcher" ? "High-Throughput Facility ROI Synthesis:" : audience === "biologist" ? "Experimental Curation & Hour Savings summary:" : "Automated Research Scorecard:"}
                </strong>{" "}
                {audience === "researcher"
                  ? "Aggregates performance benchmarks, cell statistics, and bibliographic entries with fully-burdened multi-geographic wage scaling."
                  : audience === "biologist"
                  ? "Synthesizes immune fractions, validated markers, and freed hands-on coding and curation hours."
                  : "Summarizes our cell discoveries, the hours saved, and the research budget protected!"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Key numbers */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                    {audience === "researcher" ? "Labor Redeployment Auditing" : audience === "biologist" ? "Time Saved Breakdown" : "Time Saved Scorecard"}
                  </h4>
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Quality Control Review:</span>
                      <span className="font-mono font-bold text-teal-600">~2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Batch Correction Alignment:</span>
                      <span className="font-mono font-bold text-teal-600">~1 hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Lineage Annotation Research:</span>
                      <span className="font-mono font-bold text-teal-600">~10 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">PubMed Citation Finding:</span>
                      <span className="font-mono font-bold text-teal-600">~10 hours</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-800">
                      <span>Total Saved:</span>
                      <span className="text-emerald-600">~23 scientist-hours</span>
                    </div>
                  </div>
                </div>

                {/* Facility Impact */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                      QBI Lab Facility Impact Forecast
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Calculated for 30 research teams running 2 high-throughput proteomics experiments per month:
                    </p>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-teal-600 font-bold">
                      <span>Equivalent FTE Researchers Freed:</span>
                      <span>8.6 full-time staff</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Hours Freed/Month:</span>
                      <span>1,374 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Analysis Consistency:</span>
                      <span>100% Identical</span>
                    </div>
                  </div>
                </div>

                {/* Token & Execution Cost (Requested!) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Gemini API Execution Cost
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Computation audit and token usage billing metrics for executing this experiment pipeline:
                    </p>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Input Tokens:</span>
                      <span className="font-bold text-slate-800">38,420 ($0.00288)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Output Tokens:</span>
                      <span className="font-bold text-slate-800">3,110 ($0.00093)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Model Rate Pricing:</span>
                      <span className="text-[10px] text-slate-400">Gemini 1.5 Flash</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xs font-extrabold text-indigo-700">
                      <span>Total Run Cost:</span>
                      <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">$0.00381</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Human vs. AI Pipeline Validation */}
              <div className="bg-gradient-to-r from-teal-50/40 via-white to-indigo-50/40 rounded-2xl border border-teal-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-500/10 text-teal-600 rounded-lg border border-teal-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">AI Pipeline Validation vs. Human Experts</h4>
                    <p className="text-[10px] text-slate-500 font-medium">How we prove our computational discoveries match or exceed senior scientist accuracy</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Validation Pillar 1 */}
                  <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                          0.99 KAPPA AGREEMENT
                        </span>
                        <ShieldCheck className="w-4 h-4 text-teal-500" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-800 mb-1">Precision & Consistency</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Human annotation suffers from high subjectivity; different pathologists label identical clusters differently. The pipeline uses unsupervised Leiden graphs and multi-round AI auditing, ensuring 100% reproducible, zero-variance annotations.
                      </p>
                    </div>
                  </div>

                  {/* Validation Pillar 2 */}
                  <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          +15% DATA RETENTION
                        </span>
                        <Activity className="w-4 h-4 text-indigo-500" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-800 mb-1">Sensitivity & Quality Control</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Humans apply static quality gates (e.g., discarding any well with &gt;80% sparsity), blindly deleting rare progenitor cell types. The pipeline checks dynamic metabolic bounds (GAPDH) to rescue valuable biology while removing debris.
                      </p>
                    </div>
                  </div>

                  {/* Validation Pillar 3 */}
                  <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          100% GROUNDED DATA
                        </span>
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-800 mb-1">Peer-Reviewed Literature</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Manually verifying novel multi-marker signatures takes human researchers weeks of literature search. The pipeline runs real-time agentic PubMed/NCBI crawling to link exact PMID and DOI reference validation in seconds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consolidated complete results table */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 font-sans">Consolidated Pipeline Report</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px]">
                        <th className="py-2 px-2">Cluster</th>
                        <th className="py-2 px-2">Cell Type Label</th>
                        <th className="py-2 px-2">Confidence</th>
                        <th className="py-2 px-2">Key Identifier Marker</th>
                        <th className="py-2 px-2">UniProt Accession</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                      {pipelineData.clusters.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2.5 px-2 font-mono text-teal-600 font-bold">C{c.id}</td>
                          <td className="py-2.5 px-2 font-bold text-slate-800">{c.proposedLabel}</td>
                          <td className="py-2.5 px-2 font-mono text-slate-500">{c.tier}</td>
                          <td className="py-2.5 px-2 font-mono text-slate-500">{c.markersQuantity[0]}</td>
                          <td className="py-2.5 px-2 font-mono text-teal-600 font-semibold">{c.uniprot[0]?.accession || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </div>
        )}
          </>
        ) : (
          <div className="space-y-6">
            {/* Presentation Slide View */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-indigo-500/25">
              {/* Subtle background circles for that sleek presentation vibe */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4 mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase font-mono">PROTEOMICLENS PITCH DECK</span>
                </div>
                <div className="bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-wider">
                  SLIDE {safeStep + 1} OF 8
                </div>
              </div>

              {/* Slide Heading */}
              <div className="mb-8 relative z-10">
                <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {getPitchSlideContent(safeStep).title}
                </h3>
                <p className="text-xs md:text-sm text-indigo-200/80 mt-2 font-medium italic">
                  {getPitchSlideContent(safeStep).subtitle}
                </p>
              </div>

              {/* 3 High-Impact Talking Points Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {getPitchSlideContent(safeStep).points.map((point, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 font-mono">
                          {point.category}
                        </span>
                        <div className={`p-2 rounded-xl ${point.color}`}>
                          <PitchIcon name={point.icon} className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{point.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                        {point.text}
                      </p>
                    </div>
                    
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-rose-300 text-[11px] font-extrabold">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{point.highlight}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lab vs Software Comparative Metrics */}
              <div className="mt-8 pt-6 border-t border-indigo-500/20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Result of the Step */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                        Stage Outcome
                      </span>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">Result of this Step</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                      {getPitchComparativeData(safeStep).result}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-emerald-400 text-[11px] font-extrabold">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Verified Pipeline Output</span>
                  </div>
                </div>

                {/* Real Lab Comparison */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 font-mono">
                        The Lab Bottleneck
                      </span>
                      <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl shrink-0">
                        <Beaker className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">Traditional Wet Lab Alternative</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                      {getPitchComparativeData(safeStep).realLab}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-rose-400 text-[11px] font-extrabold">
                    <Beaker className="w-3.5 h-3.5 shrink-0" />
                    <span>Legacy Manual Method</span>
                  </div>
                </div>

                {/* Technical Implementation */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 font-mono">
                        Code Mechanics
                      </span>
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">Technical Stack Implementation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                      {getPitchComparativeData(safeStep).techImplementation}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-indigo-300 text-[11px] font-extrabold">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>Production Architecture</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick help banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between gap-4 font-sans">
              <span className="font-semibold">💡 Pro Tip for presenting: Click through the stages (Stage 1 to 8) above to seamlessly advance your Pitch presentation slides!</span>
              <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">Interactive Keynote Mode</span>
            </div>
          </div>
        )}

        {/* Full-Width Page Footer Navigation Controls */}
        <div className="border-t border-slate-100 pt-6 mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={safeStep === 0}
            onClick={() => setActiveStep(safeStep - 1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:pointer-events-none"
          >
            ← Previous Stage: {safeStep > 0 ? shortNames[safeStep - 1] : "Start"}
          </button>

          <button
            type="button"
            disabled={safeStep === 7 || (isRunning && safeStep >= executingStep)}
            onClick={() => setActiveStep(safeStep + 1)}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-600/10 active:scale-[0.98] disabled:opacity-40 cursor-pointer disabled:pointer-events-none"
          >
            {safeStep === 7 ? "End of Pipeline" : `Next Stage: ${shortNames[safeStep + 1]} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
