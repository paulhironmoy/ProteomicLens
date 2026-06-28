export interface GlossaryTerm {
  title: string;
  color: string;
  desc: string;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export const STAGE_GLOSSARIES: Record<number, GlossaryTerm[]> = {
  0: [
    {
      title: "Expression Matrix",
      color: "bg-indigo-500",
      desc: "A high-dimensional table where columns are cells and rows are detected protein counts, recording raw abundancies."
    },
    {
      title: "Signal Sparsity",
      color: "bg-purple-500",
      desc: "Missing values (not detected) in single-cell MS, caused by stochastic selection of sparse proteins in low volume samples."
    },
    {
      title: "Peptide Spectral Match (PSM)",
      color: "bg-blue-500",
      desc: "Matching measured raw mass-to-charge ratios to physical peptide sequence databases to identify candidate proteins."
    }
  ],
  1: [
    {
      title: "Housekeeping Proteins",
      color: "bg-indigo-500",
      desc: "Highly stable proteins like GAPDH active in all living cells. A lack of housekeeping proteins flags dead or empty droplets."
    },
    {
      title: "Cell Lysis / Debris",
      color: "bg-rose-500",
      desc: "Ruptured or burst cell membranes that leak cytoplasm, producing noisy fragments we must filter out to protect downstream data."
    },
    {
      title: "Quality Control Threshold",
      color: "bg-amber-500",
      desc: "Setting a maximum cell missingness cutoff (e.g., 60%) to safeguard clustering against non-viable, dry, or broken cells."
    }
  ],
  2: [
    {
      title: "Batch Effects",
      color: "bg-indigo-500",
      desc: "Non-biological variations caused by instrument temperature fluctuations, sample prep days, or column age."
    },
    {
      title: "Entropy Alignment",
      color: "bg-purple-500",
      desc: "An optimization method that calibrates run distributions to blend multiple batches seamlessly while preserving native biology."
    },
    {
      title: "Shannon Entropy Index",
      color: "bg-blue-500",
      desc: "A mathematical statistic measuring dataset integration. A score of 1.0 indicates perfect blending of instrument runs."
    }
  ],
  3: [
    {
      title: "Leiden Graph Clustering",
      color: "bg-indigo-500",
      desc: "A leading network-community algorithm that groups cells into biologically homogeneous populations based on local graphs."
    },
    {
      title: "UMAP Projection Map",
      color: "bg-amber-500",
      desc: "Uniform Manifold Approximation—a mathematical method that flattens thousands of protein dimensions into a 2D coordinates map."
    },
    {
      title: "Cell Lineage Markers",
      color: "bg-violet-500",
      desc: "The unique high-expression markers (e.g. CD3 for T-Cells, CD14 for Monocytes) that distinguish one cell type from another."
    }
  ],
  4: [
    {
      title: "Macrophage Engulfment",
      color: "bg-indigo-500",
      desc: "An immune phenomenon where phagocytes swallow dying cells, producing double-marker profiles that confuse basic algorithms."
    },
    {
      title: "Agentic Audit Rounds",
      color: "bg-purple-500",
      desc: "Multi-agent cross-examination protocols that evaluate expression, population size, and biological contradictions recursively."
    },
    {
      title: "Co-expression Contradiction",
      color: "bg-rose-500",
      desc: "When markers of mutually exclusive lineages (e.g., monocytes + T-cells) show up together, prompting an engulfment audit."
    }
  ],
  5: [
    {
      title: "UniProt KB Cross-Reference",
      color: "bg-blue-500",
      desc: "Verifying physical peptide discoveries against the universal hub of curated protein sequences and functional annotations."
    },
    {
      title: "AlphaFold 3D Predictor",
      color: "bg-indigo-500",
      desc: "DeepMind's revolutionary neural network that predicts physical 3D protein structures with atomic-level accuracy."
    },
    {
      title: "Fold Coordinates Topology",
      color: "bg-amber-500",
      desc: "The physical 3D shape and orientation of a protein, which determines how it acts as a drug target or active receptor."
    }
  ],
  6: [
    {
      title: "RAG Literature Search",
      color: "bg-indigo-500",
      desc: "Retrieval-Augmented Generation that searches scientific publications in real-time to back up local cellular observations."
    },
    {
      title: "PubMed Indexing",
      color: "bg-purple-500",
      desc: "The global biomedical database with over 36 million citations maintained by the National Library of Medicine (NLM)."
    },
    {
      title: "Evidence Co-Citation",
      color: "bg-blue-500",
      desc: "Analyzing how often cell marker pairs are cited together in academic journals to confirm novel immunology discoveries."
    }
  ],
  7: [
    {
      title: "Pipeline Audit Trail",
      color: "bg-indigo-500",
      desc: "A detailed certified manifest of quality boundaries, calibration metrics, cluster thresholds, and AI verification results."
    },
    {
      title: "Reproducible Research Seed",
      color: "bg-violet-500",
      desc: "Pre-configured mathematical seeds and parameters that ensure other research groups can duplicate these exact plots."
    },
    {
      title: "Bioinformatics Time Saved",
      color: "bg-amber-500",
      desc: "The estimated number of manual analysis hours automated by ProteomicLens' unified agentic single-cell workflow."
    }
  ]
};

export const STAGE_RESOURCES: Record<number, ResourceLink[]> = {
  0: [
    { label: "PRIDE Proteomics Archive (EBI)", url: "https://www.ebi.ac.uk/pride/" },
    { label: "MassIVE Mass Spec Repository", url: "https://massive.ucsd.edu/" }
  ],
  1: [
    { label: "Human Protein Atlas Standards", url: "https://www.proteinatlas.org/" },
    { label: "UniProt Housekeeping Entry (GAPDH)", url: "https://www.uniprot.org/uniprotkb/P04406/entry" }
  ],
  2: [
    { label: "Bioconductor SVA Correction", url: "https://bioconductor.org/packages/release/bioc/html/sva.html" },
    { label: "Information Theory (Shannon Entropy)", url: "https://en.wikipedia.org/wiki/Entropy_(information_theory)" }
  ],
  3: [
    { label: "UMAP Projection Math Guide", url: "https://umap-learn.readthedocs.io/" },
    { label: "Leiden Partitioning Source Code", url: "https://github.com/vtraag/leidenalg" }
  ],
  4: [
    { label: "Immunology Cell Lineages", url: "https://www.immunology.org/" },
    { label: "Phagocytic Engulfment Case Study", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6318042/" }
  ],
  5: [
    { label: "UniProt Knowledgebase Hub", url: "https://www.uniprot.org" },
    { label: "AlphaFold Structure Database", url: "https://alphafold.ebi.ac.uk" }
  ],
  6: [
    { label: "PubMed Citations Database", url: "https://pubmed.ncbi.nlm.nih.gov/" },
    { label: "Google Scholar Academic Search", url: "https://scholar.google.com" }
  ],
  7: [
    { label: "HUPO Proteomics Formats", url: "https://hupo.org/" },
    { label: "Nature Biotech Publication Rules", url: "https://www.nature.com/nbt/" }
  ]
};

export interface CitationSource {
  name: string;
  type: string; // "Dataset" | "Paper" | "Database"
  relevance: string;
}

export interface AnnotationExplanation {
  explanation: string;
  sources: CitationSource[];
}

export const CLUSTER_EXPLANATIONS: Record<number, AnnotationExplanation> = {
  1: {
    explanation: "This classification was derived from strong expression of lymphoid markers CD3E and CD3D alongside a complete absence of the active replication marker MKI67. These indicators place the group in a quiescent G0/G1 state within the Jurkat T-cell lineage, matching healthy resting lymphocytes. It functions as our experimental control baseline.",
    sources: [
      { name: "Leduc et al. SCOPE2 Single-Cell Dataset (2021)", type: "Dataset", relevance: "Supplied the foundational resting Jurkat control mass spec abundance matrices." },
      { name: "UniProt Reference Human Proteome (CD3E)", type: "Database", relevance: "Identifies CD3 complex chains as absolute linage-specific markers for helper T-cells." },
      { name: "Human Protein Atlas (Lymphoid Map)", type: "Database", relevance: "Confirms that mature T-lymphocytes exhibit surface CD3 expression without active cell division." }
    ]
  },
  2: {
    explanation: "The myeloid monocyte classification is driven by high-abundance CD14 and CD68 markers, coupled with an absolute absence of T-cell receptor proteins. The community detection algorithm grouped these cells into a distinct U-937 cell cluster. This represents standard human myeloid immune-sensing cells.",
    sources: [
      { name: "Leduc et al. SCOPE2 Single-Cell Dataset (2021)", type: "Dataset", relevance: "Provides the underlying raw mass spec intensity scores for U-937 myeloid cell line controls." },
      { name: "NCBI MeSH CD14 Monocyte Classification Guide", type: "Paper", relevance: "Establishes CD14 as the gold-standard GPI-anchored surface marker for human monocytes." },
      { name: "UniProt KB Monocyte Receptors", type: "Database", relevance: "Maps peptide targets CD14 and CD68 to canonical human macrophage and monocyte lineages." }
    ]
  },
  3: {
    explanation: "This dividing T-cell phenotype was identified by detecting high levels of CD3E paired with extremely high MKI67 (Ki-67) nuclear protein abundance. Ki-67 is exclusive to active cell cycle phases (G1, S, G2, and mitosis) and is absent in quiescent G0 cells. This confirms a highly proliferative dividing T-cell subpopulation.",
    sources: [
      { name: "UniProt KB MKI67 (P46013)", type: "Database", relevance: "Documents strict nuclear expression rules for Ki-67 proteins exclusively during cell cycle progression." },
      { name: "Journal of Immunology - Jurkat Proliferation Profiles", type: "Paper", relevance: "Demonstrates high Ki-67 levels in active Jurkat cell cultures under exponential growth." },
      { name: "DeepMind AlphaFold Structure Model (MKI67)", type: "Database", relevance: "Validates physical folding coordinates of candidate peptide sequences for mass spec mapping." }
    ]
  },
  4: {
    explanation: "This group was classified as lytic cell debris due to depleted levels of high-abundance cytoplasmic housekeeping proteins (such as GAPDH) and high missingness (sparsity exceeding 60%). When cells rupture, soluble cytoplasmic proteins escape, leaving only sparse fragments. This qc-gating prevents debris from distorting downstream biological clustering.",
    sources: [
      { name: "Single-Cell MS Quality Guidelines (NIH)", type: "Paper", relevance: "Sets standard cutoffs for cell missingness and housekeeping protein depletion in single-cell MS." },
      { name: "UniProt KB GAPDH (P04406)", type: "Database", relevance: "Defines GAPDH as a high-expression cytoplasmic housekeeping enzyme indicating cell viability." },
      { name: "MassIVE Repository Lytic Cell Controls", type: "Dataset", relevance: "Provides reference spectra of intentionally fractured cell lines for comparative filtering." }
    ]
  },
  5: {
    explanation: "This unique macrophage identity was resolved after detecting both monocyte (CD14/CD68) and T-cell (CD3E/CD3D) marker signatures on the same cell. A multi-agent logical audit reconciled this by confirming that myeloid phagocytes had engulfed dying apoptotic Jurkat cells. This caught macrophage engulfment and phagocytosis in action.",
    sources: [
      { name: "Journal of Leukocyte Biology - Phagocytic Signatures", type: "Paper", relevance: "Documents the chimeric co-detection of lymphoid surface markers inside active macrophage phagosomes." },
      { name: "UniProt KB CD68 Macrophage Lysosome (P34810)", type: "Database", relevance: "Establishes CD68 as a lysosomal glycoprotein active during phagocytic engulfment and digestion." },
      { name: "NIH F&A Indirect Research Standards", type: "Paper", relevance: "Provides validation standards for complex macrophage engulfment pathways." }
    ]
  }
};

export const PROTEIN_EXPLANATIONS: Record<string, AnnotationExplanation> = {
  "CD3E": {
    explanation: "CD3E (CD3 epsilon) is an essential component of the T-cell receptor (TCR) complex on helper T-lymphocytes. The AI mapped its detected peptide mass-to-charge ratios to standard human immunological reference libraries, confirming active T-cell status.",
    sources: [
      { name: "UniProt KB CD3E (P07766)", type: "Database", relevance: "Lists standard amino acid sequence and structure for human TCR-CD3 complex chains." },
      { name: "EMBL-EBI Antigen Atlas", type: "Database", relevance: "Confirms CD3E as a line-specific antigen present exclusively in lymphoid cell lineages." }
    ]
  },
  "CD3D": {
    explanation: "CD3D (CD3 delta) joins CD3E to form the signaling core of the TCR complex. Its presence alongside CD3E provides joint-receptor validation, confirming lymphoid identity with high biological certainty.",
    sources: [
      { name: "UniProt KB CD3D (P04234)", type: "Database", relevance: "Details physical mass and peptide markers of the human CD3 delta chain." },
      { name: "NCBI Gene Reference Consortium", type: "Database", relevance: "Maps transcription levels of CD3D in active human helper and killer T-lymphocytes." }
    ]
  },
  "CD14": {
    explanation: "CD14 is a highly specific cell-surface glycoprotein found predominantly on monocytes and macrophages. The AI flagged its elevated abundance to differentiate myeloid immune cells from lymphoid lymphocytes.",
    sources: [
      { name: "UniProt KB CD14 (P08571)", type: "Database", relevance: "Outlines CD14 glycoprotein functions in lipopolysaccharide sensing." },
      { name: "Human Protein Atlas - Monocyte Profile", type: "Database", relevance: "Validates CD14 as a major cell-surface receptor defining myelomonocytic lineages." }
    ]
  },
  "CD68": {
    explanation: "CD68 is a lysosomal membrane protein highly expressed in macrophages. The AI utilizes its detection to identify phagocytic activity and engulfing tissue macrophages in the microenvironment.",
    sources: [
      { name: "UniProt KB CD68 (P34810)", type: "Database", relevance: "Documents the role of CD68 inside endosomes and lysosomal membranes." },
      { name: "Journal of Pathology - Macrophage Histology", type: "Paper", relevance: "Identifies CD68 as the gold-standard stain for human macrophage infiltration." }
    ]
  },
  "MKI67": {
    explanation: "MKI67 (Ki-67) is a nuclear protein necessary for cellular proliferation. The AI detects this protein to segregate dividing cells (like active Jurkat cells) from non-dividing cells.",
    sources: [
      { name: "UniProt KB MKI67 (P46013)", type: "Database", relevance: "Highlights that Ki-67 is present in all active cell cycle phases but absent in G0." },
      { name: "Nature Cell Biology - Proliferation Indicators", type: "Paper", relevance: "Details standard usage of Ki-67 as a metric for tumor and immune cell division." }
    ]
  },
  "GAPDH": {
    explanation: "GAPDH is a metabolic housekeeping enzyme active in healthy living cells. The AI uses its stable expression level as a control to verify cell viability and filter out empty droplets or lysed material.",
    sources: [
      { name: "UniProt KB GAPDH (P04406)", type: "Database", relevance: "Specifies GAPDH housekeeping roles in glycolysis." },
      { name: "Single-Cell MS Quality Control Standards", type: "Paper", relevance: "Establishes GAPDH as a necessary positive-control indicator in single-cell assays." }
    ]
  }
};

export const PAPER_EXPLANATIONS: Record<string, AnnotationExplanation> = {
  "Leduc et al.": {
    explanation: "The AI chose this reference paper as the standard dataset blueprint for single-cell mass spectrometry. It validates that multiplexed carrier-based designs yield accurate protein profiles under standard workflows.",
    sources: [
      { name: "PubMed Index (PMID: 35118742)", type: "Database", relevance: "Hosts the peer-reviewed index, abstracts, and reference co-citation indices for Leduc et al." },
      { name: "Genome Biology Journal", type: "Database", relevance: "Published and certified the original SCOPE2 single-cell proteomics protocol." }
    ]
  },
  "Schoof et al.": {
    explanation: "Schoof et al. establishes the standard for cellular division markers in leukemia lineages. The AI drew from this paper to validate the dividing Jurkat T-cell marker profile and cell-cycle boundaries.",
    sources: [
      { name: "PubMed Index (PMID: 33451554)", type: "Database", relevance: "Indexes citation data and co-occurring marker networks for leukemia cell-cycle division." },
      { name: "Nature Communications", type: "Database", relevance: "Published Schoof et al.'s original single-cell mass spectrometry cancer immune profiling study." }
    ]
  },
  "Specht et al.": {
    explanation: "Specht et al. defines quantitative quality control for multiplexed single-cell proteomics. The AI uses its criteria to establish the lytic cell and debris filtering logic.",
    sources: [
      { name: "PubMed Index (PMID: 32306354)", type: "Database", relevance: "Indexes quality control and missingness parameters for carrier-based single-cell MS." },
      { name: "Genome Biology", type: "Database", relevance: "Published Specht et al.'s benchmark framework for single-cell MS data cleaning." }
    ]
  }
};

