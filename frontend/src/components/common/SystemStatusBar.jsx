import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { 
  BrainCircuit, 
  Orbit, 
  Activity, 
  CloudSun, 
  Clock 
} from 'lucide-react'

const SystemStatusBar = ({ selectedFarm }) => {
  const { t } = useLanguage()
  const [timestamp, setTimestamp] = useState('N/A')

  useEffect(() => {
    if (selectedFarm) {
      // Set timestamp to the current local time of selection
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setTimestamp(`${timeStr}`)
    } else {
      setTimestamp('N/A (Awaiting Selection)')
    }
  }, [selectedFarm])

  return (
    <div className="w-full px-6 py-3 rounded-xl border border-white/5 bg-[#050816]/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 select-none mb-6">
      {/* Left side: System Subcomponents */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
        
        {/* Edge AI Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <BrainCircuit className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium">{t("Edge AI Online")}</span>
        </div>

        {/* Satellite Sync */}
        <div className="flex items-center gap-2">
          <Orbit className="h-4 w-4 text-emerald-400 animate-spin-slow shrink-0" />
          <span className="font-medium text-slate-300">{t("Satellite Sync Active")}</span>
        </div>

        {/* Sensors Telemetry */}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{t("Sensors Active (100%)")}</span>
        </div>

        {/* Weather Sync */}
        <div className="flex items-center gap-2">
          <CloudSun className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{t("Weather Synced")}</span>
        </div>

      </div>

      {/* Right side: Dynamic Analysis Timestamp */}
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
        <Clock className="h-4 w-4 text-blue-400 shrink-0 animate-pulse" />
        <span>{t("Last AI Analysis:")}</span>
        <motion.span 
          key={timestamp}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md"
        >
          {timestamp}
        </motion.span>
      </div>
    </div>
  )
}

export default SystemStatusBar
