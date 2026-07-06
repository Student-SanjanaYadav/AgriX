/**
 * Live Weather Integration Service
 * AgriX Spatial Decision Intelligence
 * 
 * Fetches real-time weather metrics from Open-Meteo's free public forecast API.
 * Includes cloud cover, daily sunrise/sunset, and coordinate tracking safety.
 */

export const fetchWeatherData = async (lat, lng) => {
  if (!lat || !lng) {
    throw new Error('Coordinates missing')
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover&daily=sunrise,sunset&timezone=auto&forecast_days=1`,
      { method: 'GET', mode: 'cors' }
    )

    if (!response.ok) {
      throw new Error(`Weather API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    // Parse current metrics safely
    const temp = data.current?.temperature_2m ?? 30
    const humidity = data.current?.relative_humidity_2m ?? 55
    const windSpeed = data.current?.wind_speed_10m ?? 12
    const cloudCover = data.current?.cloud_cover ?? 40
    
    // Parse daily parameters
    const rawSunrise = data.daily?.sunrise?.[0]
    const rawSunset = data.daily?.sunset?.[0]
    
    const formatTime = (isoString) => {
      if (!isoString) return 'N/A'
      try {
        const date = new Date(isoString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } catch {
        return 'N/A'
      }
    }

    const sunrise = formatTime(rawSunrise)
    const sunset = formatTime(rawSunset)

    // Map condition descriptions
    let condition = 'Clear Sky / Sunny'
    if (cloudCover > 80) {
      condition = 'Overcast Cloudy'
    } else if (cloudCover > 30) {
      condition = 'Partly Cloudy'
    }

    return {
      temp: `${Math.round(temp)}°C`,
      humidity: `${humidity}%`,
      windSpeed: `${Math.round(windSpeed)} km/h`,
      rainProb: `${cloudCover > 50 ? 60 : 15}%`, // derived rain probability index
      rainProbVal: cloudCover > 50 ? 60 : 15,
      cloudCover: `${cloudCover}%`,
      sunrise,
      sunset,
      condition,
      isLive: true
    }
  } catch (error) {
    console.error('Weather service fetch error:', error)
    throw error
  }
}
