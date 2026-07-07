import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Droplets, Grid, Activity } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const KPICards = ({ selectedFarm }) => {
  const { t } = useLanguage()
  // Global aggregate averages (Default State)
  const defaultKPIs = [
    {
      id: 'crop',
      label: 'Cultivated Crop',
      value: 'Multi-Crop Network',
      subtext: 'Sugarcane, Wheat, Cotton, Rice',
      icon: Leaf,
      iconColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'health',
      label: 'Average Crop Health',
      value: '72%',
      subtext: 'NDVI Score 0.61 (Healthy)',
      icon: Activity,
      iconColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'moisture',
      label: 'Volumetric Soil Moisture',
      value: '51.8%',
      subtext: 'Nominal VWC Saturation',
      icon: Droplets,
      iconColor: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'area',
      label: 'Total Field Area',
      value: '124.8 ha',
      subtext: '15 Active Districts Monitored',
      icon: Grid,
      iconColor: 'text-blue-400 bg-blue-500/10'
    }
  ]

  // Derived selected farm values
  const getSelectedKPIs = (farm) => {
    const status = farm?.status ?? 'healthy'
    const id = farm?.id ?? 'N/A'
    const crop = farm?.crop ?? 'Unknown Crop'
    const moisture = farm?.moisture ?? '0%'
    const area = farm?.area ?? '0.0'

    let ndviText = 'NDVI 0.78 (Optimal)'
    let healthText = '86%'
    if (status === 'moderate') {
      healthText = '54%'
      ndviText = 'NDVI 0.48 (Deficit)'
    } else if (status === 'critical') {
      healthText = '28%'
      ndviText = 'NDVI 0.24 (Critical)'
    }

    return [
      {
        id: 'crop',
        label: 'Selected Asset Crop',
        value: crop,
        subtext: `Asset Target: ${id}`,
        icon: Leaf,
        iconColor: 'text-emerald-400 bg-emerald-500/10'
      },
      {
        id: 'health',
        label: 'Asset Crop Health',
        value: healthText,
        subtext: ndviText,
        icon: Activity,
        iconColor: 
          status === 'healthy' 
            ? 'text-emerald-400 bg-emerald-500/10' 
            : status === 'moderate' 
              ? 'text-amber-400 bg-amber-500/10' 
              : 'text-rose-400 bg-rose-500/10'
      },
      {
        id: 'moisture',
        label: 'Field VWC Moisture',
        value: moisture,
        subtext: 'Deep Sensor Core Saturation',
        icon: Droplets,
        iconColor: 'text-cyan-400 bg-cyan-500/10'
      },
      {
        id: 'area',
        label: 'Field Size Coverage',
        value: `${area} ha`,
        subtext: 'Direct High-Resolution Boundary',
        icon: Grid,
        iconColor: 'text-blue-400 bg-blue-500/10'
      }
    ]
  }

  const activeKPIs = selectedFarm ? getSelectedKPIs(selectedFarm) : defaultKPIs
  const statusColor = selectedFarm?.status

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
      {activeKPIs.map((kpi, idx) => {
        const Icon = kpi.icon
        
        let cardBorderClass = 'border-white/5 bg-white/2 hover:bg-white/4'
        if (selectedFarm) {
          if (statusColor === 'healthy') {
            cardBorderClass = 'border-emerald-500/20 bg-emerald-500/3 hover:bg-emerald-500/6 shadow-[0_4px_25px_rgba(16,185,129,0.06)]'
          } else if (statusColor === 'moderate') {
            cardBorderClass = 'border-amber-500/20 bg-amber-500/3 hover:bg-amber-500/6 shadow-[0_4px_25px_rgba(245,158,11,0.06)]'
          } else if (statusColor === 'critical') {
            cardBorderClass = 'border-rose-500/20 bg-rose-500/3 hover:bg-rose-500/6 shadow-[0_4px_25px_rgba(239,68,68,0.06)]'
          }
        }

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.025, translateY: -3 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className={`p-6 min-h-[125px] rounded-2xl border backdrop-blur-md transition-all duration-300 flex items-center justify-between cursor-default ${cardBorderClass}`}
          >
            {/* KPI Details */}
            <div className="space-y-2 text-left flex-1 min-w-0 mr-3">
              <span className="text-xs text-slate-400 uppercase font-black tracking-wider block mb-1">
                {t(kpi.id === 'crop' ? 'Active Crop' : kpi.id === 'health' ? 'Crop Health' : kpi.id === 'moisture' ? 'Soil Moisture' : kpi.id === 'area' ? 'Field Area' : kpi.label)}
              </span>
              
              <motion.p 
                key={kpi.value}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl md:text-4xl font-black tracking-tight text-slate-100 font-mono"
              >
                {kpi.value}
              </motion.p>
              
              <p className="text-sm text-slate-400 font-bold truncate">{t(kpi.subtext)}</p>
            </div>

            {/* KPI Icon bubble */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 shadow-inner transition-transform duration-300 hover:rotate-6 ${kpi.iconColor}`}>
              <Icon className="h-6 w-6" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default KPICards
