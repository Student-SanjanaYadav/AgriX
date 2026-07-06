import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Database, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ClipboardList,
  Printer,
  Table
} from 'lucide-react'
import { generatePDFReport, generateCSVReport, printReport } from '../services/reportService'

const Reports = () => {
  const [selectedFarm, setSelectedFarm] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const updateFromStorage = () => {
      try {
        const farm = JSON.parse(localStorage.getItem('selectedFarm') || 'null')
        const met = JSON.parse(localStorage.getItem('selectedFarmMetrics') || 'null')
        setSelectedFarm(farm)
        setMetrics(met)
      } catch (err) {
        console.error(err)
      }
    }
    
    updateFromStorage()
    window.addEventListener('storage', updateFromStorage)
    return () => window.removeEventListener('storage', updateFromStorage)
  }, [])

  const reports = [
    {
      id: 'REP-2026-07-A',
      title: 'North Zone Crop Dehydration Evaporation Log',
      date: 'July 05, 2026',
      size: '2.4 KB',
      type: 'PDF / Tabular',
      districts: 'Ludhiana, Punjab',
      state: 'Punjab',
      crop: 'Rice (Paddy)',
      area: '14.5',
      ndvi: '0.74',
      moisture: '74%',
      status: 'healthy',
      soilType: 'Alluvial Soil',
      weather: '30°C, Humid Overcast',
      recommendation: 'Vegetation indexes show healthy green density. VWC is within target profile boundaries. Hold manual overrides.',
      waterSaving: '18% Savings Mapped',
      actionPlan: 'Maintain current automatic scheduling. Satellite sweep in 24 hours.',
      expectedImpact: 'Preserves groundwater resources by avoiding irrigation run-offs.',
      scenarioSummary: 'Simulated under standard seasonal monsoon forecasts.'
    },
    {
      id: 'REP-2026-07-B',
      title: 'South Zone Coffee & Spice Moisture Summary',
      date: 'July 02, 2026',
      size: '4.8 MB',
      type: 'PDF / GeoJSON',
      districts: 'Wayanad, Kerala',
      state: 'Kerala',
      crop: 'Coffee',
      area: '8.4',
      ndvi: '0.82',
      moisture: '85%',
      status: 'healthy',
      soilType: 'Laterite Soil',
      weather: '26°C, Monsoon Rain',
      recommendation: 'Soil is fully saturated from local rainfall. Active bypass timer hold is forced on all irrigation valves.',
      waterSaving: '35% Saved (Rain Sync)',
      actionPlan: 'Lock hydraulic bypass gates to avoid excessive root erosion.',
      expectedImpact: 'Guards against nutrient leaching during local cloudburst events.',
      scenarioSummary: 'Calibrated under dense heavy rain conditions.'
    },
    {
      id: 'REP-2026-06-C',
      title: 'West Zone Cotton Boundary Saturation Audit',
      date: 'June 28, 2026',
      size: '3.1 MB',
      type: 'PDF',
      districts: 'Jaipur, Rajasthan',
      state: 'Rajasthan',
      crop: 'Pearl Millet (Bajra)',
      area: '12.5',
      ndvi: '0.29',
      moisture: '29%',
      status: 'critical',
      soilType: 'Sandy Soil',
      weather: '39°C, Arid Winds',
      recommendation: 'Severe water deficit detected. Evapotranspiration suggests emergency high-flow overrides within 4 hours.',
      waterSaving: 'No savings available (irrigation critical)',
      actionPlan: 'Override sub-surface valve gates at 18:00 hrs for 45 minutes.',
      expectedImpact: 'Saves 24% crop yields by avoiding dry heat stress.',
      scenarioSummary: 'Calculated under extreme desert wave conditions.'
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">Evapotranspiration & Yield Reports</h2>
          <p className="text-sm text-slate-400">Download telemetry audits, crop saturation metrics, and system log archives.</p>
        </div>
      </div>

      {/* 1. Active Selection Report Console */}
      {selectedFarm && metrics ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/0 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ClipboardList className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Target Field Scanned
                </span>
                <span className="text-[10px] text-slate-500 font-bold font-mono">
                  Asset ID: {selectedFarm.id}
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                Active Telemetry Report for {selectedFarm.village || selectedFarm.name.split(' Field')[0]} Plot
              </h3>
              <p className="text-xs text-slate-400 leading-normal max-w-xl">
                Ready to export dynamic diagnostic analytics sheet for this field sector. Includes crop health metrics (NDVI), soil saturation (VWC), weather logs, and AI irrigation recommendations.
              </p>
            </div>
          </div>

          {/* Export options grid */}
          <div className="flex flex-wrap items-center gap-3 select-none">
            {/* PDF export */}
            <button
              onClick={() => generatePDFReport({
                farmId: selectedFarm.id,
                state: selectedFarm.state,
                district: selectedFarm.district,
                crop: selectedFarm.crop,
                area: selectedFarm.area,
                ndvi: selectedFarm.ndvi || '0.78',
                moisture: selectedFarm.moisture,
                status: selectedFarm.status,
                soilType: selectedFarm.soilType,
                weather: `${metrics.temp}, Humidity ${metrics.humidity}, Wind ${metrics.windSpeed}`,
                recommendation: metrics.recommendation,
                waterSaving: metrics.waterSaving,
                actionPlan: metrics.actionPlan,
                expectedImpact: metrics.expectedImpact,
                scenarioSummary: `${metrics.priority} Priority status override`
              })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-[#050816] font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all cursor-pointer text-xs"
            >
              <Download className="h-4 w-4" /> PDF Report
            </button>

            {/* CSV export */}
            <button
              onClick={() => generateCSVReport({
                farmId: selectedFarm.id,
                state: selectedFarm.state,
                district: selectedFarm.district,
                crop: selectedFarm.crop,
                area: selectedFarm.area,
                ndvi: selectedFarm.ndvi || '0.78',
                moisture: selectedFarm.moisture,
                status: selectedFarm.status,
                soilType: selectedFarm.soilType,
                weather: `${metrics.temp}, Humidity ${metrics.humidity}, Wind ${metrics.windSpeed}`,
                recommendation: metrics.recommendation,
                waterSaving: metrics.waterSaving,
                actionPlan: metrics.actionPlan,
                expectedImpact: metrics.expectedImpact,
                scenarioSummary: `${metrics.priority} Priority status override`
              })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition-all cursor-pointer text-xs"
            >
              <Table className="h-4 w-4 text-cyan-400" /> CSV Sheet
            </button>

            {/* Browser print */}
            <button
              onClick={() => printReport({
                farmId: selectedFarm.id,
                state: selectedFarm.state,
                district: selectedFarm.district,
                crop: selectedFarm.crop,
                area: selectedFarm.area,
                ndvi: selectedFarm.ndvi || '0.78',
                moisture: selectedFarm.moisture,
                status: selectedFarm.status,
                soilType: selectedFarm.soilType,
                weather: `${metrics.temp}, Humidity ${metrics.humidity}, Wind ${metrics.windSpeed}`,
                recommendation: metrics.recommendation,
                waterSaving: metrics.waterSaving,
                actionPlan: metrics.actionPlan,
                expectedImpact: metrics.expectedImpact,
                scenarioSummary: `${metrics.priority} Priority status override`
              })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10 transition-all cursor-pointer text-xs"
            >
              <Printer className="h-4 w-4 text-blue-400" /> Print Summary
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center gap-4 text-left select-none">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-300 text-xs">No Active Selection Diagnostic Cached</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 max-w-lg">
              To download a specific farm telemetry report, inspect a district on the Dashboard map, select a crop field polygon to trigger the AI analysis cycle, then return here to export.
            </p>
          </div>
        </div>
      )}

      {/* 2. Reports Table Panel */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 mb-4 select-none gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide font-sans">Available Historical Telemetry Reports</h3>
              <p className="text-[10px] text-slate-400">Select and download logs for active irrigation parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/2 text-[10px] font-bold text-slate-300 hover:bg-white/5 transition-all">
              <Filter className="h-3 w-3" /> Filters
            </button>
          </div>
        </div>

        {/* List of reports */}
        <div className="space-y-3">
          {reports.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl border border-white/5 bg-white/1 hover:bg-white/3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-slate-500/5 text-slate-400 border border-white/5 mt-0.5">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-xs text-slate-200">{r.title}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {r.date}</span>
                    <span>Zone: <span className="text-slate-400">{r.districts}</span></span>
                    <span>Format: <span className="text-blue-400 uppercase font-mono">{r.type}</span></span>
                  </div>
                </div>
              </div>

              {/* Action buttons inside each row */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 border-t border-white/5 md:border-none pt-3.5 md:pt-0 select-none">
                <span className="text-xs font-semibold text-slate-400 font-mono pr-2">{r.size}</span>
                
                {/* PDF */}
                <button
                  onClick={() => generatePDFReport(r)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#090d26] hover:bg-emerald-500 hover:text-[#050816] text-[10px] font-bold text-emerald-400 border border-emerald-500/20 hover:border-emerald-500 transition-all duration-300 shadow-md cursor-pointer"
                  title="Export PDF"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>

                {/* CSV */}
                <button
                  onClick={() => generateCSVReport(r)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#090d26] hover:bg-cyan-500 hover:text-[#050816] text-[10px] font-bold text-cyan-400 border border-cyan-500/20 hover:border-cyan-500 transition-all duration-300 shadow-md cursor-pointer"
                  title="Export CSV"
                >
                  <Table className="h-3 w-3" /> CSV
                </button>

                {/* Print */}
                <button
                  onClick={() => printReport(r)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#090d26] hover:bg-blue-500 hover:text-[#050816] text-[10px] font-bold text-blue-400 border border-blue-500/20 hover:border-blue-500 transition-all duration-300 shadow-md cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="h-3 w-3" /> Print
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Reports
