import React from 'react'
import { motion } from 'framer-motion'
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets,
  Gauge,
  ThermometerSun
} from 'lucide-react'

const Weather = () => {
  const forecast = [
    { day: 'Mon', temp: '32°C', icon: CloudSun, cond: 'Partly Cloudy', humidity: '55%', wind: '12 km/h' },
    { day: 'Tue', temp: '34°C', icon: Sun, cond: 'Sunny / Clear', humidity: '42%', wind: '15 km/h' },
    { day: 'Wed', temp: '30°C', icon: CloudRain, cond: 'Light Showers', humidity: '76%', wind: '10 km/h' },
    { day: 'Thu', temp: '29°C', icon: CloudLightning, cond: 'Thunderstorms', humidity: '82%', wind: '18 km/h' },
    { day: 'Fri', temp: '31°C', icon: CloudSun, cond: 'Partly Cloudy', humidity: '64%', wind: '11 km/h' },
    { day: 'Sat', temp: '33°C', icon: Sun, cond: 'Sunny / Clear', humidity: '45%', wind: '14 km/h' },
    { day: 'Sun', temp: '32°C', icon: CloudSun, cond: 'Scattered Clouds', humidity: '50%', wind: '9 km/h' }
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">National Weather Intelligence</h2>
          <p className="text-sm text-slate-400">Localized climate grids, microclimate forecasts, and moisture evaporation telemetry.</p>
        </div>
      </div>

      {/* Evaporative indices grids */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Evapotranspiration Index</span>
            <p className="text-2xl font-bold text-slate-100">5.4 mm/day</p>
            <span className="text-[10px] text-amber-400 font-semibold">
              Moderate Evaporative Stress
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ThermometerSun className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Atmospheric Pressure</span>
            <p className="text-2xl font-bold text-slate-100">1,012 hPa</p>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Stable High Pressure
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Gauge className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Evaporation Rate</span>
            <p className="text-2xl font-bold text-slate-100">62% RH</p>
            <span className="text-[10px] text-blue-400 font-semibold">
              Optimal moisture retention
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Droplets className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4 select-none">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">7-Day Microclimate Outlook</h3>
            <p className="text-[10px] text-slate-400">Evaporation forecasting models</p>
          </div>
        </div>

        {/* Forecast grid */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center mt-2">
          {forecast.map((f, idx) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.day}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-200 flex flex-col items-center justify-between gap-3"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{f.day}</span>
                <Icon className="h-6 w-6 text-slate-300 my-1 shrink-0" />
                <span className="text-lg font-bold text-slate-100 font-mono">{f.temp}</span>
                
                <div className="w-full border-t border-white/5 pt-2 mt-1 space-y-1 text-[9px] font-semibold text-slate-500 text-left">
                  <div className="flex justify-between">
                    <span>Humid:</span>
                    <span className="text-slate-300 font-mono">{f.humidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind:</span>
                    <span className="text-slate-300 font-mono truncate max-w-[40px]">{f.wind}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default Weather
