import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  Sprout, 
  Droplets,
  Percent
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts'
import CompareFarms from '../components/analytics/CompareFarms'
const Analytics = () => {
  // Mock Crop distribution data for India-wide yields
  const cropYieldData = [
    { name: 'Wheat', yield: 450, color: '#3b82f6' },
    { name: 'Rice', yield: 520, color: '#10b981' },
    { name: 'Cotton', yield: 280, color: '#f59e0b' },
    { name: 'Sugarcane', yield: 640, color: '#8b5cf6' },
    { name: 'Mustard', yield: 190, color: '#ec4899' }
  ]

  const healthDistribution = [
    { name: 'Healthy', value: 72, color: '#10b981' },
    { name: 'Moderate', value: 20, color: '#f59e0b' },
    { name: 'Critical', value: 8, color: '#ef4444' }
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">National Analytics Engine</h2>
          <p className="text-sm text-slate-400">Deep telemetry breakdowns, crop yield indexation, and moisture maps.</p>
        </div>
      </div>

      {/* Row of stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Active Yield Index</span>
            <p className="text-2xl font-bold text-slate-100">2.08M MT</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +12.4% vs last season
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sprout className="h-5 w-5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Moisture Coverage</span>
            <p className="text-2xl font-bold text-slate-100">92.4%</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +2.8% Sensor Grid Up
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Droplets className="h-5 w-5" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Accuracy rating</span>
            <p className="text-2xl font-bold text-slate-100">97.8%</p>
            <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
              Precision calibrated (Sentinel-2)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crop distribution Yield Chart (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md flex flex-col justify-between h-[380px]">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">Crop Yield Indexes (Million Metric Tons)</h3>
              <p className="text-[10px] text-slate-400">Yield projections across monitored national zones</p>
            </div>
          </div>
          <div className="flex-1 w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropYieldData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d26]/95 border border-white/10 p-3 rounded-lg shadow-xl text-xs">
                          <p className="font-bold text-slate-200">{payload[0].name}</p>
                          <p className="text-blue-400 font-semibold mt-1">{payload[0].value} M MT</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="yield" radius={[4, 4, 0, 0]}>
                  {cropYieldData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health status distribution Pie Chart (1/3 width) */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md flex flex-col justify-between h-[380px]">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">Health Grid Distribution</h3>
              <p className="text-[10px] text-slate-400">National field ratios grouped by AI health rating</p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={healthDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} stroke={entry.color} strokeWidth={1.5} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d26]/95 border border-white/10 p-2.5 rounded-lg shadow-xl text-xs">
                          <p className="font-bold text-slate-200">{payload[0].name}</p>
                          <p className="font-semibold mt-0.5" style={{ color: payload[0].payload.color }}>
                            {payload[0].value}% of fields
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-100 font-mono">72%</span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Healthy Average</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-3 gap-1 pt-2 text-center text-[10px] font-semibold">
            {healthDistribution.map((entry) => (
              <div key={entry.name} className="flex flex-col items-center p-1.5 rounded border border-white/5 bg-white/1">
                <span className="text-slate-400">{entry.name}</span>
                <span className="font-bold font-mono mt-0.5" style={{ color: entry.color }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Compare Farms Row Section */}
      <div className="pt-4 select-none">
        <h3 className="text-sm font-bold tracking-tight text-slate-400 mb-3.5 uppercase">Farm Telemetry Comparison</h3>
        <CompareFarms />
      </div>
    </motion.div>
  )
}

export default Analytics
