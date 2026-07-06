import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeftRight, 
  Award
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { generateFarmsForDistrict } from '../../data/farmDatabase'
import { generateRecommendation } from '../../services/recommendationEngine'

const CompareFarms = () => {
  // 1. Generate static comparison farm array across various major agricultural hubs
  const compareFarmsList = useMemo(() => {
    const pbFarms = generateFarmsForDistrict("Punjab", "Ludhiana", 30.9010, 75.8573, 3)
    const rjFarms = generateFarmsForDistrict("Rajasthan", "Jaipur", 26.9124, 75.7873, 3)
    const kaFarms = generateFarmsForDistrict("Karnataka", "Chikmagalur", 13.3161, 75.7720, 2)
    const klFarms = generateFarmsForDistrict("Kerala", "Wayanad", 11.6854, 76.1320, 2)
    return [...pbFarms, ...rjFarms, ...kaFarms, ...klFarms]
  }, [])

  const [farmAId, setFarmAId] = useState(compareFarmsList[0]?.id || '')
  const [farmBId, setFarmBId] = useState(compareFarmsList[1]?.id || '')

  // Resolve selection objects
  const farmA = useMemo(() => compareFarmsList.find(f => f.id === farmAId), [farmAId, compareFarmsList])
  const farmB = useMemo(() => compareFarmsList.find(f => f.id === farmBId), [farmBId, compareFarmsList])

  // 2. Run Recommendation Engine on selections
  const metricsA = useMemo(() => {
    if (!farmA) return null
    const seed = farmA.id.charCodeAt(0) + farmA.id.charCodeAt(1) + farmA.id.charCodeAt(2)
    const inputs = {
      id: farmA.id,
      crop: farmA.crop,
      area: farmA.area,
      status: farmA.status,
      soilMoisture: farmA.moisture,
      ndvi: farmA.ndvi || 0.74,
      temperature: farmA.status === 'healthy' ? `${(24 + (seed % 6))}°C` : farmA.status === 'moderate' ? `${(30 + (seed % 6))}°C` : `${(37 + (seed % 4))}°C`,
      humidity: farmA.status === 'healthy' ? `${(65 - (seed % 10))}%` : farmA.status === 'moderate' ? `${(45 - (seed % 8))}%` : `${(22 - (seed % 6))}%`,
      rainProbability: farmA.status === 'healthy' ? 8 + (seed % 10) : farmA.status === 'moderate' ? 30 + (seed % 15) : 10 + (seed % 8),
      waterStress: farmA.status === 'healthy' ? 'Low (Optimal)' : farmA.status === 'moderate' ? 'Moderate Dehydration' : 'Severe Crop Stress',
      soilType: farmA.soilType || 'Clay Loam',
      lastIrrigationTime: farmA.status === 'healthy' ? '12h ago' : farmA.status === 'moderate' ? '18h ago' : '36h ago'
    }
    return generateRecommendation(inputs)
  }, [farmA])

  const metricsB = useMemo(() => {
    if (!farmB) return null
    const seed = farmB.id.charCodeAt(0) + farmB.id.charCodeAt(1) + farmB.id.charCodeAt(2)
    const inputs = {
      id: farmB.id,
      crop: farmB.crop,
      area: farmB.area,
      status: farmB.status,
      soilMoisture: farmB.moisture,
      ndvi: farmB.ndvi || 0.74,
      temperature: farmB.status === 'healthy' ? `${(24 + (seed % 6))}°C` : farmB.status === 'moderate' ? `${(30 + (seed % 6))}°C` : `${(37 + (seed % 4))}°C`,
      humidity: farmB.status === 'healthy' ? `${(65 - (seed % 10))}%` : farmB.status === 'moderate' ? `${(45 - (seed % 8))}%` : `${(22 - (seed % 6))}%`,
      rainProbability: farmB.status === 'healthy' ? 8 + (seed % 10) : farmB.status === 'moderate' ? 30 + (seed % 15) : 10 + (seed % 8),
      waterStress: farmB.status === 'healthy' ? 'Low (Optimal)' : farmB.status === 'moderate' ? 'Moderate Dehydration' : 'Severe Crop Stress',
      soilType: farmB.soilType || 'Clay Loam',
      lastIrrigationTime: farmB.status === 'healthy' ? '12h ago' : farmB.status === 'moderate' ? '18h ago' : '36h ago'
    }
    return generateRecommendation(inputs)
  }, [farmB])

  // 3. Highlight performing metrics comparison calculations
  const comparisonResults = useMemo(() => {
    if (!metricsA || !metricsB || !farmA || !farmB) return null

    const moistureA = parseFloat(farmA.moisture) || 0
    const moistureB = parseFloat(farmB.moisture) || 0
    const ndviA = parseFloat(farmA.ndvi) || 0
    const ndviB = parseFloat(farmB.ndvi) || 0
    const areaA = parseFloat(farmA.area) || 0
    const areaB = parseFloat(farmB.area) || 0
    const yieldA = parseFloat(metricsA.yieldPrediction) || 0
    const yieldB = parseFloat(metricsB.yieldPrediction) || 0
    const waterSavingA = parseInt(metricsA.waterSaving.replace(/,/g, '')) || 0
    const waterSavingB = parseInt(metricsB.waterSaving.replace(/,/g, '')) || 0

    return {
      healthBetter: metricsA.healthScore > metricsB.healthScore ? 'A' : metricsA.healthScore < metricsB.healthScore ? 'B' : 'equal',
      moistureBetter: moistureA > moistureB ? 'A' : moistureA < moistureB ? 'B' : 'equal',
      ndviBetter: ndviA > ndviB ? 'A' : ndviA < ndviB ? 'B' : 'equal',
      areaBetter: areaA > areaB ? 'A' : areaA < areaB ? 'B' : 'equal',
      yieldBetter: yieldA > yieldB ? 'A' : yieldA < yieldB ? 'B' : 'equal',
      waterSavingBetter: waterSavingA > waterSavingB ? 'A' : waterSavingA < waterSavingB ? 'B' : 'equal'
    }
  }, [farmA, farmB, metricsA, metricsB])

  // 4. Comparison Summary Generator
  const summaryText = useMemo(() => {
    if (!farmA || !farmB || !metricsA || !metricsB || !comparisonResults) return ''
    
    let parts = []
    if (comparisonResults.healthBetter === 'A') {
      parts.push(`${farmA.id} (${farmA.farmerName}) exhibits a higher health rating of ${metricsA.healthScore}/100`)
    } else if (comparisonResults.healthBetter === 'B') {
      parts.push(`${farmB.id} (${farmB.farmerName}) exhibits a higher health rating of ${metricsB.healthScore}/100`)
    }

    if (comparisonResults.moistureBetter === 'A') {
      parts.push(`while ${farmA.id} maintains better VWC soil moisture at ${farmA.moisture}`)
    } else if (comparisonResults.moistureBetter === 'B') {
      parts.push(`while ${farmB.id} maintains better VWC soil moisture at ${farmB.moisture}`)
    }

    if (parts.length === 0) return 'Both farms display identical telemetry averages.'
    return parts.join(', ') + '.'
  }, [farmA, farmB, metricsA, metricsB, comparisonResults])

  // 5. Small charts payload formatting
  const chartData = useMemo(() => {
    if (!farmA || !farmB || !metricsA || !metricsB) return []
    return [
      {
        name: 'Health Rating',
        [farmA.id]: metricsA.healthScore,
        [farmB.id]: metricsB.healthScore
      },
      {
        name: 'Moisture VWC',
        [farmA.id]: parseFloat(farmA.moisture) || 0,
        [farmB.id]: parseFloat(farmB.moisture) || 0
      },
      {
        name: 'NDVI Reflectance',
        [farmA.id]: Math.round((parseFloat(farmA.ndvi) || 0) * 100),
        [farmB.id]: Math.round((parseFloat(farmB.ndvi) || 0) * 100)
      }
    ]
  }, [farmA, farmB, metricsA, metricsB])

  if (!farmA || !farmB || !metricsA || !metricsB) return null

  return (
    <div className="glass-panel p-6 space-y-6 relative overflow-hidden select-none">
      
      {/* Selection Dropdown Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center border-b border-white/5 pb-4">
        
        {/* Selector A */}
        <div className="sm:col-span-2 text-left space-y-1.5">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Select Farm A</label>
          <select
            value={farmAId}
            onChange={(e) => setFarmAId(e.target.value)}
            className="w-full bg-[#090d26]/85 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer font-semibold"
          >
            {compareFarmsList.map(f => (
              <option key={f.id} value={f.id}>{f.id} - {f.village} ({f.crop})</option>
            ))}
          </select>
        </div>

        {/* Separator Node */}
        <div className="flex justify-center">
          <div className="p-2.5 rounded-full bg-white/2 border border-white/5 text-slate-400">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>

        {/* Selector B */}
        <div className="sm:col-span-2 text-left space-y-1.5">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Select Farm B</label>
          <select
            value={farmBId}
            onChange={(e) => setFarmBId(e.target.value)}
            className="w-full bg-[#090d26]/85 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer font-semibold"
          >
            {compareFarmsList.filter(f => f.id !== farmAId).map(f => (
              <option key={f.id} value={f.id}>{f.id} - {f.village} ({f.crop})</option>
            ))}
          </select>
        </div>

      </div>

      {/* 4. Comparison Summary Box */}
      <div className="p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/2 text-left flex items-start gap-3">
        <Award className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">AI Comparative Summary</span>
          <p className="text-xs text-slate-200 font-bold leading-normal">{summaryText}</p>
        </div>
      </div>

      {/* Side-by-Side Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Farm A Column card */}
        <div className="md:col-span-2 p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/2 space-y-3 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="border-b border-emerald-500/10 pb-2">
            <span className="text-[10px] font-mono text-emerald-400 font-black tracking-wider uppercase">Farm A Target</span>
            <h4 className="text-sm font-black text-slate-100 mt-0.5 truncate">{farmA.village} Plot</h4>
            <p className="text-[10px] text-slate-500 font-medium">Operator: {farmA.farmerName}</p>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-300">
            <div className="flex justify-between"><span>Crop Type:</span> <span className="text-slate-100">{farmA.crop}</span></div>
            <div className="flex justify-between"><span>Total Area:</span> <span className="text-slate-100 font-mono">{farmA.area} ha</span></div>
            <div className="flex justify-between"><span>Soil Profile:</span> <span className="text-slate-100">{farmA.soilType}</span></div>
            <div className="flex justify-between"><span>Moisture VWC:</span> <span className="text-slate-100 font-mono">{farmA.moisture}</span></div>
            <div className="flex justify-between"><span>NDVI Scan:</span> <span className="text-slate-100 font-mono">{farmA.ndvi}</span></div>
            <div className="flex justify-between"><span>Health score:</span> <span className="text-emerald-400 font-mono font-bold">{metricsA.healthScore}</span></div>
            <div className="flex justify-between"><span>Water Stress:</span> <span className="text-slate-100">{metricsA.waterStress.split(' ')[0]}</span></div>
            <div className="flex justify-between"><span>Temperature:</span> <span className="text-slate-100 font-mono">{metricsA.temp}</span></div>
            <div className="flex justify-between"><span>Humidity:</span> <span className="text-slate-100 font-mono">{metricsA.humidity}</span></div>
            <div className="flex justify-between"><span>Yield Prediction:</span> <span className="text-emerald-400 font-mono">{metricsA.yieldPrediction}</span></div>
            <div className="flex justify-between"><span>Water Saving:</span> <span className="text-teal-400 font-mono">{metricsA.waterSaving}</span></div>
            <div className="flex justify-between"><span>Cost Saving:</span> <span className="text-emerald-400 font-mono">{metricsA.costSaving}</span></div>
          </div>
        </div>

        {/* Small comparison charts inside the middle column */}
        <div className="md:col-span-1 rounded-2xl border border-white/5 bg-white/1 p-3 flex flex-col justify-between select-none h-full min-h-[250px]">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block border-b border-white/5 pb-2 mb-2">Metrics Chart</span>
          
          <div className="flex-1 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -40, bottom: 5 }}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d26]/95 border border-white/10 p-2 rounded text-[10px] text-slate-300 space-y-0.5">
                          <p className="font-bold text-slate-200">{payload[0].name}</p>
                          <p className="text-emerald-400 font-semibold">{payload[0].name === 'NDVI Reflectance' ? (payload[0].value/100).toFixed(2) : payload[0].value}</p>
                          <p className="text-cyan-400 font-semibold">{payload[1].name === 'NDVI Reflectance' ? (payload[1].value/100).toFixed(2) : payload[1].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey={farmA.id} fill="#10b981" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
                <Bar dataKey={farmB.id} fill="#3b82f6" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-[8px] font-bold text-slate-500 uppercase pt-2 border-t border-white/5">
            <span className="text-emerald-400">● {farmA.id}</span>
            <span className="text-blue-400">● {farmB.id}</span>
          </div>
        </div>

        {/* Farm B Column card */}
        <div className="md:col-span-2 p-4 rounded-2xl border border-blue-500/10 bg-blue-500/2 space-y-3 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="border-b border-blue-500/10 pb-2">
            <span className="text-[10px] font-mono text-blue-400 font-black tracking-wider uppercase">Farm B Target</span>
            <h4 className="text-sm font-black text-slate-100 mt-0.5 truncate">{farmB.village} Plot</h4>
            <p className="text-[10px] text-slate-500 font-medium">Operator: {farmB.farmerName}</p>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-300">
            <div className="flex justify-between"><span>Crop Type:</span> <span className="text-slate-100">{farmB.crop}</span></div>
            <div className="flex justify-between"><span>Total Area:</span> <span className="text-slate-100 font-mono">{farmB.area} ha</span></div>
            <div className="flex justify-between"><span>Soil Profile:</span> <span className="text-slate-100">{farmB.soilType}</span></div>
            <div className="flex justify-between"><span>Moisture VWC:</span> <span className="text-slate-100 font-mono">{farmB.moisture}</span></div>
            <div className="flex justify-between"><span>NDVI Scan:</span> <span className="text-slate-100 font-mono">{farmB.ndvi}</span></div>
            <div className="flex justify-between"><span>Health score:</span> <span className="text-blue-400 font-mono font-bold">{metricsB.healthScore}</span></div>
            <div className="flex justify-between"><span>Water Stress:</span> <span className="text-slate-100">{metricsB.waterStress.split(' ')[0]}</span></div>
            <div className="flex justify-between"><span>Temperature:</span> <span className="text-slate-100 font-mono">{metricsB.temp}</span></div>
            <div className="flex justify-between"><span>Humidity:</span> <span className="text-slate-100 font-mono">{metricsB.humidity}</span></div>
            <div className="flex justify-between"><span>Yield Prediction:</span> <span className="text-blue-400 font-mono">{metricsB.yieldPrediction}</span></div>
            <div className="flex justify-between"><span>Water Saving:</span> <span className="text-teal-400 font-mono">{metricsB.waterSaving}</span></div>
            <div className="flex justify-between"><span>Cost Saving:</span> <span className="text-emerald-400 font-mono">{metricsB.costSaving}</span></div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CompareFarms
