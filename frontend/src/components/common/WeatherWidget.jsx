import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Droplets, Wind, CloudRain, Sun, Calendar, Clock, Compass } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const WeatherWidget = ({ selectedFarm, weather: propWeather, sourceStatus }) => {
  const { t } = useLanguage()
  const defaultWeather = {
    location: 'Central India Avg',
    temp: '32°C',
    condition: 'Partly Cloudy',
    humidity: '56%',
    rainProb: '15%',
    windSpeed: '12 km/h',
    cloudCover: '35%',
    sunrise: '05:34 AM',
    sunset: '06:58 PM',
    icon: CloudSun,
    textColor: 'text-amber-400'
  }

  const getSelectedWeather = (farm) => {
    const idPrefix = farm?.id?.split('-')?.[1]?.toUpperCase() || 'PB'

    switch (idPrefix) {
      case 'RJ':
        return {
          location: `${farm?.district ?? 'Jaipur'} Hub`,
          temp: '39°C',
          condition: 'Arid / Extreme Heat',
          humidity: '28%',
          rainProb: '5%',
          windSpeed: '18 km/h',
          cloudCover: '10%',
          sunrise: '05:42 AM',
          sunset: '07:18 PM',
          icon: Sun,
          textColor: 'text-amber-500'
        }
      case 'GJ':
        return {
          location: `${farm?.district ?? 'Ahmedabad'} Hub`,
          temp: '36°C',
          condition: 'Clear Sky / Sunny',
          humidity: '40%',
          rainProb: '8%',
          windSpeed: '14 km/h',
          cloudCover: '15%',
          sunrise: '06:02 AM',
          sunset: '07:22 PM',
          icon: Sun,
          textColor: 'text-amber-400'
        }
      case 'PB':
      case 'HR':
        return {
          location: `${farm?.district ?? 'Ludhiana'} Hub`,
          temp: '30°C',
          condition: 'Humid / Light Overcast',
          humidity: '68%',
          rainProb: '30%',
          windSpeed: '9 km/h',
          cloudCover: '45%',
          sunrise: '05:28 AM',
          sunset: '07:34 PM',
          icon: CloudSun,
          textColor: 'text-sky-300'
        }
      case 'UP':
      case 'BR':
      case 'CG':
        return {
          location: `${farm?.district ?? 'Lucknow'} Hub`,
          temp: '31°C',
          condition: 'Localized Showers',
          humidity: '76%',
          rainProb: '55%',
          windSpeed: '11 km/h',
          cloudCover: '85%',
          sunrise: '05:15 AM',
          sunset: '06:48 PM',
          icon: CloudRain,
          textColor: 'text-cyan-400'
        }
      default:
        return {
          location: `${farm?.district ?? 'Central'} Hub`,
          temp: '32°C',
          condition: 'Partly Cloudy',
          humidity: '55%',
          rainProb: '12%',
          windSpeed: '12 km/h',
          cloudCover: '35%',
          sunrise: '05:30 AM',
          sunset: '06:50 PM',
          icon: CloudSun,
          textColor: 'text-amber-400'
        }
    }
  }

  let activeWeather = propWeather
  if (!activeWeather) {
    activeWeather = selectedFarm ? getSelectedWeather(selectedFarm) : defaultWeather
  }

  // Bind parameters or set default fallbacks
  const cloudVal = activeWeather?.cloudCover || '40%'
  const sunriseVal = activeWeather?.sunrise || '05:30 AM'
  const sunsetVal = activeWeather?.sunset || '07:00 PM'

  const rainVal = parseFloat(activeWeather?.rainProb) || 0
  const WeatherIcon = rainVal > 50 ? CloudRain : rainVal > 20 ? CloudSun : Sun
  const textColor = rainVal > 50 ? 'text-cyan-400' : rainVal > 20 ? 'text-sky-300' : 'text-amber-400'

  const lastUpdatedTime = useMemo(() => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes} ${ampm}`
  }, [selectedFarm?.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-full min-h-[360px] rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl p-7 flex flex-col justify-between overflow-hidden select-none text-left"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-3">
        <div>
          <h3 className="font-black text-slate-100 text-sm md:text-base tracking-wider uppercase">{t("Weather")}</h3>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {activeWeather.location || (selectedFarm ? `${selectedFarm.district} Region` : 'Central Agricultural Hub')}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          <WeatherIcon className={`h-8 w-8 shrink-0 ${textColor}`} />
          {selectedFarm && (
            <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1.5 shrink-0
              ${sourceStatus === 'live' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.08)]' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }
            `}>
              <span className={`h-1.5 w-1.5 rounded-full ${sourceStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {sourceStatus === 'live' ? t('Live Weather Data') : t('Using Last Available Weather Data')}
            </span>
          )}
        </div>
      </div>

      {/* Main stats */}
      <div className="flex items-baseline gap-3 py-3">
        <span className="text-5xl font-black tracking-tight text-slate-100 font-mono">{activeWeather.temp}</span>
        <span className="text-sm font-black text-slate-400 uppercase tracking-wide">{t(activeWeather.condition)}</span>
      </div>

      {/* 2x3 Atmospheric metrics grid */}
      <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 mt-1 text-xs">
        {/* Humidity */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <Droplets className="h-5 w-5 text-cyan-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Humidity")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{activeWeather.humidity}</span>
        </div>

        {/* Rain probability */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <CloudRain className="h-5 w-5 text-sky-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Rain Probability")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{activeWeather.rainProb}</span>
        </div>

        {/* Wind speed */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <Wind className="h-5 w-5 text-teal-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Wind Speed")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{activeWeather.windSpeed}</span>
        </div>

        {/* Cloud Cover */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <CloudSun className="h-5 w-5 text-indigo-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Cloud Cover")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{cloudVal}</span>
        </div>

        {/* Sunrise */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <Clock className="h-5 w-5 text-amber-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Sunrise")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{sunriseVal}</span>
        </div>

        {/* Sunset */}
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/2 border border-white/5 text-center">
          <Compass className="h-5 w-5 text-orange-400 mb-1.5 shrink-0" />
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">{t("Sunset")}</span>
          <span className="font-black text-slate-200 mt-0.5 font-mono text-sm">{sunsetVal}</span>
        </div>
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500 pt-3 border-t border-white/5 select-none mt-1">
        <Calendar className="h-3.5 w-3.5" />
        <span>Telemetry Updated: {lastUpdatedTime}</span>
      </div>
    </motion.div>
  )
}

export default WeatherWidget
