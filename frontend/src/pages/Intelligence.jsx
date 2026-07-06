import React from 'react'
import { motion } from 'framer-motion'
import { 
  BrainCircuit, 
  Cpu, 
  Database, 
  Radio, 
  Sparkles
} from 'lucide-react'

const Intelligence = () => {
  const models = [
    {
      name: 'AgriX-NDVI-v4',
      type: 'Geospatial Vision Transformer',
      status: 'Active',
      latency: '24ms',
      precision: '98.6%',
      desc: 'Processes satellite imagery from Sentinel-2 & Landsat-8 in 10-meter resolution grids, dynamically extracting vegetation profiles and dry-spot coordinates.'
    },
    {
      name: 'HydraFlow-Irrigation-Predictor',
      type: 'Gradient Boosted Decision Forest',
      status: 'Active',
      latency: '12ms',
      precision: '96.4%',
      desc: 'Models volumetric water contents, evaporation curves, and soil profiles to recommend high-precision irrigation zones and valve override instructions.'
    },
    {
      name: 'WeatherSense-Climate-Anomaly-Detector',
      type: 'LSTM Neural Network',
      status: 'Active',
      latency: '36ms',
      precision: '95.2%',
      desc: 'Analyzes pressure thresholds, microclimate fluctuations, and humidity patterns to predict crop dehydration warnings and precipitation events.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">AgriX Intelligence System</h2>
          <p className="text-sm text-slate-400">Manage active Edge AI neural networks, satellite vision algorithms, and telemetry inference logs.</p>
        </div>
      </div>

      {/* Grid of models */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {models.map((model, idx) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{model.name}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{model.type}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[72px]">
                {model.desc}
              </p>

              {/* Model Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold pt-2">
                <div className="p-2 rounded border border-white/5 bg-white/1 flex items-center justify-between">
                  <span className="text-slate-500">Inference Latency:</span>
                  <span className="font-mono text-cyan-400">{model.latency}</span>
                </div>
                <div className="p-2 rounded border border-white/5 bg-white/1 flex items-center justify-between">
                  <span className="text-slate-500">Model Precision:</span>
                  <span className="font-mono text-emerald-400">{model.precision}</span>
                </div>
              </div>
            </div>

            {/* Bottom calibration indicators */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deploy Mode: Production</span>
              </div>
              <button className="px-2.5 py-1 text-[9px] font-bold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white rounded-md transition-all duration-200">
                Calibrate Model
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edge telemetry system stats */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">National Edge Inference Gateway</h4>
            <p className="text-xs text-slate-400">Calibrated telemetry streams synced with 15 state hubs across India.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 border border-white/5 bg-white/2 px-3.5 py-2 rounded-xl">
            <Radio className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-400">Total Nodes:</span>
            <span className="text-slate-200 font-mono">1,480 Active</span>
          </div>
          <div className="flex items-center gap-2 border border-white/5 bg-white/2 px-3.5 py-2 rounded-xl">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-slate-400">Daily Scans:</span>
            <span className="text-slate-200 font-mono">4.2 TB Processed</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Intelligence
