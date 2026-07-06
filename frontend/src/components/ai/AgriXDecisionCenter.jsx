import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Activity
} from 'lucide-react'

const AgriXDecisionCenter = ({ selectedFarm, metrics, loading, progress }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!selectedFarm) {
    return (
      <div className="glass-panel p-8 flex flex-col items-center justify-center text-center select-none min-h-[520px] relative w-full h-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/5 text-blue-400 border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] mb-4"
        >
          <BrainCircuit className="h-8 w-8" />
        </motion.div>
        
        <h3 className="text-slate-200 font-bold text-sm tracking-wide font-sans">Awaiting Field Target</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
          Select a precision crop field polygon on the geospatial map to trigger Edge AI Decision center calculations.
        </p>
      </div>
    )
  }

  const radius = 28
  const circumference = 2 * Math.PI * radius

  return (
    <div className="glass-panel p-8 flex flex-col justify-between relative w-full h-full min-h-[520px] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center relative min-h-[460px]"
          >
            <div className="absolute inset-x-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-scan z-20" />

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.15)]"
              >
                <BrainCircuit className="h-8 w-8" />
              </motion.div>
            </div>

            <h3 className="text-slate-200 font-bold text-sm tracking-wide font-sans">Analyzing Field Telemetry...</h3>
            <p className="text-[10px] text-slate-500 mt-1 mb-4">Running AgriX Decision Models ({progress}%)</p>

            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ) : (
          metrics && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Header with Title & priority */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-100 text-sm tracking-wider uppercase font-sans">AgriX Decision Center</h3>
                    <p className="text-[10px] text-slate-500 font-bold font-mono">Target: {selectedFarm?.id ?? 'N/A'}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border
                  ${metrics?.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.15)]' : ''}
                  ${metrics?.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                  ${metrics?.priority === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                `}>
                  ● {metrics?.priority ?? 'Normal'} Priority
                </span>
              </div>

              {/* Premium Tab Selection Bar */}
              <div className="flex border-b border-white/5 pb-3 mb-4 gap-2 overflow-x-auto scrollbar-none select-none">
                {['overview', 'health', 'recommendation', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border
                      ${activeTab === tab 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.08)]' 
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Inner Tab Renderings */}
              <div className="flex-1 flex flex-col justify-between min-h-[300px] text-left">
                <AnimatePresence mode="wait">
                  
                  {/* OVERVIEW TAB: Displays all current agricultural indicators */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider block">Selected Field Summary</span>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-400">
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>Field Target:</span>
                            <span className="text-slate-200 font-mono">{selectedFarm?.id ?? 'N/A'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>Crop Stage:</span>
                            <span className="text-slate-200">{selectedFarm?.growthStage ?? metrics?.growthStage ?? 'Vegetative'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider block">Current Field Status</span>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-400">
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>Moisture level:</span>
                            <span className="text-slate-200 font-mono">{selectedFarm?.moisture ?? '0%'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>NDVI reflectance:</span>
                            <span className="text-slate-200 font-mono">{selectedFarm?.ndvi ?? '0.74'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider block">Operational Status</span>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-400">
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>Soil Silt profile:</span>
                            <span className="text-slate-200">{selectedFarm?.soilType ?? metrics?.soilType ?? 'Alluvial'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                            <span>Last Irrigation:</span>
                            <span className="text-slate-200">{selectedFarm?.lastIrrigation ?? metrics?.lastIrrigation ?? '12h ago'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* HEALTH TAB: Circular progress indicator for AI confidence and metric gauges */}
                  {activeTab === 'health' && (
                    <motion.div
                      key="health-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/1">
                        {/* Circular Progress */}
                        <div className="relative flex items-center justify-center shrink-0">
                          <svg className="h-16 w-16 transform -rotate-90">
                            <circle cx="32" cy="32" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                            <motion.circle 
                              cx="32" 
                              cy="32" 
                              r={radius} 
                              fill="transparent" 
                              stroke="#10b981" 
                              strokeWidth="4"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset: circumference - (parseFloat(metrics?.confidence ?? 95) / 100) * circumference }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </svg>
                          <span className="absolute text-xs font-black text-slate-100 font-mono">{metrics?.confidence ?? 95}%</span>
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="font-bold text-slate-200 text-xs">AI Inference Confidence</h4>
                          <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                            Calculated using Sentinel-2 reflectance indices coupled with active edge soil hygrometer telemetry.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-400">
                        <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                          <span>Health Score:</span>
                          <span className="text-slate-200 font-bold font-mono text-sm">{metrics?.healthScore ?? 75}/100</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                          <span>Risk Profile:</span>
                          <span className={`font-black uppercase tracking-wider text-[9px] px-2 py-0.5 rounded border
                            ${metrics?.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                            ${metrics?.risk === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                            ${metrics?.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          `}>
                            {metrics?.risk ?? 'Low'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* RECOMMENDATION TAB: Explainability dashboard list */}
                  {activeTab === 'recommendation' && (
                    <motion.div
                      key="reco-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/2 space-y-1">
                        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">AI Irrigation Recommendation</span>
                        <p className="text-[13px] text-slate-200 font-bold leading-relaxed">
                          {metrics?.recommendation ?? 'No recommendation logged.'}
                        </p>
                      </div>

                      {/* Explainability checkpoints */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider block">Explainability ("Why?")</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-400">
                          {(metrics?.explanation || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 p-2 rounded bg-white/1 border border-white/3">
                              {item?.status === 'pass' && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              )}
                              {item?.status === 'warn' && (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                              )}
                              {item?.status === 'fail' && (
                                <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                              )}
                              <span className="truncate">{item?.text ?? 'Check passed'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Plan & Expected Impact */}
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Action Plan</span>
                          <p className="text-[11px] text-slate-300 leading-normal">{metrics?.actionPlan ?? 'Standby'}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Expected Impact</span>
                          <p className="text-[11px] text-slate-300 leading-normal">{metrics?.expectedImpact ?? 'No impact logged.'}</p>
                        </div>
                      </div>

                      {/* Water & Cost Savings */}
                      <div className="text-xs font-semibold text-slate-400 pt-2 border-t border-white/5 flex flex-col gap-1 select-none">
                        <div className="flex justify-between">
                          <span>Estimated Water Saving:</span>
                          <span className="text-teal-400 font-black font-mono">{metrics?.waterSaving ?? '0 Litres'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Cost Saving:</span>
                          <span className="text-emerald-400 font-black font-mono">{metrics?.costSaving ?? '₹0 Saved'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* HISTORY TAB: Local audit timeline scans */}
                  {activeTab === 'history' && (
                    <motion.div
                      key="history-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-3"
                    >
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Local Field Diagnostics Log</span>
                      <div className="space-y-2">
                        {(metrics?.localHistory || []).map((log) => (
                          <div 
                            key={log.id}
                            className="p-3 rounded-xl border border-white/5 bg-white/1 flex items-center justify-between text-xs transition-colors hover:bg-white/2 cursor-default"
                          >
                            <div className="flex items-center gap-3 text-slate-300 font-semibold">
                              <div className={`p-2 rounded-lg border shrink-0
                                ${log.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                                ${log.status === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : ''}
                                ${log.status === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                              `}>
                                <Activity className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <p className="text-slate-200">{log?.event ?? 'Audit'}</p>
                                <p className="text-[9.5px] text-slate-500 font-bold font-mono">{log?.time ?? '1h ago'}</p>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-slate-400">{log?.result ?? 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Operational Status details footer */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5 select-none mt-3">
                <div className="text-center">
                  <p className="text-[8.5px] text-slate-500 font-black uppercase tracking-wider">Sat Index</p>
                  <p className="text-[11px] font-black font-mono mt-0.5 text-slate-200">
                    {metrics?.saturationIndex ?? selectedFarm?.moisture ?? '0%'}
                  </p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[8.5px] text-slate-500 font-black uppercase tracking-wider">Valve Status</p>
                  <p className="text-[10px] font-black text-cyan-400 mt-0.5 truncate px-0.5 uppercase tracking-wide">
                    {(metrics?.valveStatus || 'Closed')?.split(' ')?.[0] || 'Closed'}
                  </p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[8.5px] text-slate-500 font-black uppercase tracking-wider">Sensor Net</p>
                  <p className="text-[10px] font-black text-slate-300 mt-0.5 truncate px-0.5 uppercase tracking-wide">
                    {(metrics?.sensorNetwork || '98% Active')?.split(' ')?.[0] || '100%'}
                  </p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[8.5px] text-slate-500 font-black uppercase tracking-wider">Water Stress</p>
                  <p className={`text-[10px] font-black mt-0.5 truncate px-0.5 uppercase tracking-wide
                    ${(metrics?.waterStress || 'Low')?.includes('Optimal') ? 'text-emerald-400' : (metrics?.waterStress || 'Low')?.includes('Moderate') ? 'text-amber-400' : 'text-rose-400'}
                  `}>
                    {(metrics?.waterStress || 'Low')?.split(' ')?.[0] || 'Low'}
                  </p>
                </div>
              </div>

            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

export default AgriXDecisionCenter
