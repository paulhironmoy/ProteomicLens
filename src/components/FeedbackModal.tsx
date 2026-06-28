import React, { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  Star,
  Send,
  Sparkles,
  Trash2,
  CheckCircle,
  FileText,
  Mail,
  Sliders,
  AlertCircle,
  BookmarkCheck,
  ChevronRight
} from "lucide-react";

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  stepName: string;
  comments: string;
  email: string;
  lovedFeatures: string[];
  timestamp: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
  stepNames: string[];
}

export default function FeedbackModal({
  isOpen,
  onClose,
  activeStep,
  stepNames
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("Feature Request");
  const [targetStep, setTargetStep] = useState<string>("General App Feedback");
  const [comments, setComments] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; error?: string; message: string } | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  const categories = [
    { name: "Feature Request", icon: Sparkles, color: "text-amber-500 bg-amber-50 border-amber-100" },
    { name: "Bug Report", icon: AlertCircle, color: "text-rose-500 bg-rose-50 border-rose-100" },
    { name: "UI/UX & Styling", icon: Sliders, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
    { name: "Scientific Accuracy", icon: BookmarkCheck, color: "text-teal-500 bg-teal-50 border-teal-100" },
    { name: "Other / General", icon: MessageSquare, color: "text-slate-500 bg-slate-50 border-slate-100" }
  ];

  const features = [
    "Interactive UMAP Chart",
    "WebGL 3D AlphaFold structures",
    "NCBI PubMed publication scraper",
    "Labor & financial impact calculator",
    "Multi-round AI (Gemini) audit panel",
    "Bento grid explanations & analogies"
  ];

  const ratingDescriptions = [
    "Critically broken / unacceptable experience",
    "Poor experience, needs major improvements",
    "Decent, but missing essential components",
    "Very good, highly functional and intuitive",
    "Incredible! Bypasses manual laboratory burdens perfectly"
  ];

  // Initialize and load feedback history from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("proteomic_lens_feedback_history");
      if (stored) {
        try {
          setFeedbackHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Error reading feedback history", e);
        }
      }
      // Prefill target step based on activeStep parameter
      if (activeStep >= 0 && activeStep < stepNames.length) {
        setTargetStep(`Stage ${activeStep + 1}: ${stepNames[activeStep]}`);
      } else {
        setTargetStep("General App Feedback");
      }
    }
  }, [isOpen, activeStep, stepNames]);

  if (!isOpen) return null;

  const handleToggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        rating,
        category,
        stepName: targetStep,
        comments,
        email: email || "anonymous@proteomiclens.edu",
        lovedFeatures: selectedFeatures
      };

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setSubmitResult(data);
      
      const newItem: FeedbackItem = {
        id: "fb-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now(),
        rating,
        category,
        stepName: targetStep,
        comments,
        email: email || "anonymous@proteomiclens.edu",
        lovedFeatures: selectedFeatures,
        timestamp: new Date().toLocaleString()
      };

      const updatedHistory = [newItem, ...feedbackHistory];
      setFeedbackHistory(updatedHistory);
      localStorage.setItem("proteomic_lens_feedback_history", JSON.stringify(updatedHistory));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form variables
      setComments("");
      setSelectedFeatures([]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitResult({
        success: false,
        error: "NETWORK_ERROR",
        message: "Failed to establish a network connection with the ProteomicLens feedback API. Your comment was logged locally in the browser cache."
      });
      // Fallback to local simulation if server endpoint is not fully reachable
      const newItem: FeedbackItem = {
        id: "fb-err-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now(),
        rating,
        category,
        stepName: targetStep,
        comments,
        email: email || "anonymous@proteomiclens.edu",
        lovedFeatures: selectedFeatures,
        timestamp: new Date().toLocaleString()
      };

      const updatedHistory = [newItem, ...feedbackHistory];
      setFeedbackHistory(updatedHistory);
      localStorage.setItem("proteomic_lens_feedback_history", JSON.stringify(updatedHistory));
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setComments("");
      setSelectedFeatures([]);
    }
  };

  const handleDeleteFeedback = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = feedbackHistory.filter(item => item.id !== id);
    setFeedbackHistory(updated);
    localStorage.setItem("proteomic_lens_feedback_history", JSON.stringify(updated));
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setRating(5);
    setCategory("Feature Request");
    setEmail("");
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" id="feedback-modal-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-[2rem] bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl border border-slate-100 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/10">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                  ProteomicLens Feedback Center
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Contribute feedback to refine artificial intelligence, QC thresholds, and 3D structural mapping.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Close feedback form"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 bg-white shrink-0">
            <button
              onClick={() => { setActiveTab("new"); setSubmitSuccess(false); }}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                activeTab === "new"
                  ? "border-indigo-600 text-indigo-600 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Provide Feedback
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-600 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Feedback History
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200/50">
                {feedbackHistory.length}
              </span>
            </button>
          </div>

          {/* Form / History Container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {activeTab === "new" ? (
              submitSuccess ? (
                submitResult && submitResult.success === false ? (
                  /* Warning / Local Save screen due to missing configuration */
                  <div className="py-8 text-center space-y-5 max-w-lg mx-auto animate-fade-in" id="feedback-success-local-only">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 border border-amber-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight text-amber-600">Saved Locally (Email Pending Setup)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium px-4">
                        We have successfully logged your feedback in the browser's <strong>Feedback History</strong>, but we could not deliver an email to <strong>squirreldodogo@gmail.com</strong>.
                      </p>
                      
                      {/* Reason Explanation */}
                      <div className="bg-amber-50/70 border border-amber-200/50 p-4 rounded-2xl text-left text-[11px] text-slate-700 font-sans space-y-2 max-w-md mx-auto">
                        <span className="font-extrabold text-amber-800 uppercase tracking-wider block">⚠️ Action Required to Send Real Emails:</span>
                        <p className="leading-relaxed font-medium text-slate-600">
                          {submitResult.error === "SMTP_NOT_CONFIGURED" 
                            ? "SMTP environment variables are currently empty in this environment. To enable real email delivery, you must define SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS variables." 
                            : `SMTP Delivery failed: ${submitResult.message}`}
                        </p>
                        <div className="pt-2 border-t border-amber-200/40 space-y-1">
                          <span className="font-bold text-slate-600 block">How to configure credentials:</span>
                          <ol className="list-decimal pl-4.5 space-y-1 font-medium text-slate-500">
                            <li>Open the <strong>Settings &rarr; Secrets</strong> menu in the top bar of AI Studio.</li>
                            <li>Add your SMTP keys (e.g., <code className="bg-amber-100/60 px-1 rounded text-amber-900 font-mono">SMTP_HOST</code>, <code className="bg-amber-100/60 px-1 rounded text-amber-900 font-mono">SMTP_PORT</code>, <code className="bg-amber-100/60 px-1 rounded text-amber-900 font-mono">SMTP_USER</code>, <code className="bg-amber-100/60 px-1 rounded text-amber-900 font-mono">SMTP_PASS</code>).</li>
                            <li>Save the secrets to automatically start routing feedback directly to your inbox.</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm shadow-indigo-600/10"
                      >
                        Submit Another Response
                      </button>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                      >
                        View Log History
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Full Success screen */
                  <div className="py-12 text-center space-y-6 max-w-md mx-auto animate-fade-in" id="feedback-success-delivered">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-black text-slate-800 uppercase tracking-tight text-emerald-600">Feedback Saved & Dispatched!</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Thank you for contributing your perspective! Your feedback has been logged in the platform's history and successfully routed to <strong className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">squirreldodogo@gmail.com</strong> via our active mail-relay backend service.
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Our annotation and machine-learning validation team will review your comments to optimize high-throughput proteomics pipelines.
                      </p>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm shadow-indigo-600/10"
                      >
                        Submit Another Response
                      </button>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                      >
                        View Feedback History
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Form layout */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      1. Feedback Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {categories.map((c) => {
                        const Icon = c.icon;
                        const isSelected = category === c.name;
                        return (
                          <button
                            type="button"
                            key={c.name}
                            onClick={() => setCategory(c.name)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/15 scale-[1.02]"
                                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200"
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-500"}`} />
                            <span className="text-[10px] font-bold leading-tight select-none">
                              {c.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      2. Satisfactory Rating
                    </label>
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-4 flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const isActive = hoveredRating !== null ? val <= hoveredRating : val <= rating;
                          return (
                            <button
                              type="button"
                              key={val}
                              onMouseEnter={() => setHoveredRating(val)}
                              onMouseLeave={() => setHoveredRating(null)}
                              onClick={() => setRating(val)}
                              className="p-1 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                              title={`${val} Star`}
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  isActive
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-700 font-sans">
                          {rating} / 5 Stars
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium max-w-sm mt-0.5">
                          {ratingDescriptions[rating - 1]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step Association Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      3. Pipeline Stage Linkage
                    </label>
                    <select
                      value={targetStep}
                      onChange={(e) => setTargetStep(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4.5 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="General App Feedback">General App Feedback (Entire Platform)</option>
                      {stepNames.map((name, idx) => (
                        <option key={idx} value={`Stage ${idx + 1}: ${name}`}>
                          Stage {idx + 1}: {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Loved Features */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      4. Features You Enjoy (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((feature) => {
                        const isChecked = selectedFeatures.includes(feature);
                        return (
                          <label
                            key={feature}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              isChecked
                                ? "bg-indigo-50/50 border-indigo-200 text-indigo-900"
                                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleFeature(feature)}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                            />
                            <span>{feature}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Comments */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        5. Detailed Comments
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${comments.length < 20 ? "text-rose-500" : "text-slate-400"}`}>
                        {comments.length} / 1000 chars (min 20)
                      </span>
                    </div>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Share your experience, scientific concerns, suggestions for visual mappings, or bugs discovered. Be as descriptive as possible..."
                      maxLength={1000}
                      rows={4}
                      className="w-full border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 leading-relaxed transition-all resize-none"
                    />
                  </div>

                  {/* Email follow up */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      6. Science Follow-up Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. researcher@university.edu"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4.5 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-extrabold text-xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || comments.trim().length < 20}
                      className={`px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                        comments.trim().length >= 20 && !isSubmitting
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10 active:scale-[0.98]"
                          : "bg-slate-100 text-slate-400 border border-slate-200 shadow-none pointer-events-none"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* History view */
              <div className="space-y-4 animate-fade-in">
                {feedbackHistory.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">No Feedback Submitted Yet</h4>
                      <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-0.5 font-medium leading-relaxed">
                        Feedback reports you compile and submit will appear here. They are stored locally inside your browser's LocalStorage.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feedbackHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50/60 hover:bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">
                                {item.category}
                              </span>
                              <span className="text-[8px] font-mono font-bold text-slate-400">
                                {item.timestamp}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-500/80 block">
                              Linkage: {item.stepName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <Star
                                  key={val}
                                  className={`w-3.5 h-3.5 ${
                                    val <= item.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <button
                              onClick={(e) => handleDeleteFeedback(item.id, e)}
                              className="p-1 rounded bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-100 transition-colors cursor-pointer"
                              title="Delete log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white/80 border border-slate-100 p-3 rounded-xl">
                          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                            "{item.comments}"
                          </p>
                        </div>

                        {item.lovedFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mr-1">Loved features:</span>
                            {item.lovedFeatures.map((feat) => (
                              <span key={feat} className="text-[8px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-mono">
                          <Mail className="w-3 h-3" />
                          <span>Submitted via: {item.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
