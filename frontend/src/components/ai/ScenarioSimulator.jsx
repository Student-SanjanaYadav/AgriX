import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  Activity,
  Gauge
} from 'lucide-react'
import { generateRecommendation } from '../../services/recommendationEngine'

const ScenarioSimulator = ({ selectedFarm, metrics }) => {
  const [activeScenario, setActiveScenario] = useState(null)
  const [simulatedMetrics, setSimulatedMetrics] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const scenarios = [
    { id: 1, name: 'Rain Delayed 24h', desc: 'Sets rain forecast probability to 0% due to weather front shift.' },
    { id: 2, name: 'Temperature +3°C', desc: 'Simulates microclimate thermal stress adding 3°C.' },
    { id: 3, name: 'Moisture Decreases 10%', desc: 'Simulates soil VWC moisture dropping by 10%.' },
    { id: 4, name: 'Water Supply Reduced 20%', desc: 'Forces dry irrigation channel flow, raising crop stress.' },
    { id: 5, name: 'Heavy Rainfall Tomorrow', desc: 'Forecasts 90% rain probability tomorrow.' }
  ]

  // Recalculate recommendation metrics based on scenario parameters
  const runSimulation = (scenarioId) => {
    if (!selectedFarm || !metrics) return

    setIsSimulating(true)

    // Retrieve original coordinates
    const seed = selectedFarm.id.charCodeAt(0) + selectedFarm.id.charCodeAt(1) + selectedFarm.id.charCodeAt(2)
    const baseTemp = parseFloat(metrics.temp) || 30
    const baseHumidity = parseFloat(metrics.humidity) || 60
    const baseMoisture = parseFloat(selectedFarm.moisture) || 35
    const baseRain = parseFloat(metrics.rainProbability) || 12
    const baseNdvi = parseFloat(selectedFarm.ndvi) || 0.74

    let simMoisture = baseMoisture
    let simTemp = baseTemp
    let simRain = baseRain
    let simStress = metrics.waterStress || 'Low (Optimal)'
    let simStatus = selectedFarm.status

    switch (scenarioId) {
      case 1: // Rain delayed by 24h
        simRain = 0
        break
      case 2: // Temp +3C
        simTemp = baseTemp + 3
        break
      case 3: // Moisture decreases by 10%
        simMoisture = Math.max(10, baseMoisture - 10)
        break
      case 4: // Water supply reduced by 20%
        simMoisture = Math.max(10, baseMoisture - 12)
        simStress = 'Severe Crop Stress'
        simStatus = 'critical'
        break
      case 5: // Heavy rainfall
        simRain = 90
        break
      default:
        break
    }

    const inputs = {
      id: selectedFarm.id,
      crop: selectedFarm.crop,
      area: selectedFarm.area,
      status: simStatus,
      soilMoisture: `${simMoisture}%`,
      ndvi: baseNdvi,
      temperature: `${simTemp}°C`,
      humidity: `${baseHumidity}%`,
      rainProbability: simRain,
      windSpeed: metrics.windSpeed || '12 km/h',
      waterStress: simStress,
      soilType: seed % 2 === 0 ? 'Clay Loam' : 'Sandy Loam',
      lastIrrigationTime: selectedFarm.status === 'healthy' ? '12h ago' : selectedFarm.status === 'moderate' ? '18h ago' : '36h ago'
    }

    setTimeout(() => {
      const calculated = generateRecommendation(inputs)
      setSimulatedMetrics(calculated)
      setIsSimulating(false)
    }, 450)
  }

  // Run simulation when scenario selection changes
  useEffect(() => {
    if (activeScenario === null) {
      setSimulatedMetrics(null)
      return
    }
    runSimulation(activeScenario)
  }, [activeScenario, selectedFarm?.id])

  // Reset scenario selections
  const handleReset = () => {
    setActiveScenario(null)
    setSimulatedMetrics(null)
  }

  // Display placeholder if no farm is selected
  if (!selectedFarm || !metrics) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center select-none min-h-[350px] relative w-full h-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/5 text-purple-400 border border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.1)] mb-4"
        >
          <Gauge className="h-7 w-7" />
        </motion.div>
        
        <h3 className="text-slate-200 font-bold text-xs tracking-wide font-sans">Awaiting Field Simulation</h3>
        <p className="text-[11px] text-slate-500 max-w-xs mt-2 leading-relaxed">
          Select an active field target on the geospatial map to boot environmental scenario simulation tools.
        </p>
      </div>
    )
  }

  const activeMetrics = simulatedMetrics || metrics

  return (
    <div className="glass-panel p-5 flex flex-col justify-between relative w-full h-full min-h-[350px] overflow-hidden text-left select-none">
      
      {/* Title block with Reset */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.1)]">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-sans">Scenario Simulator</h3>
            <p className="text-[9px] text-slate-500 font-semibold font-mono">Tuning Target: {selectedFarm.id}</p>
          </div>
        </div>

        {activeScenario !== null && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Reset Engine
          </button>
        )}
      </div>

      {/* Grid: Simulator Select Left / Result Output Right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
        
        {/* Left 2/5: Interactive scenario buttons list */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {scenarios.map((sc) => {
            const isSelected = activeScenario === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-0.5
                  ${isSelected 
                    ? 'bg-purple-500/10 border-purple-500/35 text-purple-400 font-black shadow-[0_0_12px_rgba(168,85,247,0.1)]' 
                    : 'bg-white/1 border-white/5 text-slate-400 hover:bg-white/2 hover:text-slate-300'
                  }
                `}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <Play className={`h-3 w-3 ${isSelected ? 'fill-purple-400' : ''}`} />
                  <span>{sc.name}</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight font-medium font-sans">
                  {sc.desc}
                </p>
              </button>
            )
          })}
        </div>

        {/* Right 3/5: Dynamic Sim Result Panel */}
        <div className="md:col-span-3 rounded-xl border border-white/5 bg-white/1 p-3 flex flex-col justify-between relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSimulating ? (
              /* Simulated calculations loader */
              <motion.div
                key="sim-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-10"
              >
                <Activity className="h-6 w-6 text-purple-400 animate-pulse mb-2" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Recalculating AI Models...</span>
              </motion.div>
            ) : (
              /* Simulation output review details */
              <motion.div
                key="sim-output"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3 text-[11px]"
              >
                {/* Header indicators */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[9.5px] font-black uppercase text-purple-400 tracking-wider">
                    {activeScenario !== null ? 'Simulated Inference' : 'Default Inference'}
                  </span>
                  
                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border
                    ${activeMetrics.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                    ${activeMetrics.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                    ${activeMetrics.priority === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                  `}>
                    {activeMetrics.priority} Priority
                  </span>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-400">
                  <div className="p-2 rounded bg-white/2 border border-white/2 flex justify-between items-center">
                    <span>Health Score:</span>
                    <span className={`font-mono font-bold text-slate-100 flex items-center gap-1
                      ${activeScenario !== null && parseFloat(activeMetrics.healthScore) !== parseFloat(metrics.healthScore) ? 'text-amber-400 font-extrabold' : ''}
                    `}>
                      {activeMetrics.healthScore}
                      {activeScenario !== null && parseFloat(activeMetrics.healthScore) !== parseFloat(metrics.healthScore) && (
                        <span className="text-[9px]">({parseFloat(activeMetrics.healthScore) > parseFloat(metrics.healthScore) ? '↑' : '↓'})</span>
                      )}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-white/2 border border-white/2 flex justify-between items-center">
                    <span>Yield prediction:</span>
                    <span className={`font-mono font-bold text-slate-100
                      ${activeScenario !== null && activeMetrics.yieldPrediction !== metrics.yieldPrediction ? 'text-amber-400 font-extrabold' : ''}
                    `}>
                      {activeMetrics.yieldPrediction}
                    </span>
                  </div>
                </div>

                {/* Simulated Recommendation text */}
                <div className="p-2.5 rounded-lg border border-purple-500/10 bg-purple-500/2 text-left space-y-0.5">
                  <span className="text-[8.5px] text-purple-400 font-black uppercase tracking-wider block">Simulated Recommendation</span>
                  <p className="text-[11px] text-slate-200 font-semibold leading-relaxed">
                    {activeMetrics.recommendation}
                  </p>
                </div>

                {/* Simulated Action Plan text */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-500 font-black uppercase tracking-wider block">Action Plan</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {activeMetrics.actionPlan}
                  </p>
                </div>

                {/* Water and Cost Savings parameters */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-semibold select-none">
                  <div>Water Saved: <span className="font-mono font-bold text-slate-200">{activeMetrics.waterSaving}</span></div>
                  <div>Cost Saved: <span className="font-mono font-bold text-emerald-400">{activeMetrics.costSaving}</span></div>
                  <div>Risk rating: <span className={`font-bold capitalize ${activeMetrics.risk === 'High' ? 'text-rose-400' : activeMetrics.risk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>{activeMetrics.risk}</span></div>
                  <div>AI Confidence: <span className="font-mono font-bold text-slate-200">{activeMetrics.confidence}%</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  )
}

export default ScenarioSimulator
