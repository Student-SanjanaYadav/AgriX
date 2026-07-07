import React from 'react'
import { motion } from 'framer-motion'
import { Droplet, ToggleLeft, Video, CheckCircle } from 'lucide-react'

const OperationalMetrics = ({ selectedFarm }) => {
  // Global defaults
  const defaultMetrics = [
    {
      id: 'saturation',
      label: 'Saturation Index',
      value: 'Optimal (Avg)',
      subtext: 'Volumetric water saturation',
      icon: Droplet,
      iconColor: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'valve',
      label: 'Valve Status',
      value: 'Automatic Control',
      subtext: '8 active valve zones',
      icon: ToggleLeft,
      iconColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'coverage',
      label: 'Satellite Coverage',
      value: '100% Monitored',
      subtext: 'Daily orbital scan resolution',
      icon: Video,
      iconColor: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'sensors',
      label: 'Sensors Status',
      value: 'All Systems Normal',
      subtext: '48 core sensors telemetry',
      icon: CheckCircle,
      iconColor: 'text-emerald-400 bg-emerald-500/10'
    }
  ]

  // Selected farm metrics
  const getSelectedMetrics = (farm) => {
    switch (farm.status) {
      case 'healthy':
        return [
          {
            id: 'saturation',
            label: 'Saturation Index',
            value: 'Optimal (68%)',
            subtext: 'Target profile bounds met',
            icon: Droplet,
            iconColor: 'text-emerald-400 bg-emerald-500/10'
          },
          {
            id: 'valve',
            label: 'Valve Status',
            value: 'CLOSED (Bypass Hold)',
            subtext: 'Auto valving hold active',
            icon: ToggleLeft,
            iconColor: 'text-slate-400 bg-slate-500/10'
          },
          {
            id: 'coverage',
            label: 'Satellite Coverage',
            value: '100% Cloudless',
            subtext: 'Sentinel-2 precision map',
            icon: Video,
            iconColor: 'text-indigo-400 bg-indigo-500/10'
          },
          {
            id: 'sensors',
            label: 'Sensors Status',
            value: 'Online (100%)',
            subtext: '4 local sensor nodes',
            icon: CheckCircle,
            iconColor: 'text-emerald-400 bg-emerald-500/10'
          }
        ]
      case 'moderate':
        return [
          {
            id: 'saturation',
            label: 'Saturation Index',
            value: 'Moderate (47%)',
            subtext: 'Slight moisture depletion',
            icon: Droplet,
            iconColor: 'text-amber-400 bg-amber-500/10'
          },
          {
            id: 'valve',
            label: 'Valve Status',
            value: 'STANDBY (Timer)',
            subtext: 'Scheduled for 12m pulse',
            icon: ToggleLeft,
            iconColor: 'text-amber-400 bg-amber-500/10 animate-pulse'
          },
          {
            id: 'coverage',
            label: 'Satellite Coverage',
            value: '95% Visible',
            subtext: 'Light cloud cover overlay',
            icon: Video,
            iconColor: 'text-indigo-400 bg-indigo-500/10'
          },
          {
            id: 'sensors',
            label: 'Sensors Status',
            value: 'Online - Warning',
            subtext: 'Node #3 signal latency',
            icon: CheckCircle,
            iconColor: 'text-amber-400 bg-amber-500/10'
          }
        ]
      case 'critical':
      default:
        return [
          {
            id: 'saturation',
            label: 'Saturation Index',
            value: 'Critical Dry (28%)',
            subtext: 'Volumetric threshold alert',
            icon: Droplet,
            iconColor: 'text-rose-400 bg-rose-500/10 animate-pulse'
          },
          {
            id: 'valve',
            label: 'Valve Status',
            value: 'OPEN (Emergency)',
            subtext: 'High flow rate override',
            icon: ToggleLeft,
            iconColor: 'text-rose-400 bg-rose-500/10'
          },
          {
            id: 'coverage',
            label: 'Satellite Coverage',
            value: 'Anomalous Scan',
            subtext: 'Thermal dry spot warning',
            icon: Video,
            iconColor: 'text-rose-400 bg-rose-500/10'
          },
          {
            id: 'sensors',
            label: 'Sensors Status',
            value: 'Telemetry Warning',
            subtext: 'Dry soil threshold alarm',
            icon: CheckCircle,
            iconColor: 'text-rose-400 bg-rose-500/10'
          }
        ]
    }
  }

  const activeMetrics = selectedFarm ? getSelectedMetrics(selectedFarm) : defaultMetrics

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {activeMetrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3.5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between gap-4 cursor-default select-none hover:bg-white/4 hover:border-white/10 transition-all duration-200"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-[11px] text-slate-500 uppercase font-black tracking-wider block mb-1">{metric.label}</span>
              <p className="text-base font-black text-slate-100 leading-tight">{metric.value}</p>
              <p className="text-xs text-slate-400 font-semibold truncate max-w-[130px]">{metric.subtext}</p>
            </div>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 ${metric.iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default OperationalMetrics
