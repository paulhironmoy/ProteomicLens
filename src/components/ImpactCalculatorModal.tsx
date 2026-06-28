import { useState } from "react";
import {
  X,
  Calculator,
  TrendingUp,
  Coins,
  Layers,
  BookOpen,
  Activity,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { PipelineData } from "../types";

interface ImpactCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipelineData: PipelineData;
}

export default function ImpactCalculatorModal({
  isOpen,
  onClose,
  pipelineData
}: ImpactCalculatorModalProps) {
  const [hourlyRate, setHourlyRate] = useState<number>(75);
  const [runsPerYear, setRunsPerYear] = useState<number>(12);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" id="impact-calculator-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl border border-slate-100 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-teal-600 to-cyan-500 p-2 rounded-xl text-white shadow-md shadow-teal-500/10">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  Multi-Scale Labor & Financial Impact Calculator
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Model the dynamic value and scientific leverage of automating single-cell proteomics.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1">
            
            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-100/50 rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-teal-150">
                  <Sparkles className="w-3 h-3" /> Baseline Estimates
                </span>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  By automating quality filters, machine alignment, lineage annotation, and literature searches, ProteomicLens bypasses 23 high-skilled hours per study.
                </p>
              </div>
              <div className="bg-white border border-slate-200/60 p-3 rounded-2xl shadow-sm shrink-0 flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Estimated Savings / Run</span>
                  <p className="text-lg font-black text-teal-600 font-mono leading-none mt-0.5">23 Hours</p>
                </div>
              </div>
            </div>

            {/* Adjustable Parameters Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-150/80">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-teal-600" />
                    Scientist Hourly Rate (Full Cost)
                  </span>
                  <span className="font-mono text-teal-600 font-extrabold text-sm">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <span className="text-[10px] text-slate-400 block leading-relaxed">
                  Reflects baseline investigator wages, overhead allocations, and operational research amortization.
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Average Runs per Lab per Year
                  </span>
                  <span className="font-mono text-indigo-600 font-extrabold text-sm">{runsPerYear} Runs/Yr</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="52"
                  step="2"
                  value={runsPerYear}
                  onChange={(e) => setRunsPerYear(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <span className="text-[10px] text-slate-400 block leading-relaxed">
                  The standard annual density of single-cell mass spectrometry datasets analyzed per investigator team.
                </span>
              </div>
            </div>

            {/* Side-by-Side Dual Column Scales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Column 1: Full Pipeline Impact */}
              <div className="border border-teal-100 rounded-2xl bg-teal-50/10 p-5 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-teal-100 pb-3">
                  <div className="bg-teal-500/10 p-2 rounded-xl text-teal-600">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-teal-950 uppercase tracking-wider">Full Pipeline Automation</h4>
                    <p className="text-[10px] text-teal-700 font-bold">Saves 23 hours total per run</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Scale 1: This Run */}
                  <div className="flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800">This Specific Run</span>
                      <p className="text-[10px] text-slate-400">1 standard scientific experiment</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-teal-600 text-[11px] block">23 Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${(23 * hourlyRate).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 2: UCSF */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">UCSF (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">1.45x Bay Area</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Calculated for 15 active labs with SF premium & 61.5% F&A overhead</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-teal-600 text-[11px] block">{(15 * runsPerYear * 23).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(15 * runsPerYear * 23 * hourlyRate * 1.45).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 3: USA */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Entire USA (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-1 rounded">1.00x Base</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Calculated for 150 active institutions & labs nationwide at standard rate</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-teal-600 text-[11px] block">{(150 * runsPerYear * 23).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(150 * runsPerYear * 23 * hourlyRate * 1.00).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 4: Global */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Entire World (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-teal-700 bg-teal-50 border border-teal-150 px-1 rounded">0.75x Global</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Calculated for 600 active facilities worldwide adjusted for global salary indices</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-teal-600 text-[11px] block">{(600 * runsPerYear * 23).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(600 * runsPerYear * 23 * hourlyRate * 0.75).toLocaleString()} Saved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Annotation & Literature Only Impact */}
              <div className="border border-indigo-150 rounded-2xl bg-indigo-50/10 p-5 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-indigo-100 pb-3">
                  <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-600">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Annotation & Literature Stages Only</h4>
                    <p className="text-[10px] text-indigo-700 font-bold">Saves 20 hours total per run</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Scale 1: This Run */}
                  <div className="flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800">This Specific Run</span>
                      <p className="text-[10px] text-slate-400">Lineage research & PubMed DOI lookup steps only</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-600 text-[11px] block">20 Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${(20 * hourlyRate).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 2: UCSF */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">UCSF (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">1.45x Bay Area</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Annotation & Literature search steps (15 active labs with SF premium & overhead)</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-600 text-[11px] block">{(15 * runsPerYear * 20).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(15 * runsPerYear * 20 * hourlyRate * 1.45).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 3: USA */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Entire USA (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-1 rounded">1.00x Base</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Annotation & Literature search steps (150 nationwide centers at standard rate)</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-600 text-[11px] block">{(150 * runsPerYear * 20).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(150 * runsPerYear * 20 * hourlyRate * 1.00).toLocaleString()} Saved</span>
                    </div>
                  </div>

                  {/* Scale 4: Global */}
                  <div className="flex items-start justify-between gap-4 text-xs border-t border-slate-100 pt-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Entire World (All Labs / 1 Year)</span>
                        <span className="text-[9px] font-black text-teal-700 bg-teal-50 border border-teal-150 px-1 rounded">0.75x Global</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Annotation & Literature search steps (600 global labs with global wage indices)</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-600 text-[11px] block">{(600 * runsPerYear * 20).toLocaleString()} Hours Saved</span>
                      <span className="font-extrabold text-emerald-600 text-xs">${Math.round(600 * runsPerYear * 20 * hourlyRate * 0.75).toLocaleString()} Saved</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Methodology and Reference Note */}
            <div className="p-4.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
              <p className="font-extrabold text-slate-700">Calculative Methodology & Geographical Wage Scaling:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong>Annotation & Literature Curation Stages Only</strong> account for biological double-checks (~10 hours) and <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-0.5">PubMed literature cross-referencing<ExternalLink className="w-2.5 h-2.5 inline" /></a> (~10 hours), bypassing a manual workload of 20 hours.</li>
                <li><strong>Full Pipeline Automation</strong> integrates additional automated quality filtering (~2 hours) and batch instrumentation alignments (~1 hour) to sum up to 23 hours saved.</li>
                <li><strong>Geographical Index Multipliers</strong> take into account regional salary structures and overhead rates:
                  <ul className="list-circle list-inside pl-4 mt-0.5 space-y-0.5">
                    <li><strong>UCSF (1.45x):</strong> Reflects <a href="https://www.bls.gov/regions/west/news-release/occupationalemploymentandwages_sanfrancisco.htm" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-0.5">San Francisco Bay Area wages<ExternalLink className="w-2.5 h-2.5 inline" /></a> coupled with high-tier academic F&A overhead rates (currently <a href="https://controller.ucsf.edu/quick-reference/facilities-administrative-fa-rates" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-0.5">~61.5% at UCSF<ExternalLink className="w-2.5 h-2.5 inline" /></a>).</li>
                    <li><strong>Entire USA (1.00x):</strong> Represents the national baseline average for fully-burdened academic/industrial investigator rates.</li>
                    <li><strong>Entire World (0.75x):</strong> A blended average adjusted for international wage indexes across global research consortiums.</li>
                  </ul>
                </li>
                <li>Geographical financial models are calculated as: <code className="bg-white border border-slate-200/70 font-mono px-1 py-0.5 rounded text-teal-700 font-bold">Labor Savings = Scaling Labs × Runs/Yr × Hours Saved × (Hourly Rate × GeoMultiplier)</code>.</li>
              </ul>
            </div>

            {/* Cost, Time Savings & Labor References */}
            <div className="p-4.5 border border-slate-200 rounded-2xl bg-white space-y-3">
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                Laboratory Cost, Time Savings & Wage References
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://www.synthace.com/resources/reports/the-state-of-lab-automation-2023/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="text-[9px] bg-teal-50 text-teal-700 font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono">Synthace</span>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                      Lab Automation ROI & Savings Report
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      Detailed white paper analyzing hours saved, experiment accuracy, and labor productivity gains from automating molecular workflows.
                    </p>
                  </div>
                </a>

                <a
                  href="https://journals.sagepub.com/doi/10.1177/2211068215617415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="text-[9px] bg-teal-50 text-teal-700 font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono">SLAS</span>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                      Economic Models of Lab Automation
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      Peer-reviewed study modeling financial costs and scientific hour redeployment ROI when automated systems replace manual laboratory labor.
                    </p>
                  </div>
                </a>

                <a
                  href="https://grants.nih.gov/grants/financial/indirect_costs.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono">NIH F&A</span>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                      NIH Institutional Indirect Costs
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      The official framework for university Facilities & Administrative (F&A) overhead rates, driving regional research labor costs.
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.bls.gov/oes/current/oes191029.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono">US BLS</span>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                      Geographic Wage Estimates (BLS)
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      Official US Bureau of Labor Statistics data reporting regional premium wages for Life Scientists and Biochemists.
                    </p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-98"
            >
              Done reviewing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
