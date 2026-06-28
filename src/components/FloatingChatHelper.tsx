import React, { useState, useRef, useEffect, FormEvent } from "react";
import { ChatMessage } from "../types";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Sparkles,
  Trash2,
  Terminal,
  Flame,
  Dna,
  Minimize2,
  Maximize2,
  Activity,
  Atom,
  FlaskConical,
  Microscope,
  HeartPulse,
  Hexagon,
  Layers,
  Shield,
  Database,
  Zap,
  AlertCircle
} from "lucide-react";

interface FloatingChatHelperProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onClearHistory: () => void;
}

export default function FloatingChatHelper({
  chatHistory,
  onSendMessage,
  isThinking,
  onClearHistory,
}: FloatingChatHelperProps) {
  // We can default to open or closed. Let's make it easily togglable but default to a clean, non-dynamic look.
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const dragThresholdRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
    dragThresholdRef.current = false;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    if (Math.abs(walk) > 5) {
      dragThresholdRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setStartX(e.touches[0].pageX);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
    dragThresholdRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    const x = e.touches[0].pageX;
    const walk = x - startX;
    if (Math.abs(walk) > 10) {
      dragThresholdRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const oneSetWidth = container.scrollWidth / 3;
    if (oneSetWidth <= 0) return;

    // Seamless loop wrap-around
    if (container.scrollLeft >= oneSetWidth * 2 - 2) {
      container.scrollLeft = container.scrollLeft - oneSetWidth;
    } else if (container.scrollLeft <= 1) {
      container.scrollLeft = container.scrollLeft + oneSetWidth;
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      // Instantly center the infinite scroll container in the middle copy (oneSetWidth)
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const oneSetWidth = container.scrollWidth / 3;
          container.scrollLeft = oneSetWidth;
        }
      }, 100);
    }
  }, [chatHistory, isThinking, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const presetQueries = [
    // --- Local Hackathon / Single Cell Proteomics context ---
    { label: "Who is GAPDH?", cmd: "what is the function of GAPDH?", icon: Dna },
    { label: "Cluster 5 Phagocytes?", cmd: "expand cluster 5", icon: Microscope },
    { label: "Explain Tier 3!", cmd: "explain tier 3", icon: Flame },
    { label: "Edinburgh Failures?", cmd: "explain Edinburgh failure modes", icon: AlertCircle },
    { label: "Jurkat T-Cells?", cmd: "tell me about Jurkat T-cells", icon: HeartPulse },
    { label: "Who is Danielle Swaney?", cmd: "tell me about Danielle Swaney and UCSF Bruker Facility", icon: Atom },
    
    // --- Global Internet / State of the art Proteomics ---
    { label: "Orbitrap vs timsTOF?", cmd: "explain Orbitrap versus timsTOF mass spectrometers and dia-PASEF", icon: Database },
    { label: "What is Single-Cell Proteomics?", cmd: "explain single-cell proteomics (SCP) and how it works", icon: Layers },
    { label: "What are PTMs?", cmd: "explain post-translational modifications like phosphorylation and ubiquitination", icon: Zap },
    { label: "AlphaFold + MS?", cmd: "how does AlphaFold integrate with structural mass spectrometry and cross-linking?", icon: Hexagon },
    { label: "DIA vs DDA?", cmd: "what are DIA (Data Independent Acquisition) and DDA (Data Dependent Acquisition)?", icon: Activity },
    { label: "Bottom-up vs Top-down?", cmd: "what is the difference between bottom-up and top-down proteomics?", icon: FlaskConical },
    { label: "How does TMT work?", cmd: "explain Tandem Mass Tag (TMT) multiplexing and carrier channel design", icon: Shield },
    { label: "What is MaxQuant?", cmd: "what is MaxQuant and how does it process raw MS spectra?", icon: Terminal },
    { label: "Clinical Proteomics?", cmd: "how is clinical proteomics used for cancer biomarker discovery?", icon: HeartPulse },
    { label: "What is Proteogenomics?", cmd: "explain how proteogenomics merges genomic mutations with proteomic evidence", icon: Sparkles },
    { label: "What is Label-Free (LFQ)?", cmd: "explain Label-Free Quantification (LFQ) in mass spectrometry", icon: Database },
    { label: "Interactome Mapping?", cmd: "how do we map the protein-protein interactome using AP-MS?", icon: Atom }
  ];

  const tripleQueries = [...presetQueries, ...presetQueries, ...presetQueries];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Expanded Chat & Knowledge Panel */}
      {isOpen ? (
        <div className="w-[380px] h-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header with energetic styling */}
          <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-teal-200 animate-spin" style={{ animationDuration: "6s" }} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black tracking-wider uppercase text-white">Proteomic Buddy</h4>
                  <span className="text-[8px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold tracking-wider">
                    KNOWLEDGE HUB
                  </span>
                </div>
                <p className="text-[9px] text-teal-100 font-medium flex items-center gap-1">
                  Your exciting single-cell proteomics sidekick! <Sparkles className="w-3 h-3 text-yellow-300 inline" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onClearHistory}
                title="Wipe Chat memory!"
                className="p-1 hover:bg-white/10 rounded transition-colors text-teal-100 hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1 hover:bg-white/10 rounded transition-colors text-teal-100 hover:text-white"
              >
                <Minimize2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 relative overflow-y-auto p-4 space-y-3.5 bg-slate-50/55">
            {/* WhatsApp-style biological doodle background patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] select-none overflow-hidden z-0">
              <Dna className="absolute top-4 left-6 w-8 h-8 rotate-12 text-teal-800" />
              <Activity className="absolute top-10 right-8 w-7 h-7 -rotate-12 text-teal-800" />
              <FlaskConical className="absolute top-28 left-16 w-8 h-8 rotate-45 text-teal-800" />
              <Microscope className="absolute top-40 right-12 w-9 h-9 -rotate-12 text-teal-800" />
              <Atom className="absolute top-56 left-8 w-8 h-8 rotate-90 text-teal-800" />
              <Sparkles className="absolute top-64 right-16 w-6 h-6 rotate-12 text-teal-800" />
              <Hexagon className="absolute top-[280px] left-12 w-8 h-8 -rotate-45 text-teal-800" />
              <HeartPulse className="absolute top-[320px] right-6 w-8 h-8 rotate-12 text-teal-800" />
              <Layers className="absolute top-[360px] left-20 w-7 h-7 -rotate-[15deg]" />
              <Shield className="absolute bottom-28 right-10 w-8 h-8 rotate-12 text-teal-800" />
              <Database className="absolute bottom-16 left-6 w-8 h-8 -rotate-12 text-teal-800" />
              <Zap className="absolute bottom-4 right-20 w-7 h-7 rotate-45 text-teal-800" />
            </div>

            {chatHistory.length === 0 && (
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-3">
                <div className="p-3.5 bg-teal-50 rounded-full shadow-inner">
                  <Flame className="w-6 h-6 text-teal-600 animate-pulse" />
                </div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5 justify-center">
                  READY TO ASSIST! <Atom className="w-4 h-4 text-teal-600 animate-spin" />
                </p>
                <p className="text-[11px] text-slate-500 max-w-[240px] leading-relaxed font-semibold">
                  Ask me questions about cell markers, cluster assignments, or pipeline details! Let's do some awesome science!
                </p>
              </div>
            )}

            {chatHistory.map((msg) => {
              const isUser = msg.sender === "user";
              const isSystem = msg.sender === "system";
              
              if (isSystem) {
                return (
                  <div key={msg.id} className="relative z-10 text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-center font-bold">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`relative z-10 flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap shadow-sm border ${
                      isUser
                        ? "bg-teal-600 text-white font-semibold border-teal-700/10 rounded-tr-none"
                        : "bg-white border border-slate-250 text-slate-800 font-medium rounded-tl-none"
                    }`}
                  >
                    {!isUser && (
                      <span className="text-[8px] uppercase tracking-wider font-mono text-teal-600 block mb-1 font-black flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-teal-500 animate-spin" />
                        Proteomic Buddy
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="relative z-10 flex items-center gap-2 text-[10px] text-teal-600 bg-teal-50/50 p-3 rounded-2xl border border-teal-100 shadow-sm w-max animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span className="font-extrabold flex items-center gap-1">
                  Buddy is thinking... <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions - Horizontally scrollable list of hints with full tray dragging */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="bg-slate-50 border-t border-slate-100 flex flex-col cursor-grab active:cursor-grabbing select-none"
          >
            <div className="px-3.5 pt-2 pb-0.5 text-[8px] text-slate-400 font-bold tracking-wider uppercase select-none pointer-events-none">
              <span>Swipe / Drag left or right for questions to ask</span>
            </div>
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="px-3.5 pb-2 pt-1 flex flex-nowrap gap-2 select-none overflow-y-hidden overscroll-x-contain touch-pan-x queries-scroll-container mb-2 pointer-events-auto"
            >
              {tripleQueries.map((q, idx) => {
                const IconComp = q.icon;
                return (
                  <button
                    key={`${q.label}-${idx}`}
                    onClick={(e) => {
                      if (dragThresholdRef.current) {
                        e.preventDefault();
                        return;
                      }
                      onSendMessage(q.cmd);
                    }}
                    disabled={isThinking}
                    className="text-[10px] px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-600 hover:text-slate-900 font-bold transition-all disabled:opacity-40 active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm select-none"
                  >
                    <IconComp className="w-3.5 h-3.5 text-teal-600 shrink-0 pointer-events-none" />
                    <span className="pointer-events-none">{q.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-150 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question on results..."
              disabled={isThinking}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 transition-all disabled:opacity-50 font-semibold"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center shrink-0 shadow-sm active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Uncollapsed Implicit static-looking chat tab/knowledge widget anchored on the bottom-right corner */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white border border-teal-700/20 px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 text-xs font-black tracking-wide uppercase cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Proteomic Buddy</span>
          <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></span>
        </button>
      )}
    </div>
  );
}
