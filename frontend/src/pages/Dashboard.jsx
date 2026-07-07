import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logoImg from "../assets/logo.png";
import { 
  History, 
  Sparkles, 
  FileSpreadsheet, 
  Download,
  Printer
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import SystemStatusBar from '../components/common/SystemStatusBar'
import KPICards from '../components/cards/KPICards'
import FieldMap from '../components/map/FieldMap'
import AgriXDecisionCenter from '../components/ai/AgriXDecisionCenter'
import FarmDigitalTwin from '../components/ai/FarmDigitalTwin'
import Charts from '../components/charts/Charts'
import OperationalMetrics from '../components/cards/OperationalMetrics'
import WeatherWidget from '../components/common/WeatherWidget'
import ScenarioSimulator from '../components/ai/ScenarioSimulator'
import CompareFarms from '../components/analytics/CompareFarms'
import AnalysisLoader from '../components/common/AnalysisLoader'
import TransparentLogo from '../components/common/TransparentLogo'
import { generateRecommendation } from '../services/recommendationEngine'
import { fetchWeatherData } from '../services/weatherService'
import { generatePDFReport, generateCSVReport, printReport } from '../services/reportService'

const Dashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [pendingFarm, setPendingFarm] = useState(null)
  
  const [metrics, setMetrics] = useState(null)
  const [isCenterAnalyzing, setIsCenterAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const [weather, setWeather] = useState(null)
  const [weatherSourceStatus, setWeatherSourceStatus] = useState('live') // 'live' | 'fallback'

  // Trigger coordinated data fetching when selected farm target changes
  useEffect(() => {
    if (!selectedFarm) {
      setMetrics(null)
      setWeather(null)
      return
    }

    const loadTelemetry = async () => {
      setIsCenterAnalyzing(true)
      setAnalysisProgress(0)

      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 60)

      let weatherData = null
      try {
        const fetched = await fetchWeatherData(selectedFarm?.lat, selectedFarm?.lng)
        weatherData = fetched
        setWeather(fetched)
        setWeatherSourceStatus('live')
      } catch (err) {
        const farmId = selectedFarm?.id ?? 'AGX-PB-001'
        const seed = farmId.charCodeAt(0) + (farmId.charCodeAt(1) || 65) + (farmId.charCodeAt(2) || 66)
        const tempVal = selectedFarm?.status === 'healthy' ? 24 + (seed % 6) : selectedFarm?.status === 'moderate' ? 30 + (seed % 6) : 37 + (seed % 4)
        const humidityVal = selectedFarm?.status === 'healthy' ? 65 - (seed % 10) : selectedFarm?.status === 'moderate' ? 45 - (seed % 8) : 22 - (seed % 6)
        const rainProbabilityVal = selectedFarm?.status === 'healthy' ? 8 + (seed % 10) : selectedFarm?.status === 'moderate' ? 30 + (seed % 15) : 10 + (seed % 8)
        const windVal = 10 + (seed % 6)
        
        const fallback = {
          temp: `${tempVal}°C`,
          humidity: `${humidityVal}%`,
          windSpeed: `${windVal} km/h`,
          rainProb: `${rainProbabilityVal}%`,
          rainProbVal: rainProbabilityVal,
          condition: rainProbabilityVal > 50 ? 'Showers' : rainProbabilityVal > 20 ? 'Partly Cloudy' : 'Clear Sky / Sunny',
          isLive: false
        }
        
        weatherData = fallback
        setWeather(fallback)
        setWeatherSourceStatus('fallback')
      }

      // Single source of truth metrics calculation
      const farmId = selectedFarm?.id ?? 'AGX-PB-001'
      const seed = farmId.charCodeAt(0) + (farmId.charCodeAt(1) || 65) + (farmId.charCodeAt(2) || 66)
      
      const inputs = {
        id: selectedFarm?.id ?? 'N/A',
        crop: selectedFarm?.crop ?? 'Wheat',
        area: selectedFarm?.area ?? 10,
        status: selectedFarm?.status ?? 'healthy',
        soilMoisture: selectedFarm?.moisture ?? '35%',
        ndvi: selectedFarm?.ndvi ?? 0.74,
        temperature: weatherData?.temp ?? '30°C',
        humidity: weatherData?.humidity ?? '55%',
        rainProbability: weatherData?.rainProbVal ?? 10,
        windSpeed: weatherData?.windSpeed ?? '12 km/h',
        waterStress: selectedFarm?.status === 'healthy' ? 'Low (Optimal)' : selectedFarm?.status === 'moderate' ? 'Moderate Dehydration' : 'Severe Crop Stress',
        soilType: selectedFarm?.soilType || 'Clay Loam',
        lastIrrigation: selectedFarm?.lastIrrigation || '12h ago',
        growthStage: selectedFarm?.growthStage || 'Vegetative Growth',
        season: selectedFarm?.season || 'Kharif'
      }

      const result = generateRecommendation(inputs)
      setMetrics(result)
      
      // Keep localStorage synchronized reactively for reports page
      localStorage.setItem('selectedFarm', JSON.stringify(selectedFarm))
      localStorage.setItem('selectedFarmMetrics', JSON.stringify(result))
      
      clearInterval(interval)
      setAnalysisProgress(100)
      setIsCenterAnalyzing(false)
    }

    loadTelemetry()
  }, [selectedFarm?.id])

  const [history, setHistory] = useState([
    { id: 'EV-8849', time: '10:45 AM', asset: 'AGX-RJ-001', location: 'Jaipur', status: 'critical', action: 'Emergency Override', crop: 'Pearl Millet (Bajra)' },
    { id: 'EV-8848', time: '09:30 AM', asset: 'AGX-PB-001', location: 'Ludhiana', status: 'healthy', action: 'Bypass Hold', crop: 'Wheat' },
    { id: 'EV-8847', time: '08:15 AM', asset: 'AGX-AP-001', location: 'Guntur', status: 'moderate', action: 'Pulse Trigger', crop: 'Cotton' }
  ])

  const getDynamicInsights = (farm) => {
    if (!farm) {
      return [
        {
          id: 'INS-01',
          title: 'Moisture Evaporation Alert',
          desc: 'Jaipur crop sectors display critical Evapotranspiration levels (VWC < 30%). Immediate hydraulic overrides are recommended.',
          status: 'critical',
          tag: 'Critical Stress'
        },
        {
          id: 'INS-02',
          title: 'NDVI Optimization Met',
          desc: 'Ludhiana wheat fields logged optimal chlorophyll growth. Maintain default water bypass hold settings.',
          status: 'healthy',
          tag: 'Optimal Growth'
        },
        {
          id: 'INS-03',
          title: 'Evaporative Anomaly Mapped',
          desc: 'Scattered thermal scans highlight moisture dry spots in Bhopal zones. Adjust scheduled valve timers.',
          status: 'moderate',
          tag: 'Evap Sync'
        }
      ]
    }

    const crop = farm.crop || 'Crop'
    const district = farm.district || 'District'
    const season = farm.season || 'Kharif'
    const status = farm.status || 'healthy'

    let insight1 = {
      id: 'INS-01',
      title: 'Evaporation Stress Analysis',
      desc: `${district} ${crop} fields show stable transpiration patterns under current ${season} conditions. No immediate threat mapped.`,
      status: 'healthy',
      tag: 'Healthy Trans'
    }
    let insight2 = {
      id: 'INS-02',
      title: 'NDVI Growth Trajectory',
      desc: `Geospatial NDVI scans for ${crop} align with the standard ${season} lifecycle curve. Photosynthesis rate is optimal.`,
      status: 'healthy',
      tag: 'Growth Sync'
    }

    if (status === 'critical') {
      insight1 = {
        id: 'INS-01',
        title: `${crop} Wilting Hazard Alert`,
        desc: `Extreme high evapotranspiration detected on ${crop} in ${district}. Soil moisture is below wilting point (<25% VWC). Immediate irrigation is needed.`,
        status: 'critical',
        tag: 'Wilting Risk'
      }
      insight2 = {
        id: 'INS-02',
        title: 'Chlorophyll Deficit Warning',
        desc: `Sentinel-2 red-edge band shows localized canopy stress on ${crop}. Nitrogen uptake is limited due to moisture deficit.`,
        status: 'critical',
        tag: 'NDVI Anomaly'
      }
    } else if (status === 'moderate') {
      insight1 = {
        id: 'INS-01',
        title: 'Mild Dehydration Spotted',
        desc: `${crop} fields in ${district} exhibit slight thermal stress signatures. Restoring moisture levels is recommended within 12 hours.`,
        status: 'moderate',
        tag: 'Moisture Warn'
      }
      insight2 = {
        id: 'INS-02',
        title: 'Growth Phase Shift Sync',
        desc: `${crop} is currently transitioning to the flowering stage. Increased water sensitivity detected in root zone.`,
        status: 'moderate',
        tag: 'Phase Warning'
      }
    }

    return [insight1, insight2]
  }

  const insights = getDynamicInsights(selectedFarm)

  const handleSelectFarm = (farm) => {
    if (farm === null) {
      setSelectedFarm(null)
      setPendingFarm(null)
      setIsAnalyzing(false)
      localStorage.removeItem('selectedFarm')
      localStorage.removeItem('selectedFarmMetrics')
    } else {
      setPendingFarm(farm)
      setIsAnalyzing(true)
    }
  }

  const handleAnalysisComplete = () => {
    if (!pendingFarm) return
    setSelectedFarm(pendingFarm)
    setIsAnalyzing(false)
    localStorage.setItem('selectedFarm', JSON.stringify(pendingFarm))
    
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const newLog = {
      id: `EV-${Math.floor(8800 + Math.random() * 1000)}`,
      time: timeStr,
      asset: pendingFarm.id,
      location: `${pendingFarm.district ?? 'Unknown'}`,
      status: pendingFarm.status ?? 'healthy',
      action: pendingFarm.status === 'healthy' 
        ? 'Bypass Hold' 
        : pendingFarm.status === 'moderate' 
          ? 'Pulse Irrigation' 
          : 'Emergency Override',
      crop: pendingFarm.crop ?? 'Wheat'
    }
    
    setHistory(prev => [newLog, ...prev.slice(0, 4)])
  }

  // Dashboard PDF, CSV, and Print Delegators
  const handleDownloadDashboardPDF = (format) => {
    if (!selectedFarm || !metrics) return
    const reportData = {
      farmId: selectedFarm.id,
      state: selectedFarm.state,
      district: selectedFarm.district,
      crop: selectedFarm.crop,
      area: selectedFarm.area,
      ndvi: selectedFarm.ndvi || '0.78',
      moisture: selectedFarm.moisture,
      status: selectedFarm.status,
      soilType: selectedFarm.soilType,
      weather: `${weather?.temp || '32°C'}, Humidity ${weather?.humidity || '55%'}, Wind ${weather?.windSpeed || '12 km/h'}`,
      recommendation: metrics.recommendation,
      waterSaving: metrics.waterSaving,
      actionPlan: metrics.actionPlan,
      expectedImpact: metrics.expectedImpact,
      scenarioSummary: `${metrics.priority} Priority status override`
    }

    if (format === 'csv') {
      generateCSVReport(reportData)
    } else if (format === 'print') {
      printReport(reportData)
    } else {
      generatePDFReport(reportData)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', damping: 25, stiffness: 140 } 
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* 1. Redesigned Hero Branding Section */}
      <motion.div variants={itemVariants}>
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center justify-center text-center select-none mb-2">
          <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] z-0 pointer-events-none animate-glow-1" />
          <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-[60px] z-0 pointer-events-none animate-glow-2" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-4"
            >
              <TransparentLogo src={logoImg} className="h-44 md:h-56 w-auto" alt="AgriX Official Logo" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="font-sans font-black text-4xl md:text-5xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.2)] mb-2"
            >
              AgriX
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans font-bold text-lg md:text-xl text-slate-200 tracking-wide mb-3 px-4"
            >
              AI-Powered Precision Agriculture Decision Intelligence
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs md:text-sm text-slate-400 font-semibold tracking-wide max-w-xl mb-6 leading-relaxed px-4"
            >
              Empowering Smarter Irrigation Through AI, Geospatial Intelligence & Predictive Analytics
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { text: 'Precision Agriculture', icon: '🌱', color: 'border-emerald-500/10 bg-emerald-500/3 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]' },
                { text: 'Satellite Monitoring', icon: '🛰', color: 'border-blue-500/10 bg-blue-500/3 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]' },
                { text: 'AI Decision Support', icon: '🤖', color: 'border-cyan-500/10 bg-cyan-500/3 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]' }
              ].map((badge, idx) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.15 }}
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-xs font-bold transition-all duration-300 ${badge.color}`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. System Status Bar */}
      <motion.div variants={itemVariants}>
        <SystemStatusBar selectedFarm={selectedFarm} />
      </motion.div>

      {/* 3. Primary KPI Cards */}
      <motion.div variants={itemVariants}>
        <KPICards selectedFarm={selectedFarm} />
      </motion.div>

      {/* 4. Main Section: Map (Left 65% / xl:col-span-8) & AI Decision Center (Right 35% / xl:col-span-4) */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
          {/* Left: Map Container */}
          <div className="xl:col-span-8 h-[580px] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <FieldMap selectedFarm={selectedFarm} onSelectFarm={handleSelectFarm} />
            </div>
          </div>

          {/* Right: AI Decision Panel */}
          <div className="xl:col-span-4 h-[580px] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[90px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <AgriXDecisionCenter 
                selectedFarm={selectedFarm} 
                metrics={metrics}
                loading={isCenterAnalyzing}
                progress={analysisProgress}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Second Row: Farm Digital Twin (Left 65% / xl:col-span-8) & Weather Widget (Right 35% / xl:col-span-4) */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
          {/* Farm Digital Twin */}
          <div className="xl:col-span-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <FarmDigitalTwin 
                selectedFarm={selectedFarm} 
                metrics={metrics}
              />
            </div>
          </div>

          {/* Weather Widget */}
          <div className="xl:col-span-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-sky-500/4 rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <WeatherWidget 
                selectedFarm={selectedFarm} 
                weather={weather}
                sourceStatus={weatherSourceStatus}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Third Row: Moisture History (Charts) (Left 65% / xl:col-span-8) & Operational Metrics (Right 35% / xl:col-span-4) */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
          {/* Charts (Moisture History) */}
          <div className="xl:col-span-8 h-[340px] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/4 rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <Charts selectedFarm={selectedFarm} />
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="xl:col-span-4 h-[340px] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/4 rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="relative z-10 h-full">
              <OperationalMetrics selectedFarm={selectedFarm} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7. Fourth Row: Scenario Simulator */}
      <motion.div variants={itemVariants}>
        <div className="w-full">
          <ScenarioSimulator selectedFarm={selectedFarm} metrics={metrics} />
        </div>
      </motion.div>

      {/* 8. Fifth Row: Compare Farms */}
      <motion.div variants={itemVariants}>
        <div className="w-full">
          <CompareFarms />
        </div>
      </motion.div>

      {/* 9. Sixth Row: Historical Analytics Logs */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Recent Analysis History (Left 8/12) */}
          <div className="xl:col-span-8 p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm tracking-wide font-sans">Recent Diagnostic Activity</h3>
                  <p className="text-[10px] text-slate-400">Telemetry logs for active irrigation scans</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all select-none">
                <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[10px] select-none">
                    <th className="py-3 px-2">Event ID</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Asset ID</th>
                    <th className="py-3 px-2">Location</th>
                    <th className="py-3 px-2">Crop</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Edge Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-semibold select-none">
                  {history.map((log) => (
                    <tr 
                      key={log.id} 
                      className="hover:bg-white/2 transition-colors duration-150 cursor-pointer"
                      onClick={() => {
                        const mockSelected = {
                          id: log.asset,
                          name: `${log.location} Field Plot`,
                          farmerName: 'Seeded Operator',
                          village: log.location,
                          crop: log.crop,
                          area: '8.4',
                          status: log.status,
                          moisture: log.status === 'healthy' ? '74%' : log.status === 'moderate' ? '54%' : '28%',
                          ndvi: log.status === 'healthy' ? '0.78' : log.status === 'moderate' ? '0.48' : '0.24',
                          state: 'Representative State',
                          district: log.location,
                          soilType: 'Alluvial Soil',
                          waterSource: 'Tube Well',
                          growthStage: 'Vegetative Growth',
                          irrigationMethod: 'Drip Irrigation',
                          createdDate: '2024-04-12'
                        }
                        handleSelectFarm(mockSelected)
                      }}
                    >
                      <td className="py-3.5 px-2 text-slate-500 font-mono text-[10px]">{log.id}</td>
                      <td className="py-3.5 px-2 text-[10px] font-medium">{log.time}</td>
                      <td className="py-3.5 px-2 text-slate-200 font-mono text-[10px]">{log.asset}</td>
                      <td className="py-3.5 px-2 text-slate-400 font-medium">{log.location}</td>
                      <td className="py-3.5 px-2 font-medium">{log.crop}</td>
                      <td className="py-3.5 px-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border
                          ${log.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${log.status === 'moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                          ${log.status === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                        `}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right text-emerald-400 font-bold text-[10px] tracking-wide">{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights Feed (Right 4/12) */}
          <div className="xl:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4 select-none">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm tracking-wide font-sans">AI Insights Feed</h3>
                <p className="text-[10px] text-slate-400">Continuous anomaly predictions</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {insights.map((insight, idx) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all hover:bg-white/2
                    ${insight.status === 'critical' ? 'border-rose-500/15 bg-rose-500/2' : ''}
                    ${insight.status === 'healthy' ? 'border-emerald-500/15 bg-emerald-500/2' : ''}
                    ${insight.status === 'moderate' ? 'border-amber-500/15 bg-amber-500/2' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-200">{insight.title}</span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded
                      ${insight.status === 'critical' ? 'bg-rose-500/10 text-rose-400' : ''}
                      ${insight.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                      ${insight.status === 'moderate' ? 'bg-amber-500/10 text-amber-400' : ''}
                    `}>
                      {insight.tag}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-normal">{insight.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 10. Seventh Row: Recent Reports */}
      <motion.div variants={itemVariants}>
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/0 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <FileSpreadsheet className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Target Field Report Console
                </span>
                {selectedFarm && (
                  <span className="text-[10px] text-slate-500 font-bold font-mono">
                    Active ID: {selectedFarm.id}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                {selectedFarm 
                  ? `Active Telemetry Report for ${selectedFarm.village} Plot` 
                  : 'Awaiting Farm Selection to Compile PDF Reports'
                }
              </h3>
              <p className="text-xs text-slate-400 leading-normal max-w-xl">
                Generate and download an official precision agriculture water intelligence report. Includes NDVI health, soil water content averages, microclimate telemetry, expected yield impacts, and AI scheduling overrides.
              </p>
            </div>
          </div>

          {selectedFarm && metrics && (
            <div className="flex flex-wrap gap-2.5 shrink-0 select-none">
              <button
                onClick={() => handleDownloadDashboardPDF('pdf')}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-[#050816] font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all cursor-pointer text-xs"
              >
                <Download className="h-4 w-4" /> PDF Report
              </button>

              <button
                onClick={() => handleDownloadDashboardPDF('csv')}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition-all cursor-pointer text-xs"
              >
                <FileSpreadsheet className="h-4 w-4 text-cyan-400" /> CSV Sheet
              </button>

              <button
                onClick={() => handleDownloadDashboardPDF('print')}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition-all cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4 text-blue-400" /> Print
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* AI Analysis Overlay Loader */}
      <AnalysisLoader 
        isLoading={isAnalyzing} 
        onComplete={handleAnalysisComplete} 
        farmId={pendingFarm?.id} 
      />

      {/* Global Dashboard Footer */}
      <footer className="text-center py-8 border-t border-white/5 select-none text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-4">
          <span>© {new Date().getFullYear()} AgriX Decision Intelligence Platform. All rights reserved.</span>
          <span>Version 4.2.0 (Stable-Prod)</span>
        </div>
      </footer>
    </motion.div>
  )
}

export default Dashboard
