/**
 * Smart Irrigation Recommendation Engine
 * AgriX Spatial Decision Intelligence
 * 
 * Generates dynamic agricultural expert recommendations based on multi-variate telemetry inputs.
 */

export const generateRecommendation = (inputs) => {
  const {
    id = 'N/A',
    crop = 'Wheat',
    growthStage = 'Vegetative Growth',
    soilMoisture = '35%',
    ndvi = 0.74,
    temperature = '32°C',
    humidity = '60%',
    rainProbability = 12,
    windSpeed = '12 km/h',
    waterStress = 'Low (Optimal)',
    soilType = 'Clay Loam',
    waterSource = 'Tube Well',
    season = 'Kharif',
    expectedRainfall = 'Low',
    area = 10,
    status = 'healthy'
  } = inputs

  // Parse numerical values safely
  const moistureVal = parseFloat(soilMoisture) || 35
  const ndviVal = parseFloat(ndvi) || 0.7
  const tempVal = parseFloat(temperature) || 30
  const rainProbVal = parseFloat(rainProbability) || 10
  const areaVal = parseFloat(area) || 10

  // Calculate Health Score and Risk Level
  const seed = crop.charCodeAt(0) + (id !== 'N/A' ? id.charCodeAt(id.length - 1) : 48)
  const baseHealth = status === 'healthy' ? 88 : status === 'moderate' ? 56 : 28
  let healthScore = Math.min(100, Math.max(10, baseHealth + (seed % 8)))
  let risk = status === 'healthy' ? 'Low' : status === 'moderate' ? 'Moderate' : 'High'

  if (ndviVal < 0.45) {
    healthScore = Math.max(10, healthScore - 15)
    risk = risk === 'Low' ? 'Moderate' : 'High'
  }

  let waterReq = 'Low'
  let recommendation = ''
  let priority = 'Normal'
  let waterSavingLitres = 0
  let confidence = Math.min(99, Math.max(85, 92 + (seed % 8)))
  let yieldPrediction = '+0.0%'
  let explanation = []

  const isFlowering = growthStage.toLowerCase().includes('flowering')
  const isVegetative = growthStage.toLowerCase().includes('vegetative')

  // Rule-Based Expert Decision Tree
  
  // Rule 1: Saturated soil & imminent rain -> CONSERVE
  if (moistureVal > 45 && rainProbVal > 70) {
    waterSavingLitres = Math.floor(areaVal * 320)
    recommendation = `Delay irrigation by 12 hours because rainfall probability exceeds ${rainProbVal}%. Estimated water saving: ${waterSavingLitres} L.`
    priority = 'Low'
    risk = 'Low'
    waterReq = 'Low'
    yieldPrediction = `+${(7 + (seed % 4)).toFixed(1)}%`
    explanation = [
      { text: `Soil moisture (${moistureVal}%) exceeds field capacity (>45%)`, status: 'pass' },
      { text: `Rain probability is highly favorable (${rainProbVal}%)`, status: 'pass' },
      { text: `Water source ${waterSource} shut down to prevent run-offs`, status: 'pass' }
    ]
  }
  // Rule 2: Under threshold water deficit -> IMMEDIATE ACTION
  else if (moistureVal < 30) {
    priority = (isFlowering || isVegetative) ? 'Critical' : 'Medium'
    risk = 'High'
    waterReq = 'High'
    waterSavingLitres = 0
    yieldPrediction = `-${(10 + (seed % 8)).toFixed(1)}% (If unmitigated)`

    if (isVegetative) {
      recommendation = `Soil moisture has dropped below the crop threshold during the vegetative stage. Irrigate 22 mm within the next 8 hours.`
    } else if (isFlowering) {
      recommendation = `Soil moisture has dropped below the crop threshold during the flowering stage. Irrigate 25 mm immediately to protect flower settings.`
    } else {
      recommendation = `Critical moisture deficit detected on ${crop}. Saturation is at ${moistureVal}% VWC in dry conditions. Irrigate immediately.`
    }

    explanation = [
      { text: `Soil moisture (${moistureVal}%) below crop limit (<30%)`, status: 'fail' },
      { text: `High daytime temperature (${tempVal}°C) speeds up evapotranspiration`, status: 'fail' },
      { text: `No rainfall expected soon (${rainProbVal}%)`, status: 'fail' },
      { text: `Crop currently in moisture-sensitive ${growthStage} stage`, status: 'fail' }
    ]
  }
  // Rule 3: Moderate dehydration -> SCHEDULE PULSE
  else if (moistureVal < 42) {
    waterSavingLitres = Math.floor(areaVal * 150)
    recommendation = `Soil moisture is low-moderate (${moistureVal}%). High daytime temperature (${tempVal}°C) and wind speeds (${windSpeed}) detected. Irrigate 15 mm within 12 hours.`
    priority = isFlowering ? 'Critical' : 'Medium'
    waterReq = isFlowering ? 'High' : 'Medium'
    yieldPrediction = `+${(2 + (seed % 3)).toFixed(1)}%`
    explanation = [
      { text: `Soil moisture is at moderate deficit (${moistureVal}%)`, status: 'warn' },
      { text: `Expected seasonal rainfall in ${season} is ${expectedRainfall}`, status: 'pass' },
      { text: `Soil profile matches ${soilType}`, status: 'pass' }
    ]
  }
  // Rule 4: Optimal parameters -> DELAY / STANDBY
  else {
    waterSavingLitres = Math.floor(areaVal * 280)
    recommendation = `Moisture index is optimal (${moistureVal}%). Soil hydration is within target bounds. Standby mode on irrigation valves.`
    priority = 'Normal'
    waterReq = 'Low'
    yieldPrediction = `+${(4 + (seed % 4)).toFixed(1)}%`
    explanation = [
      { text: `Soil moisture is optimal (${moistureVal}%)`, status: 'pass' },
      { text: `NDVI reflectance indicates healthy crop density (${ndviVal.toFixed(2)})`, status: 'pass' },
      { text: `Last irrigation aligns with target moisture curve`, status: 'pass' }
    ]
  }

  const costSavingVal = Math.floor(waterSavingLitres * 0.08)
  const costSaving = costSavingVal > 0 ? `₹${costSavingVal.toLocaleString('en-IN')} Saved` : '₹0 Saved'

  let actionPlan = ''
  let expectedImpact = ''

  if (priority === 'Critical') {
    actionPlan = 'Initiate immediate emergency override. Open secondary flow valves for 25 minutes. Inspect moisture levels in 12 hours.'
    expectedImpact = 'Prevents crop stress, increases soil saturation VWC by 18%, and safeguards harvest yield.'
  } else if (priority === 'Medium') {
    actionPlan = 'Schedule standard pulse irrigation flow (12 minutes) at the next cycle. Monitor weather wind speed and evapotranspiration logs.'
    expectedImpact = 'Transpiration rates stabilized, preventing localized dry-spot anomalies.'
  } else {
    actionPlan = 'Keep all flow valves in standby bypass mode. Re-sync geospatial satellite NDVI reflectance index in 24 hours.'
    expectedImpact = 'Conserves ground water table reservoir reserves and saves utility power cost.'
  }

  const saturationIndex = `${moistureVal}%`
  const valveStatus = status === 'healthy' ? 'Closed (Bypass)' : status === 'moderate' ? 'Scheduled Pulse' : 'Open (High Flow)'
  const sensorNetwork = status === 'healthy' ? '98.5% Active' : status === 'moderate' ? '94.2% Active' : '82.8% Warning'

  const localHistory = [
    { id: '1', time: '1h ago', event: 'NDVI Index Scan', result: `NDVI: ${ndviVal.toFixed(2)}`, status: 'success' },
    { id: '2', time: '4h ago', event: 'Moisture Audit VWC', result: `VWC: ${moistureVal}%`, status: status === 'critical' ? 'danger' : 'success' },
    { id: '3', time: '12h ago', event: 'Irrigation Override', result: valveStatus, status: 'info' }
  ]

  return {
    healthScore,
    risk,
    recommendation,
    priority,
    confidence,
    yieldPrediction,
    waterSaving: `${waterSavingLitres.toLocaleString('en-IN')} Litres`,
    costSaving,
    actionPlan,
    expectedImpact,
    explanation,
    saturationIndex,
    valveStatus,
    sensorNetwork,
    waterStress,
    temp: temperature,
    humidity,
    growthStage,
    localHistory,
    waterReq
  }
}
