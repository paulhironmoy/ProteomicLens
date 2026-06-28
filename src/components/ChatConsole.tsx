import { useState, useRef, useEffect, FormEvent } from "react";
import { ChatMessage } from "../types";
import { Send, Terminal, RefreshCw, Zap, Award, HelpCircle, Flame, Dna, Sparkles } from "lucide-react";

interface ChatConsoleProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onClearHistory: () => void;
}

export default function ChatConsole({
  chatHistory,
  onSendMessage,
  isThinking,
  onClearHistory,
}: ChatConsoleProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isThinking]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const presetCommands = [
    { label: "🧬 Who is GAPDH?", cmd: "what is the function of GAPDH?" },
    { label: "🦖 Cluster 5 Phagocytes?", cmd: "expand cluster 5" },
    { label: "🔥 Explain Tier 3!", cmd: "explain tier 3" },
    { label: "💥 Edinburgh Failures?", cmd: "explain Edinburgh failure modes" },
  ];

  return (
    <div id="chat-console" className="bg-white border-2 border-slate-900 rounded-3xl p-5 flex flex-col h-[520px] shadow-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-3 bg-slate-50 -mx-5 -mt-5 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900 font-sans tracking-wide uppercase">🧬 PROTEOMIC BUDDY</h3>
              <span className="text-[8px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full animate-pulse">
                HYPED & READY
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-semibold">Your ultra-energetic biological annotation sidekick! 🚀</p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          className="text-[9px] text-slate-400 hover:text-red-500 transition-colors font-mono uppercase tracking-widest font-black"
        >
          Clear History
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-3.5">
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full shadow-md animate-bounce">
              <Flame className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide">OH MY GOLGI! I AM LIVE! 🧬💥</p>
            <p className="text-[11px] font-sans text-slate-500 max-w-xs leading-relaxed font-semibold">
              Query markers, trace 1,490-cell populations, analyze Edinburgh failure modes, or check out our UCSF Danielle Swaney Bruker Facility integrations!
            </p>
          </div>
        )}

        {chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm border ${
                  isUser
                    ? "bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 text-teal-950 font-semibold"
                    : "bg-gradient-to-br from-slate-50 to-white border-slate-250 text-slate-800 font-medium"
                }`}
              >
                {/* Message Meta */}
                <div className="flex items-center justify-between gap-4 text-[9px] text-slate-400 mb-2 border-b border-slate-100 pb-1">
                  <span className="font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    {isUser ? (
                      <>
                        <Dna className="w-2.5 h-2.5 text-teal-600" />
                        <span>Researcher</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
                        Proteomic Buddy
                      </>
                    )}
                  </span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs font-sans text-indigo-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 w-max animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span className="font-extrabold text-[10px] tracking-wide">Buddy is thinking with MITOCHONDRIA energy... ⚡</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Shortcuts/Quick commands */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {presetCommands.map((item) => (
          <button
            key={item.label}
            onClick={() => onSendMessage(item.cmd)}
            disabled={isThinking}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-sans text-slate-600 hover:text-slate-900 hover:bg-yellow-50 hover:border-yellow-300 font-bold transition-all disabled:opacity-40 active:scale-95 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask e.g. 'what is GAPDH?' or click a hyped shortcut! 🚀"
          disabled={isThinking}
          className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-50 font-semibold"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-md active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

