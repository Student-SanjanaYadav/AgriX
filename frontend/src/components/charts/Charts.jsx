import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'
import { Activity, Droplets, Leaf, Thermometer, CloudRain, Trash2, LineChart as LucideLine } from 'lucide-react'

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#090d26]/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md select-none text-xs">
        <p className="font-semibold text-slate-300">Day {label}</p>
        {payload.map((p, idx) => (
          <p key={idx} className="font-bold mt-1 flex items-center gap-1.5" style={{ color: p.color }}>
            <span>{p.name}: {p.value}{unit || p.unit || ''}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Charts = ({ selectedFarm }) => {
  const [activeChart, setActiveChart] = useState('moisture')

  // Generate 30-day telemetry dataset dynamically based on selected farm seed
  const chartData = useMemo(() => {
    const seed = selectedFarm ? selectedFarm.id.charCodeAt(0) + selectedFarm.id.charCodeAt(1) : 42
    const baseMoisture = selectedFarm ? parseFloat(selectedFarm.moisture) : 52
    const baseNdvi = selectedFarm ? parseFloat(selectedFarm.ndvi) : 0.74
    const baseTemp = selectedFarm?.status === 'healthy' ? 26 : selectedFarm?.status === 'moderate' ? 32 : 38

    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    
    return days.map((day) => {
      // Procedural noise offsets
      const mNoise = Math.sin(day * 0.9 + seed) * 4 + (day % 3 === 0 ? 1.5 : -1.5)
      const nNoise = Math.cos(day * 0.5 + seed) * 0.03 + (day % 4 === 0 ? 0.01 : -0.01)
      const tNoise = Math.sin(day * 1.2 + seed) * 2 + (day % 2 === 0 ? 1 : -1)
      const rainVal = Math.max(0, Math.sin(day * 2.1 + seed) * 12 - 4) // sparse rain events
      
      const waterUsed = rainVal > 5 ? 50 : Math.max(80, 240 - baseMoisture * 2.5 - Math.sin(day) * 30)

      return {
        day: day.toString(),
        moisture: Math.max(10, Math.min(100, Math.round(baseMoisture + mNoise))),
        ndvi: Math.max(0.1, Math.min(1.0, parseFloat((baseNdvi + nNoise).toFixed(2)))),
        temp: Math.round(baseTemp + tNoise),
        rainfall: parseFloat(rainVal.toFixed(1)),
        waterUsage: Math.round(waterUsed),
        yieldPred: Math.min(100, Math.max(10, Math.round(75 + Math.sin(day * 0.3) * 10 + (baseNdvi * 15))))
      }
    })
  }, [selectedFarm?.id])

  const activeColor = useMemo(() => {
    const status = selectedFarm ? selectedFarm.status : 'healthy'
    const colors = {
      healthy: '#10b981', // emerald
      moderate: '#f59e0b', // amber
      critical: '#ef4444' // rose
    }
    return colors[status]
  }, [selectedFarm?.status])

  const chartTabs = [
    { id: 'moisture', label: 'Moisture (30d)', icon: Droplets, color: '#06b6d4', unit: '% VWC' },
    { id: 'ndvi', label: 'NDVI (30d)', icon: Leaf, color: '#10b981', unit: ' index' },
    { id: 'temp', label: 'Temp (30d)', icon: Thermometer, color: '#f59e0b', unit: '°C' },
    { id: 'rainWater', label: 'Rain & Water (30d)', icon: CloudRain, color: '#3b82f6', unit: '' },
    { id: 'yield', label: 'Yield Forecast (30d)', icon: LucideLine, color: '#8b5cf6', unit: '%' }
  ]

  const activeTabObj = chartTabs.find(t => t.id === activeChart)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-full rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 select-none gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Activity className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-slate-100 text-sm tracking-wider uppercase font-sans">Historical Telemetry</h3>
            <p className="text-[10px] text-slate-400 font-bold font-mono">
              {selectedFarm ? `Telemetry Node: ${selectedFarm.id}` : 'General Regional Averages'}
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs Selector */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {chartTabs.map((tab) => {
            const TabIcon = tab.icon
            const isSelected = activeChart === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0
                  ${isSelected
                    ? 'bg-white/5 border-white/10 text-slate-100 font-extrabold shadow-md'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                  }
                `}
                style={{ borderLeftColor: isSelected ? tab.color : 'transparent' }}
              >
                <TabIcon className="h-3.5 w-3.5" style={{ color: tab.color }} />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="flex-1 w-full h-[190px] mt-2 relative min-h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'moisture' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="% VWC" />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
              <Area type="monotone" name="Soil Moisture" dataKey="moisture" stroke="#06b6d4" strokeWidth={2} fill="url(#moistureGrad)" />
            </AreaChart>
          ) : activeChart === 'ndvi' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 1.0]} />
              <Tooltip content={<CustomTooltip unit=" index" />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
              <Area type="monotone" name="NDVI Index" dataKey="ndvi" stroke="#10b981" strokeWidth={2} fill="url(#ndviGrad)" />
            </AreaChart>
          ) : activeChart === 'temp' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 50]} />
              <Tooltip content={<CustomTooltip unit="°C" />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
              <Line type="monotone" name="Temperature" dataKey="temp" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : activeChart === 'rainWater' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#090d26]/95 border border-white/10 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-300">Day {label}</p>
                        <p className="text-blue-400 font-bold">Rainfall: {payload[0].value} mm</p>
                        <p className="text-cyan-400 font-bold">Water Used: {payload[1].value} Litres</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar name="Rainfall (mm)" dataKey="rainfall" fill="#3b82f6" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
              <Bar name="Water Used (L)" dataKey="waterUsage" fill="#06b6d4" fillOpacity={0.4} radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="%" />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
              <Line type="monotone" name="Yield Prob" dataKey="yieldPred" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default Charts
