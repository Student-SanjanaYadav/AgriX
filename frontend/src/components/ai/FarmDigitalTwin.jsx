import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Calendar, 
  Leaf, 
  Droplets, 
  Waves, 
  Activity, 
  Compass,
  Layers,
  Shield,
  Sprout,
  TrendingUp,
  Cpu,
  FileText
} from 'lucide-react'

// Stepped Crop Lifecycle Progression Timeline Component
const CropLifecycleProgress = ({ currentStage }) => {
  const stages = ['Seedling', 'Vegetative', 'Flowering', 'Harvest']
  
  // Resolve active index mapping (supports substring matching, e.g. "Vegetative Growth" -> "Vegetative")
  const activeIndex = stages.findIndex(stage => 
    currentStage.toLowerCase().includes(stage.toLowerCase())
  )

  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-white/1 select-none">
      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-3 text-left">Crop Lifecycle Timeline</span>
      <div className="flex items-center justify-between relative mt-2">
        {/* Connection Background bar */}
        <div className="absolute top-[13px] left-2 right-2 h-[2px] bg-white/5 z-0" />
        
        {/* Dynamic completed progress bar */}
        <div 
          className="absolute top-[13px] left-2 h-[2px] bg-emerald-500/60 z-0 transition-all duration-500"
          style={{ width: `${activeIndex >= 0 ? (activeIndex / (stages.length - 1)) * 96 : 0}%` }}
        />

        {stages.map((stage, idx) => {
          const isActive = idx === activeIndex
          const isPassed = idx < activeIndex

          return (
            <div key={stage} className="flex flex-col items-center z-10 relative">
              <div 
                className={`h-7 w-7 rounded-full border flex items-center justify-center text-[10px] font-black font-mono transition-all duration-300
                  ${isActive 
                    ? 'bg-emerald-500 text-[#050816] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110' 
                    : isPassed 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                      : 'bg-[#090d26] text-slate-600 border-white/5'
                  }
                `}
              >
                {idx + 1}
              </div>
              <span 
                className={`text-[9px] mt-1.5 font-black uppercase tracking-wider transition-colors
                  ${isActive ? 'text-emerald-400 font-extrabold' : 'text-slate-500'}
                `}
              >
                {stage}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FarmDigitalTwin = ({ selectedFarm, metrics }) => {
  if (!selectedFarm || !metrics) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center select-none min-h-[480px] relative w-full h-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-4"
        >
          <Layers className="h-8 w-8" />
        </motion.div>
        
        <h3 className="text-slate-200 font-bold text-sm tracking-wide font-sans">Awaiting Twin Scan</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
          Select a field polygon on the map to initialize the 3D-linked Farm Digital Twin profiles.
        </p>
      </div>
    )
  }

  const seed = selectedFarm.id.charCodeAt(0) + selectedFarm.id.charCodeAt(1)
  const fallbackFarmerNames = ['Amit Sharma', 'Ramesh Patel', 'Suresh Reddy', 'Vikram Singh', 'Kiran Das']
  const fallbackFarmerName = fallbackFarmerNames[seed % fallbackFarmerNames.length]
  const fallbackWaterSources = ['Canal Gravity Feed', 'Tube Well', 'River Lift System']
  const fallbackWaterSource = fallbackWaterSources[seed % fallbackWaterSources.length]
  const fallbackSoilTypes = ['Clay Loam', 'Sandy Loam', 'Alluvial Silt', 'Black Cotton Soil']
  const fallbackSoilType = fallbackSoilTypes[seed % fallbackSoilTypes.length]
  const fallbackLastIrrigation = selectedFarm.status === 'healthy' ? '12h ago' : selectedFarm.status === 'moderate' ? '18h ago' : '36h ago'

  const farmerName = selectedFarm.farmerName || fallbackFarmerName
  const village = selectedFarm.village || `${selectedFarm.name.split(' Field')[0]}`
  const soilType = selectedFarm.soilType || fallbackSoilType
  const waterSource = selectedFarm.waterSource || fallbackWaterSource
  const lastIrrigation = selectedFarm.lastIrrigation || fallbackLastIrrigation
  const growthStage = selectedFarm.growthStage || metrics.growthStage || 'Vegetative'
  const irrigationMethod = selectedFarm.irrigationMethod || 'Drip Irrigation'
  const createdDate = selectedFarm.createdDate || '2024-04-10'

  return (
    <div className="glass-panel p-6 flex flex-col justify-between relative w-full h-full min-h-[480px] overflow-hidden select-none text-left">
      <div className="space-y-5">
        
        {/* 1. Identity Header Section */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Compass className="h-7 w-7 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-black text-slate-100 text-sm truncate">
              {village} Digital Twin
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="text-[10px] text-slate-400 font-bold truncate">
                {selectedFarm?.district ?? 'Unknown'}, {selectedFarm?.state ?? 'India'}
              </span>
            </div>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border shrink-0
            ${selectedFarm?.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)]' : ''}
            ${selectedFarm?.status === 'moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
            ${selectedFarm?.status === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}
          `}>
            ● {selectedFarm?.status ?? 'healthy'}
          </span>
        </div>

        {/* 2. Stepped Crop Lifecycle Progression */}
        <CropLifecycleProgress currentStage={growthStage} />

        {/* Grouped Profiles Breakdown Section */}
        <div className="space-y-4 pt-1">
          
          {/* Group A: Farm & Soil Profile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Farmer Operator</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{farmerName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Field Area</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Layers className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-mono">{selectedFarm?.area ?? '0.0'} Hectares</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Soil Profile</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{soilType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">NDVI Reflectance</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Leaf className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{selectedFarm?.ndvi || '0.74'}</span>
              </div>
            </div>
          </div>

          {/* Group B: Water Profile */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Water Supply</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Waves className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="truncate">{waterSource}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Irrigation Method</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Droplets className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">{irrigationMethod}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Last Irrigation</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{lastIrrigation}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Registered On</span>
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{createdDate}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Farm Snapshot summary card */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-2.5 select-none text-xs">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Telemetry Snapshot</span>
          
          <div className="grid grid-cols-2 gap-3 font-semibold text-slate-400">
            <div className="flex items-center justify-between border-b border-white/2 pb-1.5">
              <span>Status:</span>
              <span className={`font-black capitalize ${selectedFarm?.status === 'healthy' ? 'text-emerald-400' : selectedFarm?.status === 'moderate' ? 'text-amber-400' : 'text-rose-400'}`}>{selectedFarm?.status ?? 'healthy'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/2 pb-1.5">
              <span>Water Demand:</span>
              <span className="text-slate-200 font-black">{metrics.waterReq}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Confidence:</span>
              <span className="text-emerald-400 font-black font-mono">{metrics.confidence}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Health Rating:</span>
              <span className="text-slate-200 font-black font-mono">{metrics.healthScore}/100</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tiny sync footer */}
      <div className="text-[9px] text-slate-500 font-black uppercase border-t border-white/5 pt-3 select-none flex justify-between mt-3">
        <span>Twin Sync: Realtime</span>
        <span>ID: {selectedFarm?.id ?? 'N/A'}</span>
      </div>
    </div>
  )
}

export default FarmDigitalTwin
