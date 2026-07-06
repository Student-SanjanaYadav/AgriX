import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sliders, 
  Orbit, 
  Cpu, 
  Bell, 
  ShieldCheck, 
  Save 
} from 'lucide-react'

const SettingsPage = () => {
  const [satelliteSync, setSatelliteSync] = useState('hourly')
  const [notifications, setNotifications] = useState(true)

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
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">AgriX System Settings</h2>
          <p className="text-sm text-slate-400">Configure edge sensor parameters, satellite telemetry schedules, and alerts.</p>
        </div>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Calibration Categories (Glass card taking 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Evaporation Calibration */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">Moisture Threshold Calibration</h3>
                <p className="text-[10px] text-slate-400">Adjust volumetric water content (VWC) margins</p>
              </div>
            </div>

            {/* Slider items */}
            <div className="space-y-5 text-xs font-semibold">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Volumetric Dehydration Warning Limit</span>
                  <span className="text-blue-400 font-mono">35% VWC</span>
                </div>
                <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500" defaultValue="35" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Override Overflow Limit</span>
                  <span className="text-rose-400 font-mono">20% VWC</span>
                </div>
                <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-rose-500" defaultValue="20" />
              </div>
            </div>
          </div>

          {/* Sync frequency card */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Orbit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">Satellite Telemetry Intervals</h3>
                <p className="text-[10px] text-slate-400">Schedule Sentinel orbital scanning sweeps</p>
              </div>
            </div>

            {/* Radio selections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
              <label className={`p-4 rounded-xl border flex flex-col justify-between h-20 cursor-pointer select-none transition-all duration-200
                ${satelliteSync === 'hourly' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' : 'bg-white/1 border-white/5 text-slate-400 hover:bg-white/3'}
              `}>
                <input type="radio" name="sync" className="hidden" onClick={() => setSatelliteSync('hourly')} />
                <span className="text-[10px] uppercase font-bold tracking-wide">High-Flow Realtime</span>
                <span className="text-lg font-bold text-slate-200 font-mono mt-1">Hourly Sync</span>
              </label>

              <label className={`p-4 rounded-xl border flex flex-col justify-between h-20 cursor-pointer select-none transition-all duration-200
                ${satelliteSync === 'daily' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' : 'bg-white/1 border-white/5 text-slate-400 hover:bg-white/3'}
              `}>
                <input type="radio" name="sync" className="hidden" onClick={() => setSatelliteSync('daily')} />
                <span className="text-[10px] uppercase font-bold tracking-wide">Standard evals</span>
                <span className="text-lg font-bold text-slate-200 font-mono mt-1">Daily Sync</span>
              </label>

              <label className={`p-4 rounded-xl border flex flex-col justify-between h-20 cursor-pointer select-none transition-all duration-200
                ${satelliteSync === 'weekly' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' : 'bg-white/1 border-white/5 text-slate-400 hover:bg-white/3'}
              `}>
                <input type="radio" name="sync" className="hidden" onClick={() => setSatelliteSync('weekly')} />
                <span className="text-[10px] uppercase font-bold tracking-wide">Low evals</span>
                <span className="text-lg font-bold text-slate-200 font-mono mt-1">Weekly Sync</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Alerts and Subsystem Actions (Glass card taking 1 column) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">Subsystem Status</h3>
                <p className="text-[10px] text-slate-400">Control active Edge AI alarms</p>
              </div>
            </div>

            {/* Config toggles */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400">Evaporation alerts</span>
                </div>
                <input type="checkbox" className="w-8 h-4 bg-white/5 checked:bg-blue-500 accent-blue-500 rounded-full cursor-pointer" defaultChecked={notifications} onChange={() => setNotifications(!notifications)} />
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400">Telemetry safety override</span>
                </div>
                <input type="checkbox" className="w-8 h-4 bg-white/5 checked:bg-blue-500 accent-blue-500 rounded-full cursor-pointer" defaultChecked />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 shadow-md transition-all duration-200 select-none">
                <Save className="h-4 w-4" /> Save System Config
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default SettingsPage
