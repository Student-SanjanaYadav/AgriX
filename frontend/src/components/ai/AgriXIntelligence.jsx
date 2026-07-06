import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BrainCircuit, 
  Leaf, 
  Droplets, 
  Cpu, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Zap,
  Target,
  Sparkles
} from 'lucide-react'

const AgriXIntelligence = ({ selectedFarm }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Empty State: rendered if no farm has been selected on the map yet
  if (!selectedFarm) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center select-none min-h-[450px] relative w-full h-full overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/5 text-blue-400 border border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-4"
        >
          <BrainCircuit className="h-8 w-8" />
        </motion.div>
        
        <h3 className="text-slate-200 font-bold text-sm tracking-wide">Awaiting Target Asset</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
          Select a precision field polygon on the geospatial map to initiate Edge AI telemetry and soil diagnostics.
        </p>
      </div>
    )
  }

  // Derive detailed AI metrics based on selected farm attributes
  const getAIMetrics = (farm) => {
    switch (farm.status) {
      case 'healthy':
        return {
          healthPercentage: 86,
          ndvi: '0.78',
          waterStress: 'Low (Optimal)',
          recommendation: 'Hold Irrigation. VWC Saturation targets met.',
          saving: '28%',
          confidence: '98.2%',
          priority: 'Low',
          priorityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          strokeColor: '#10b981', // emerald-500
          summary: 'Field vegetation displays high chlorophyll concentration and optimized moisture index. Transpiration demands are normal. Irrigation hold is advised for the next 24 hours to prevent nutrient runoff.'
        }
      case 'moderate':
        return {
          healthPercentage: 54,
          ndvi: '0.48',
          waterStress: 'Moderate Dehydration',
          recommendation: 'Pulse Irrigation (12 mins, Scheduled at 4 PM).',
          saving: '15%',
          confidence: '94.6%',
          priority: 'Medium',
          priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          strokeColor: '#f59e0b', // amber-500
          summary: 'Moderate moisture deficit identified in shallow root zones. Weather forecasts indicate rising temperatures. Short-duration pulse valving is recommended to maintain nominal volumetric saturation.'
        }
      case 'critical':
      default:
        return {
          healthPercentage: 28,
          ndvi: '0.24',
          waterStress: 'Severe Crop Stress',
          recommendation: 'Trigger High-Flow Hydration Override immediately.',
          saving: '8%',
          confidence: '97.8%',
          priority: 'HIGH',
          priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse',
          strokeColor: '#ef4444', // rose-500
          summary: 'Critical soil dehydration anomalies verified. VWC has collapsed past warning thresholds (30%). High priority valving override is required immediately to mitigate yield degradation risks.'
        }
    }
  }

  const ai = getAIMetrics(selectedFarm)
  const circumference = 2 * Math.PI * 26 // Radius is 26, C = 163.36
  const strokeOffset = circumference - (circumference * ai.healthPercentage) / 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex flex-col justify-between relative w-full h-full overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-1.5">
              AgriX Intelligence
            </h3>
            <p className="text-[10px] text-slate-400">Target: {selectedFarm.id}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-inner">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
          </span>
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Edge AI Active</span>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="space-y-4 flex-1">
        
        {/* Core Farm Metadata */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-white/2 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Crop</span>
            <p className="font-semibold text-slate-200 text-xs mt-0.5 truncate">{selectedFarm.crop}</p>
          </div>
          <div className="p-2 rounded bg-white/2 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Area</span>
            <p className="font-semibold text-slate-200 text-xs mt-0.5">{selectedFarm.area} ha</p>
          </div>
          <div className="p-2 rounded bg-white/2 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Moisture</span>
            <p className="font-semibold text-cyan-400 text-xs mt-0.5 flex items-center gap-0.5">
              <Droplets className="h-3.5 w-3.5 shrink-0" />
              {selectedFarm.moisture}
            </p>
          </div>
        </div>

        {/* Health Progress Indicator & NDVI Stats */}
        <div className="flex items-center gap-6 p-3 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden">
          {/* Animated circular SVG progress */}
          <div className="relative flex h-18 w-18 shrink-0 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="4.5"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                fill="transparent"
                stroke={ai.strokeColor}
                strokeWidth="4.5"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-slate-200">{ai.healthPercentage}%</span>
          </div>

          {/* Health index details */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Crop Health Matrix</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-200">NDVI Score:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{ai.ndvi}</span>
            </div>
            <p className="text-[10px] text-slate-400">Vegetation density index rating.</p>
          </div>
        </div>

        {/* Parameter Details Matrix */}
        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div>
            <span className="text-slate-500 text-[10px]">Water Stress:</span>
            <p className={`font-semibold mt-0.5
              ${selectedFarm.status === 'healthy' ? 'text-emerald-400' : selectedFarm.status === 'moderate' ? 'text-amber-400' : 'text-rose-400'}
            `}>
              {ai.waterStress}
            </p>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Estimated Water Saving:</span>
            <p className="font-semibold text-teal-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              +{ai.saving} Saved
            </p>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">AI Model Confidence:</span>
            <p className="font-semibold text-blue-400 mt-0.5 font-mono">{ai.confidence}</p>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Priority Level:</span>
            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-0.5 ${ai.priorityColor}`}>
              {ai.priority}
            </span>
          </div>
        </div>

        {/* Selected Field Summary Panel */}
        <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Selected Field Summary
          </span>
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div className="flex justify-between pr-4 border-r border-white/5">
              <span className="text-slate-500">Farm ID:</span>
              <span className="font-semibold text-slate-200 font-mono">{selectedFarm.id}</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-slate-500">Crop:</span>
              <span className="font-semibold text-slate-200">{selectedFarm.crop}</span>
            </div>
            <div className="flex justify-between pr-4 border-r border-white/5 pt-1">
              <span className="text-slate-500">District:</span>
              <span className="font-semibold text-slate-200">{selectedFarm.name ? selectedFarm.name.split(' ')[0] : 'N/A'}</span>
            </div>
            <div className="flex justify-between pl-4 pt-1">
              <span className="text-slate-500">Area:</span>
              <span className="font-semibold text-slate-200">{selectedFarm.area} ha</span>
            </div>
            <div className="col-span-2 flex justify-between border-t border-white/5 pt-2 mt-1">
              <span className="text-slate-500">Health:</span>
              <span className={`font-bold capitalize
                ${selectedFarm.status === 'healthy' ? 'text-emerald-400' : selectedFarm.status === 'moderate' ? 'text-amber-400' : 'text-rose-400'}
              `}>
                {selectedFarm.status}
              </span>
            </div>
          </div>
        </div>

        {/* AI Irrigation Recommendation Block */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/15 to-indigo-500/5 border border-blue-500/20 shadow-md">
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            AI Decision recommendation
          </span>
          <p className="text-xs font-semibold text-slate-200 mt-1">{ai.recommendation}</p>
        </div>

      </div>

      {/* Expandable AI Analysis Summary */}
      <div className="mt-4 border-t border-white/5 pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors focus:outline-none select-none"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            AI Analysis Summary
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed bg-white/2 border border-white/5 p-3 rounded-lg font-sans">
                {ai.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AgriXIntelligence
