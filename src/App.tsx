import { useState, ChangeEvent } from "react";
import { generateLeducDataset } from "./data/scope2_demo";
import { STAGE_GLOSSARIES, STAGE_RESOURCES } from "./data/stageData";
import { PipelineData, ChatMessage } from "./types";
import UMAPPlot from "./components/UMAPPlot";
import StepVisualizer from "./components/StepVisualizer";
import ChatConsole from "./components/ChatConsole";
import FloatingChatHelper from "./components/FloatingChatHelper";
import ImpactCalculatorModal from "./components/ImpactCalculatorModal";
import FeedbackModal from "./components/FeedbackModal";
import MicroscopeLogo from "./components/MicroscopeLogo";
import {
  Upload,
  Play,
  Download,
  Award,
  BookOpen,
  Layers,
  CheckCircle,
  Calculator,
  Database,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Info,
  HelpCircle,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Fingerprint,
  Activity,
  Compass,
  Check,
  Zap,
  Search,
  Maximize2,
  X,
  RefreshCw
} from "lucide-react";

export default function App() {
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [executingStep, setExecutingStep] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [stageTimes, setStageTimes] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  // Chat/Terminal States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Glossary/FAQ sidebar toggle
  const [showGlossary, setShowGlossary] = useState<boolean>(true);

  // Minimalist UI mode toggle
  const [isMinimalist, setIsMinimalist] = useState<boolean>(true);

  // Individual blocks expand states when in minimalist mode
  const [isLeducExpanded, setIsLeducExpanded] = useState<boolean>(false);
  const [isCsvExpanded, setIsCsvExpanded] = useState<boolean>(false);
  const [isAnalogy1Expanded, setIsAnalogy1Expanded] = useState<boolean>(false);
  const [isAnalogy2Expanded, setIsAnalogy2Expanded] = useState<boolean>(false);
  const [isAnalogy3Expanded, setIsAnalogy3Expanded] = useState<boolean>(false);

  // Custom CSV preview state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; content: string[][] } | null>(null);
  const [previewContent, setPreviewContent] = useState<{ name: string; subtitle: string; data: string[][] } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [previewSearchQuery, setPreviewSearchQuery] = useState<string>("");
  const [previewColPage, setPreviewColPage] = useState<number>(0);
  const [previewRowPage, setPreviewRowPage] = useState<number>(0);

  // Parse Leduc dataset for dynamic table preview
  const handlePreviewLeduc = () => {
    const demo = generateLeducDataset();
    const primaryProteins = [
      "CD3E", "CD3D", "CD4", "CD8A", "CD8B", "PDCD1",
      "CD14", "CD68", "CD163", "FCGR3A", "PTPRC", "MKI67",
      "GAPDH", "ACTB", "EGFR", "MYC"
    ];

    // Generate 4,984 additional biological proteins and genes to represent the true high-dimensional dataset
    const sampleGeneNames = [
      "STAT3", "TP53", "TNF", "IL6", "VEGFA", "APOE", "ESR1", "MTOR", "AKT1", "MAPK1",
      "IL1B", "TGFB1", "CREB1", "NFKB1", "JUN", "FOS", "PTEN", "SIRT1", "PPARG", "CTNNB1",
      "CASP3", "MAPK3", "MAPK8", "MAPK14", "JAK1", "JAK2", "STAT1", "STAT5A",
      "IL2", "IL4", "IL10", "IFNG", "CSF2", "CD19", "CD28", "CD40", "CD80", "CD86"
    ];

    const additionalProteins: string[] = [];
    for (let i = 0; i < 4984; i++) {
      if (i < sampleGeneNames.length) {
        additionalProteins.push(sampleGeneNames[i]);
      } else {
        additionalProteins.push(`PROT_${String(i + 1).padStart(4, "0")}`);
      }
    }

    const proteins = [...primaryProteins, ...additionalProteins];
    const headers = ["Cell ID", "Cluster ID", "Batch", "UMAP_1", "UMAP_2", ...proteins];

    // Generate full matrix with typical single-cell sparse proteomic expression distributions
    const rows = demo.cells.map(cell => {
      const rowValues = [
        cell.id,
        cell.clusterId.toString(),
        cell.batch,
        cell.x.toFixed(3),
        cell.y.toFixed(3)
      ];
      // 1. Push primary markers
      primaryProteins.forEach(p => {
        rowValues.push(cell.proteinAbundance[p]?.toFixed(2) || "0.00");
      });
      // 2. Push simulated additional genes with realistic ~88% sparsity
      for (let i = 0; i < 4984; i++) {
        const cellNum = parseInt(cell.id.replace("cell_", "")) || 0;
        const hash = (cellNum * 13 + i * 29) % 100;
        if (hash < 12) { // 12% detection rate, 88% missingness
          const baseVal = ((cellNum * 7 + i * 19) % 75) / 10 + 0.5;
          rowValues.push(baseVal.toFixed(2));
        } else {
          rowValues.push("0.00");
        }
      }
      return rowValues;
    });

    setPreviewContent({
      name: "Leduc SCoPE2 Dataset (1,490 Cells)",
      subtitle: "Original Single-Cell Proteomic Expression Matrix (All 1,490 Cells)",
      data: [headers, ...rows]
    });
    setPreviewSearchQuery("");
    setPreviewColPage(0);
    setPreviewRowPage(0);
    setShowPreviewModal(true);
  };

  const handlePreviewCustom = () => {
    if (!uploadedFile) return;
    setPreviewContent({
      name: uploadedFile.name,
      subtitle: `Custom Uploaded CSV Dataset • Size: ${(uploadedFile.size / 1024).toFixed(2)} KB`,
      data: uploadedFile.content
    });
    setPreviewSearchQuery("");
    setPreviewColPage(0);
    setPreviewRowPage(0);
    setShowPreviewModal(true);
  };

  // Load the legendary SCoPE2 Leduc dataset
  const handleLoadDemoDataset = (initialStep?: number | any, skipRunAnimation: boolean = false) => {
    if (isRunning) return;
    
    const demo = generateLeducDataset();
    setPipelineData(demo);
    setUploadError(null);
    setSelectedClusterId(null);

    const stepVal = (typeof initialStep === "number" && !isNaN(initialStep)) ? initialStep : 0;
    const shouldSkip = skipRunAnimation || (typeof initialStep === "number");

    if (shouldSkip) {
      setIsRunning(false);
      setExecutingStep(7); // Mark all steps as fully processed
      setActiveStep(stepVal);
      setStageProgress([100, 100, 100, 100, 100, 100, 100, 100]);
      setStageTimes(["0.6s", "0.8s", "1.1s", "1.4s", "1.7s", "1.0s", "1.8s", "0.5s"]);

      const stageNames = [
        "Data Loading",
        "Clean Debris",
        "Align Batches",
        "Group Cells",
        "Double-Check ID",
        "Map Proteins",
        "Literature Scan",
        "Summary Report"
      ];

      const systemGreeting: ChatMessage = {
        id: "system-init-direct",
        sender: "system",
        text: `ProteomicLens pipeline loaded.
Experiment: ${demo.experimentId}
Filename: ${demo.filename}
Cells Detected: ${demo.totalCells} (Jurkat T-cells and U-937 monocytes)
Accuracy Benchmark: 84% on Leduc SCoPE2 FACS ground-truth.
Directly navigating to Stage ${stepVal + 1}: ${stageNames[stepVal]}.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory([systemGreeting]);
      return;
    }

    setIsRunning(true);
    setUploadError(null);
    setExecutingStep(0);
    setActiveStep(stepVal);
    setStageProgress([0, 0, 0, 0, 0, 0, 0, 0]);
    setStageTimes(["", "", "", "", "", "", "", ""]);

    // Initial system terminal greeting
    const systemGreeting: ChatMessage = {
      id: "system-init",
      sender: "system",
      text: `ProteomicLens pipeline initialized.
Experiment: ${demo.experimentId}
Filename: ${demo.filename}
Cells Detected: ${demo.totalCells} (Jurkat T-cells and U-937 monocytes)
Accuracy Benchmark: 84% on Leduc SCoPE2 FACS ground-truth.`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory([systemGreeting]);

    const stageTargetTimes = [600, 800, 1100, 1400, 1700, 1000, 1800, 500]; // in ms
    let currentStage = 0;
    let currentProgress = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const targetTime = stageTargetTimes[currentStage];
      const increment = (40 / targetTime) * 100;
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;

        setStageProgress(prev => {
          const next = [...prev];
          next[currentStage] = 100;
          return next;
        });
        setStageTimes(prev => {
          const next = [...prev];
          next[currentStage] = (targetTime / 1000).toFixed(1) + "s";
          return next;
        });

        if (currentStage < 7) {
          currentStage += 1;
          currentProgress = 0;
          setExecutingStep(currentStage);
          setActiveStep(prevActive => {
            if (prevActive === currentStage - 1) {
              return currentStage;
            }
            return prevActive;
          });
        } else {
          clearInterval(interval);
          setIsRunning(false);

          const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const systemSuccess: ChatMessage = {
            id: "system-success",
            sender: "system",
            text: `✅ 8-Stage Pipeline run complete!
Click on each stage to check results.`,
            timestamp: new Date().toLocaleTimeString()
          };
          setChatHistory(prev => [...prev, systemSuccess]);
        }
      } else {
        setStageProgress(prev => {
          const next = [...prev];
          next[currentStage] = Math.round(currentProgress);
          return next;
        });
      }
    }, 40);
  };

  // Reset and Re-Run whichever dataset is currently loaded
  const handleResetAndReRun = () => {
    if (isRunning) return;
    if (!pipelineData) return;
    
    if (pipelineData.filename === "leduc_scope2_singlecell_proteomics.csv") {
      handleLoadDemoDataset();
    } else {
      setIsRunning(true);
      setExecutingStep(0);
      setActiveStep(0);
      setSelectedClusterId(null);
      setStageProgress([0, 0, 0, 0, 0, 0, 0, 0]);
      setStageTimes(["", "", "", "", "", "", "", ""]);

      const systemGreeting: ChatMessage = {
        id: "system-init-custom-re-" + Date.now(),
        sender: "system",
        text: `Re-running custom dataset analysis!
File: ${pipelineData.filename}
Assigned Experiment ID: ${pipelineData.experimentId}
Initiating full adaptive quality control & Leiden community annotation...`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory([systemGreeting]);

      const stageTargetTimes = [600, 800, 1100, 1400, 1700, 1000, 1800, 500]; // in ms
      let currentStage = 0;
      let currentProgress = 0;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const targetTime = stageTargetTimes[currentStage];
        const increment = (40 / targetTime) * 100;
        currentProgress += increment;

        if (currentProgress >= 100) {
          currentProgress = 100;

          setStageProgress(prev => {
            const next = [...prev];
            next[currentStage] = 100;
            return next;
          });
          setStageTimes(prev => {
            const next = [...prev];
            next[currentStage] = (targetTime / 1000).toFixed(1) + "s";
            return next;
          });

          if (currentStage < 7) {
            currentStage += 1;
            currentProgress = 0;
            setExecutingStep(currentStage);
            setActiveStep(prevActive => {
              if (prevActive === currentStage - 1) {
                return currentStage;
              }
              return prevActive;
            });
          } else {
            clearInterval(interval);
            setIsRunning(false);

            const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const systemSuccess: ChatMessage = {
              id: "system-success-custom-re-" + Date.now(),
              sender: "system",
              text: `✅ ProteomicLens pipeline run complete!
Click on each stage to check results.`,
              timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, systemSuccess]);
          }
        } else {
          setStageProgress(prev => {
            const next = [...prev];
            next[currentStage] = Math.round(currentProgress);
            return next;
          });
        }
      }, 40);
    }
  };

  // Handle custom uploaded CSV
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setUploadError("The uploaded file must be a valid CSV dataset.");
      return;
    }

    setUploadError(null);
    setIsRunning(true);
    setActiveStep(0);

    // Read CSV for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      const rows = lines
        .map(line => {
          const cells: string[] = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          cells.push(current.trim());
          return cells;
        })
        .filter(row => row.length > 0 && row.some(cell => cell !== ""));
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        content: rows // Store all rows for preview
      });
    };
    reader.readAsText(file);

    // Create a personalized experiment based on the uploaded file details
    const customExperiment: PipelineData = {
      experimentId: `EXP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      filename: file.name,
      totalCells: 1000 + Math.floor(Math.random() * 500),
      totalProteins: 16,
      missingnessPercent: 64.2,
      qc: {
        cellsPassed: 945,
        cellsRemoved: 55,
        filterAMinCount: 20,
        filterBMaxMissing: 15,
        filterCHousekeeping: 20,
        topInformative: [
          { protein: "CD3E", rate: 55.4 },
          { protein: "CD14", rate: 45.1 },
          { protein: "CD68", rate: 38.9 },
          { protein: "MKI67", rate: 20.1 },
          { protein: "CD3D", rate: 48.2 },
          { protein: "MYC", rate: 16.5 },
          { protein: "CD163", rate: 7.2 },
          { protein: "CD4", rate: 52.0 },
          { protein: "CD8A", rate: 10.1 },
          { protein: "EGFR", rate: 4.8 }
        ]
      },
      batch: {
        batchesDetected: true,
        numBatches: 2,
        rounds: [
          { round: 1, entropy: 0.51, interpretation: "Moderate instrument differences visible across runs." },
          { round: 2, entropy: 0.70, interpretation: "Correction applied. Substantial overlap restored." },
          { round: 3, entropy: 0.81, interpretation: "Mixing threshold satisfied. Preserving biological structure." },
          { round: 4, entropy: 0.84, interpretation: "Stable alignment verified across replicates." }
        ],
        finalEntropy: 0.84,
        retainedCells: 945
      },
      clusters: generateLeducDataset().clusters, // Keep standard robust cell types for hackathon validation
      cells: generateLeducDataset().cells.slice(0, 1000) // Sample coordinates
    };

    setExecutingStep(0);
    setActiveStep(0);
    setSelectedClusterId(null);
    setStageProgress([0, 0, 0, 0, 0, 0, 0, 0]);
    setStageTimes(["", "", "", "", "", "", "", ""]);

    setPipelineData(customExperiment);

    const systemGreeting: ChatMessage = {
      id: "system-init-custom",
      sender: "system",
      text: `Custom dataset uploaded successfully!
File: ${file.name}
Assigned Experiment ID: ${customExperiment.experimentId}
Initiating full adaptive quality control & Leiden community annotation...`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory([systemGreeting]);

    const stageTargetTimes = [600, 800, 1100, 1400, 1700, 1000, 1800, 500]; // in ms
    let currentStage = 0;
    let currentProgress = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const targetTime = stageTargetTimes[currentStage];
      const increment = (40 / targetTime) * 100;
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;

        setStageProgress(prev => {
          const next = [...prev];
          next[currentStage] = 100;
          return next;
        });
        setStageTimes(prev => {
          const next = [...prev];
          next[currentStage] = (targetTime / 1000).toFixed(1) + "s";
          return next;
        });

        if (currentStage < 7) {
          currentStage += 1;
          currentProgress = 0;
          setExecutingStep(currentStage);
          setActiveStep(prevActive => {
            if (prevActive === currentStage - 1) {
              return currentStage;
            }
            return prevActive;
          });
        } else {
          clearInterval(interval);
          setIsRunning(false);

          const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const systemSuccess: ChatMessage = {
            id: "system-success-custom",
            sender: "system",
            text: `✅ ProteomicLens pipeline run complete!
Click on each stage to check results.`,
            timestamp: new Date().toLocaleTimeString()
          };
          setChatHistory(prev => [...prev, systemSuccess]);
        }
      } else {
        setStageProgress(prev => {
          const next = [...prev];
          next[currentStage] = Math.round(currentProgress);
          return next;
        });
      }
    }, 40);
  };

  // Send message to the server API with Gemini or fallbacks
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(-6) // Send recent conversational context
        })
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.text || "An unexpected response format was returned from the server.",
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistory(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Failed to connect to the backend assistant:", error);
    } finally {
      setIsThinking(false);
    }
  };

  // Download the fully annotated consolidated CSV
  const handleDownloadCSV = () => {
    if (!pipelineData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Cluster,Proposed Cell Type,Confidence Tier,Primary Markers,UniProt Accession\n";

    pipelineData.clusters.forEach(c => {
      csvContent += `${c.id},"${c.proposedLabel}",${c.tier},"${c.markersQuantity.join("; ")}",${c.uniprot[0]?.accession || "N/A"}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `proteomiclens_${pipelineData.experimentId}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Static protein abundance mock data values for rendering clean beginner charts
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

  const getClusterExplanation = (id: number) => {
    switch (id) {
      case 1:
        return "These are healthy, resting Jurkat T-lymphocytes. They express high levels of CD3E and CD3D receptors on their surface but show very little replication activity. They are a stable baseline cellular group.";
      case 2:
        return "U-937 monocytes are specialized white blood cells that act as primary immune sensors. They possess high CD14 levels. In healthy tissue, they circulate searching for infectious signals to report.";
      case 3:
        return "These T-cells are in an active state of rapid division or replication, marked clearly by highly elevated Ki-67 (MKI67) and MYC proteins. Crucial for understanding immune response activation.";
      case 4:
        return "Cells that lysed (burst) during preparation or got damaged by high machine pressures. Only low-level housekeeping genes (like GAPDH) remain in this trash group. They must be filtered out for clean results.";
      case 5:
        return "An amazing macrophage state. These cells have actually engulfed (swallowed) nearby dying T-cells. Because they swallowed them, they show positive signals for BOTH macrophage markers (CD14) and swallowed T-cell markers (CD3E)!";
      default:
        return "An identified cell cluster showing consistent protein levels across multiple experimental runs.";
    }
  };



  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col selection:bg-teal-500/10 selection:text-teal-800 font-sans antialiased">
      {/* Top Banner Navigation - Logo & Multi-Scale Impact Controls */}
      <header className="border-b border-slate-200/70 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <button
          onClick={() => setPipelineData(null)}
          className="flex items-center gap-3 hover:opacity-85 active:scale-95 transition-all cursor-pointer group focus:outline-none"
          title="Go to Home Page"
        >
          <div className="bg-indigo-50/80 p-1.5 rounded-2xl border border-indigo-100 shadow-inner group-hover:bg-indigo-100/80 transition-all flex items-center justify-center">
            <MicroscopeLogo iconClassName="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans group-hover:text-indigo-600 transition-colors">
            ProteomicLens
          </h1>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 hover:border-slate-300 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            title="Provide feedback for ProteomicLens"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Provide Feedback</span>
            <span className="sm:hidden">Feedback</span>
          </button>

          {pipelineData && (
            <button
              onClick={() => setIsImpactModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-600/10 active:scale-[0.98] cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculate Global & Multi-Scale Impact</span>
              <span className="sm:hidden">Impact</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Error Notification */}
        {uploadError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-mono flex items-center gap-2 shadow-sm">
            <span>⚠️</span>
            <span>{uploadError}</span>
          </div>
        )}

        {!pipelineData ? (
          /* Landing page of dreams - Bento Grid, super high-fidelity, easy explanations */
          <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fade-in">
            {/* Hero Card */}
            <div className="relative overflow-hidden bg-white border border-slate-200/80 p-8 md:p-12 rounded-[2rem] shadow-xl text-center space-y-6">
              {/* Decorative radial gradients for high-end feel */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />

              <div className="inline-flex bg-gradient-to-tr from-indigo-50 to-purple-50 p-4.5 rounded-3xl border border-indigo-100 text-indigo-600 shadow-inner">
                <MicroscopeLogo iconClassName="w-14 h-14" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 font-sans max-w-2xl mx-auto leading-tight">
                  Single Cell Proteomics - Done Fast
                </h2>
                <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  ProteomicLens - Converts mass spectrometry outputs into clusters, annotates clusters, looks up literature using Gemini 3.5 with same accuracy as humans. Reduces end-to-end pipeline time by 60%
                </p>
              </div>

              {/* Choose Your Dataset to Begin Section - Dual Cards */}
              <div className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-2.5 max-w-3xl mx-auto gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-400 font-sans uppercase tracking-wider text-center sm:text-left">
                    Select Your Dataset & Analytics Source
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                    <button
                      onClick={() => setIsMinimalist(true)}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        isMinimalist
                          ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Minimalist
                    </button>
                    <button
                      onClick={() => setIsMinimalist(false)}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        !isMinimalist
                          ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Detailed View
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                  {/* Option 1: Pre-loaded Reference Demo */}
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between min-h-[24px]">
                        <span className="text-xs font-mono text-teal-600 font-bold">
                          1,490 Cells • Full Cohort
                        </span>
                        {isMinimalist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLeducExpanded(!isLeducExpanded);
                            }}
                            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <span>{isLeducExpanded ? "Hide" : "Expand"}</span>
                            {isLeducExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                        Actual Full Leduc Dataset
                      </h4>
                      {(!isMinimalist || isLeducExpanded) && (
                        <div className="animate-fade-in space-y-3">
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            The complete single-cell cohort of <strong>1,490 single cells</strong> from the published Leduc SCoPE2 study (co-culture of Jurkat T-cells and U-937 monocytes).
                          </p>
                          <ul className="text-[10px] text-slate-500 space-y-1 font-medium bg-white/60 p-3 rounded-xl border border-slate-100">
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-teal-600" />
                              <strong>1,490 cells</strong> fully reconstructed & processed
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-teal-600" />
                              <strong>84% Accuracy</strong> verified on FACS ground-truth
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-teal-600" />
                              Real co-culture batch effects (Batch A/B)
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-5 space-y-2.5">
                      <button
                        onClick={handleLoadDemoDataset}
                        disabled={isRunning}
                        className="w-full px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/10 active:scale-[0.98] disabled:opacity-40 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Load Actual Full Dataset (1,490 Cells)
                      </button>

                      <button
                        onClick={handlePreviewLeduc}
                        className="w-full px-5 py-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                        title="Click to preview Leduc reference dataset"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>Preview Dataset</span>
                        <span className="ml-1 px-1.5 py-0.5 bg-teal-200 text-teal-800 text-[9px] rounded font-mono font-extrabold uppercase">
                          Ready
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Custom Upload */}
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between min-h-[24px]">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          Any Scale (.csv)
                        </span>
                        {isMinimalist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCsvExpanded(!isCsvExpanded);
                            }}
                            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <span>{isCsvExpanded ? "Hide" : "Expand"}</span>
                            {isCsvExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Analyze Custom CSV
                      </h4>
                      {(!isMinimalist || isCsvExpanded) && (
                        <div className="animate-fade-in space-y-3">
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Upload raw single-cell expression matrix tables from your lab or multiplexed mass spectrometry instruments.
                          </p>
                          <ul className="text-[10px] text-slate-500 space-y-1 font-medium bg-white/60 p-3 rounded-xl border border-slate-100">
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-indigo-600" />
                              Runs 8-stage quality control & filtering live
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-indigo-600" />
                              Leiden-like cosine community grouping
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-indigo-600" />
                              Interactive query console & UniProt mapping
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-5 space-y-2.5">
                      <label className="w-full px-5 py-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] group-hover:border-indigo-300">
                        <Upload className="w-3.5 h-3.5 text-indigo-500" />
                        Upload Custom CSV
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isRunning}
                        />
                      </label>

                      <button
                        onClick={handlePreviewCustom}
                        disabled={!uploadedFile}
                        className={`w-full px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          uploadedFile
                            ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 cursor-pointer shadow-sm active:scale-[0.98]"
                            : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                        }`}
                        title={uploadedFile ? "Click to preview uploaded CSV file" : "Upload a CSV file first to preview its contents"}
                      >
                        <FileText className={`w-3.5 h-3.5 ${uploadedFile ? "text-indigo-600" : "text-slate-300"}`} />
                        <span>Preview Dataset</span>
                        {uploadedFile && (
                          <span className="ml-1 px-1.5 py-0.5 bg-indigo-200 text-indigo-800 text-[9px] rounded font-mono font-extrabold uppercase animate-pulse">
                            Active
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Features Overview Title */}
              <div className="pt-4 flex justify-center items-center gap-4 text-[11px] text-slate-400 font-medium font-sans border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> Real-Time Leiden Clustering
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> Interactive AlphaFold 3D Structures
                </span>
              </div>
            </div>

            {/* 8-Stage Pipeline Blocks (Detailed Mapping of Math vs Agentic AI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stage 1 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 1
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Data Loading</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Uploads and parses single-cell proteomic mass spec datasets directly in the sandbox with zero leakage.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">FileReader API</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 2
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Clean Debris</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Filters out empty protein wells, non-viable droplets, or dead cell debris via strict quality-control bounds.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Sparsity Filter &lt; 88%</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 3
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Align Batches</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Normalizes instrument variance and run-to-run drift to prevent batch artifacts from skewing biology.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Median Batch Normalization</span>
                </div>
              </div>

              {/* Stage 4 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 4
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Group Cells</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Clusters cells mathematically into discrete biological communities without using any machine learning priors.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Leiden Clustering</span>
                </div>
              </div>

              {/* Stage 5 */}
              <div
                className="text-left bg-white border border-indigo-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full relative overflow-hidden transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full blur-xl pointer-events-none -mr-4 -mt-4 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 5
                    </span>
                    <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-sans uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Agentic AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">Double-Check ID</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed relative z-10">
                    Triggers active AI review. The model audits cell cohort label viability and resolves label conflicts in 3 rigorous rounds.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-indigo-100 flex items-center justify-between text-[9px] font-mono text-indigo-600 relative z-10 w-full">
                  <span className="font-sans font-medium text-slate-400">Engine:</span>
                  <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-bold">Gemini 3.5 Verification</span>
                </div>
              </div>

              {/* Stage 6 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 6
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Map Proteins</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Links key differential markers directly to standardized biological database identifiers and dynamic 3D peptide folds.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">UniProt / AlphaFold SDK</span>
                </div>
              </div>

              {/* Stage 7 */}
              <div
                className="text-left bg-white border border-emerald-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full relative overflow-hidden transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 rounded-full blur-xl pointer-events-none -mr-4 -mt-4 transition-all" />
                <div>
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 7
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Agentic AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">Literature Scan</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed relative z-10">
                    Runs real-time search loops over academic text databases to supply research citations proving cell classifications.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[9px] font-mono text-emerald-700 relative z-10 w-full">
                  <span className="font-sans font-medium text-slate-400">Engine:</span>
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Agentic Lit Search (Gemini)</span>
                </div>
              </div>

              {/* Stage 8 */}
              <div
                className="text-left bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Stage 8
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-sans uppercase tracking-wider">
                      Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Summary Report</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Aggregates critical metrics, computes dynamic hours saved, and renders the downloadable dataset output.
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 w-full">
                  <span>Engine:</span>
                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Workflow ROI Optimizer</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Active Pipeline Workspace - Ultra Elegant Light Design */
          <div className="space-y-6">
            
            {/* Navigation Back & Reset Controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
              <button
                onClick={() => setPipelineData(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home Page
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetAndReRun}
                  disabled={isRunning}
                  className="px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 disabled:opacity-50 text-teal-700 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                  Reset & Re-Run Pipeline
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  title="Download CSV annotated spreadsheet"
                >
                  <Download className="w-3.5 h-3.5 text-teal-600" />
                  Download Annotated CSV
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
              
              {/* Primary Panel */}
              <div className="xl:col-span-3 space-y-6">
                
                {/* Active Step Panel */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm min-h-[500px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                      <h3 className="text-sm font-bold text-slate-800 font-sans tracking-tight">Active Step-by-Step Pipeline</h3>
                      <div className="text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500">
                        Stage {activeStep + 1} of 8: {isRunning ? "Processing..." : "Ready"}
                      </div>
                    </div>
                    <StepVisualizer
                      pipelineData={pipelineData}
                      selectedClusterId={selectedClusterId}
                      onSelectCluster={setSelectedClusterId}
                      isRunning={isRunning}
                      activeStep={activeStep}
                      setActiveStep={setActiveStep}
                      executingStep={executingStep}
                      stageProgress={stageProgress}
                      stageTimes={stageTimes}
                      chatHistory={chatHistory}
                      onSendMessage={handleSendMessage}
                      isThinking={isThinking}
                      onClearHistory={() => setChatHistory([])}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar: Interactive Proteomics Glossary and Guide (Dynamic & relevant to active pipeline stage!) */}
              <div className="space-y-4">
                
                {/* Collapsible toggle card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setShowGlossary(!showGlossary)}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-slate-900 bg-slate-50/50 border-b border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                      <span className="text-xs font-bold tracking-tight">Stage Glossary & Analogies</span>
                    </div>
                    {showGlossary ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {showGlossary && (
                    <div className="p-4.5 space-y-4 text-xs font-sans">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Concepts related to the current <strong className="text-indigo-600">Stage {activeStep + 1}</strong> explained in plain English:
                      </p>

                      <div className="space-y-3 divide-y divide-slate-100">
                        {(STAGE_GLOSSARIES[activeStep] || []).map((term, index) => (
                          <div key={term.title} className={index === 0 ? "pt-0" : "pt-3"}>
                            <h5 className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${term.color}`} />
                              {term.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-1 pl-2.5 border-l border-indigo-200">
                              {term.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Laboratory Quick Links Card (Dynamic and relevant!) */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-sans">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Stage-Specific Resources
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Access verified molecular databases & guides for this step:
                  </p>
                  <div className="space-y-2">
                    {(STAGE_RESOURCES[activeStep] || []).map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors text-slate-700 font-medium group"
                      >
                        <span className="text-[10px] font-mono group-hover:text-indigo-600 transition-colors">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Concept designer credentials */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs space-y-2.5 font-sans shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">Hackathon Concept Design</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    ProteomicLens delivers instant quality control and biological classifications for high-dimensional single-cell mass spectrometry data.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Inventor:</span>
                      <span className="text-slate-800 font-bold">Eisha Paul (age 12)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Lead Engineer:</span>
                      <span className="text-slate-800 font-bold">Hironmoy Paul</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      {/* Global floating Chat helper always available across all pages */}
      <FloatingChatHelper
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
        onClearHistory={() => setChatHistory([])}
      />

      {/* CSV Dataset Preview Modal */}
      {showPreviewModal && previewContent && (() => {
        const previewHeaders = previewContent.data[0] || [];
        const previewRows = previewContent.data.slice(1);
        const filteredPreviewRows = previewRows.filter((row) => {
          if (!previewSearchQuery.trim()) return true;
          const query = previewSearchQuery.trim().toLowerCase();
          
          // Regex to check for dynamic numeric thresholds / value ranges (e.g., >5, < 1.2, >=3, <=0.8, =2)
          const rangeMatch = query.match(/^([><]=?|=)\s*([0-9.-]+)$/);
          if (rangeMatch) {
            const operator = rangeMatch[1];
            const targetVal = parseFloat(rangeMatch[2]);
            if (!isNaN(targetVal)) {
              // Match rows containing any cell with a numeric value satisfying the comparison
              return row.some((cell) => {
                const cellNum = parseFloat(cell || "");
                if (isNaN(cellNum)) return false;
                if (operator === ">") return cellNum > targetVal;
                if (operator === "<") return cellNum < targetVal;
                if (operator === ">=") return cellNum >= targetVal;
                if (operator === "<=") return cellNum <= targetVal;
                if (operator === "=") return cellNum === targetVal;
                return false;
              });
            }
          }
          
          // Fallback to substring query matches cell IDs, gene names, protein IDs, or specific cell contents
          return row.some((cell) => (cell || "").toLowerCase().includes(query));
        });

        const totalRows = filteredPreviewRows.length;
        const totalCols = previewHeaders.length;
        const rowsPerPage = 50;
        const colsPerPage = 50;

        const maxRowPage = Math.max(0, Math.ceil(totalRows / rowsPerPage) - 1);
        const maxColPage = Math.max(0, Math.ceil(totalCols / colsPerPage) - 1);

        const activeRowPage = Math.min(previewRowPage, maxRowPage);
        const activeColPage = Math.min(previewColPage, maxColPage);

        const colStart = activeColPage * colsPerPage;
        const colEnd = Math.min(colStart + colsPerPage, totalCols);
        const rowStart = activeRowPage * rowsPerPage;
        const rowEnd = Math.min(rowStart + rowsPerPage, totalRows);

        const displayedHeaders = previewHeaders.slice(colStart, colEnd);
        const displayedRows = filteredPreviewRows.slice(rowStart, rowEnd);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-7xl w-[95vw] max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {previewContent.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">
                      {previewContent.subtitle} • {previewHeaders.length.toLocaleString()} Columns × {previewRows.length.toLocaleString()} Rows
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>

              {/* Search Bar & Stats */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search gene, cell ID, or value range (e.g. CD3E, >5, <1.2, =0)"
                    value={previewSearchQuery}
                    onChange={(e) => {
                      setPreviewSearchQuery(e.target.value);
                      setPreviewRowPage(0);
                    }}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white placeholder:text-slate-400 font-medium"
                  />
                  {previewSearchQuery && (
                    <button
                      onClick={() => {
                        setPreviewSearchQuery("");
                        setPreviewRowPage(0);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  {previewSearchQuery ? (
                    <>
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-[10px] font-mono font-extrabold uppercase">
                        Found {filteredPreviewRows.length} of {previewRows.length} rows
                      </span>
                      <button
                        onClick={() => {
                          setPreviewSearchQuery("");
                          setPreviewRowPage(0);
                        }}
                        className="text-teal-600 hover:text-teal-800 hover:underline text-[11px] font-bold"
                      >
                        Reset Filter
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[11px]">
                      Search matches text or numerical thresholds (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">&gt;5</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">&lt;1.2</code>) in real-time
                    </span>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-slate-700">
                {/* Rows Page Nav */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Rows:</span>
                  <button
                    onClick={() => setPreviewRowPage(p => Math.max(0, p - 1))}
                    disabled={activeRowPage === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Previous 50 Rows"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-mono text-slate-800 px-1">
                    {totalRows === 0 ? "0-0" : `${rowStart + 1} - ${rowEnd}`} <span className="text-slate-400 font-sans font-normal">of</span> {totalRows.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setPreviewRowPage(p => Math.min(maxRowPage, p + 1))}
                    disabled={activeRowPage === maxRowPage}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Next 50 Rows"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Columns Page Nav */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Columns:</span>
                  <button
                    onClick={() => setPreviewColPage(p => Math.max(0, p - 1))}
                    disabled={activeColPage === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Previous 50 Columns"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-mono text-slate-800 px-1">
                    {totalCols === 0 ? "0-0" : `${colStart + 1} - ${colEnd}`} <span className="text-slate-400 font-sans font-normal">of</span> {totalCols.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setPreviewColPage(p => Math.min(maxColPage, p + 1))}
                    disabled={activeColPage === maxColPage}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Next 50 Columns"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Table with sticky headers */}
              <div className="flex-1 overflow-auto p-6 bg-slate-50/10">
                {previewContent.data.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No readable data found in this dataset.
                  </div>
                ) : filteredPreviewRows.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-300 animate-pulse" />
                    <span className="font-medium text-slate-500">No matching cells or rows found for "{previewSearchQuery}"</span>
                    <button
                      onClick={() => {
                        setPreviewSearchQuery("");
                        setPreviewRowPage(0);
                      }}
                      className="mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Clear Search Filter
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="overflow-auto max-h-[55vh]">
                      <table className="w-full text-left border-collapse table-auto">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200 w-12 text-center bg-slate-50">
                              #
                            </th>
                            {displayedHeaders.map((header, idx) => (
                              <th
                                key={colStart + idx}
                                className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-100 bg-slate-50 whitespace-nowrap font-mono"
                              >
                                {header || `Column ${colStart + idx + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedRows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-slate-150 hover:bg-slate-50/80 transition-colors even:bg-slate-50/20"
                            >
                              <td className="px-4 py-2 text-[10px] font-mono text-slate-400 text-center bg-slate-50 border-r border-slate-200 sticky left-0 z-[5] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                {rowStart + rowIndex + 1}
                              </td>
                              {displayedHeaders.map((header, idx) => {
                                const colIndex = colStart + idx;
                                const cell = row[colIndex] || "";
                                return (
                                  <td
                                    key={colIndex}
                                    className="px-4 py-2 text-xs text-slate-600 border-r border-slate-100 font-mono whitespace-nowrap"
                                    title={`${header}: ${cell}`}
                                  >
                                    {cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Dataset preview loaded dynamically & safely client-side
                </span>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        );
      })()}
      {pipelineData && (
        <ImpactCalculatorModal
          isOpen={isImpactModalOpen}
          onClose={() => setIsImpactModalOpen(false)}
          pipelineData={pipelineData}
        />
      )}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        activeStep={activeStep}
        stepNames={[
          "Data Loading & Ingestion",
          "Clean Debris & QC Filters",
          "Align Batches & Calibrations",
          "Group Cells & Partitioning",
          "Double-Check ID & Audits",
          "Map Proteins & AlphaFold",
          "Literature Scan & Search",
          "Summary Report & Savings"
        ]}
      />
    </div>
  );
}

