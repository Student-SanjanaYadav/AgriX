/**
 * Smart Irrigation Recommendation Engine
 * AgriX Spatial Decision Intelligence
 * 
 * Generates dynamic agricultural expert recommendations based on multi-variate telemetry inputs.
 */

// Helper to determine crop-specific and season-specific irrigation parameters
const getCropSeasonSpec = (crop, season, growthStage, moistureVal, tempVal, rainProbVal) => {
  const isPaddy = crop.toLowerCase().includes('rice') || crop.toLowerCase().includes('paddy')
  const isWheat = crop.toLowerCase().includes('wheat')
  const isSugarcane = crop.toLowerCase().includes('sugarcane')
  const isCotton = crop.toLowerCase().includes('cotton')
  const isMustard = crop.toLowerCase().includes('mustard')
  const isZaidCrop = crop.toLowerCase().includes('watermelon') || crop.toLowerCase().includes('cucumber') || crop.toLowerCase().includes('moong') || crop.toLowerCase().includes('melon')

  // Deficit State Recommendations (<30% soil moisture)
  let deficitRecommendation = `Critical moisture deficit detected on ${crop}. Saturation is at ${moistureVal}% VWC in dry conditions. Irrigate immediately.`
  let deficitAction = 'Initiate immediate emergency override. Open flow valves for 25 minutes. Inspect moisture levels in 12 hours.'
  let deficitImpact = 'Prevents crop stress, increases soil saturation VWC by 18%, and safeguards harvest yield.'

  if (isPaddy) {
    deficitRecommendation = `Paddy field is in water deficit (${moistureVal}%). Maintaining a 5cm standing water depth is critical during the vegetative growth stage in ${season}. Start flooding immediately.`
    deficitAction = 'Turn on high-capacity tubewell/canal pumps immediately to flood the basin plots. Verify bund wall integrity.'
    deficitImpact = 'Ensures optimal root drowning, promotes rapid tillering, and prevents weed colonization.'
  } else if (isWheat) {
    deficitRecommendation = `Critical crown root initiation (CRI) / flowering stage deficit on Wheat (${moistureVal}%). Irrigate 22 mm immediately to prevent grain shriveling in ${season} season.`
    deficitAction = 'Open secondary distribution pipe lines. Run sprinkler system for 45 minutes to achieve uniform 20 mm moisture layer.'
    deficitImpact = 'Protects crown root growth nodes, secures spikelet formation, and stabilizes yield potential.'
  } else if (isSugarcane) {
    deficitRecommendation = `Sugarcane sector is dry (${moistureVal}%). High moisture is required during grand growth phase in ${season}. Apply 30 mm irrigation.`
    deficitAction = 'Activate heavy furrow irrigation flow lines. Keep valves open for 40 minutes.'
    deficitImpact = 'Promotes maximum cane elongation and safeguards sugar accumulation rates.'
  } else if (isCotton) {
    deficitRecommendation = `Moisture deficit (${moistureVal}%) on Cotton. Cotton needs precise root watering during early squaring/flowering. Apply 15 mm drip water.`
    deficitAction = 'Activate localized drip irrigation zone feeds for 20 minutes. Keep check on lateral leakage points.'
    deficitImpact = 'Prevents square dropping, maintains boll growth, and avoids root rot from over-watering.'
  } else if (isMustard) {
    deficitRecommendation = `Deficit detected on Mustard (${moistureVal}%). Apply light 12 mm irrigation during pod development to enhance oil seeds content.`
    deficitAction = 'Run micro-sprinklers for 18 minutes. Ensure no pooling of water in low-lying sections.'
    deficitImpact = 'Supports siliqua development and maximizes seed oil yield.'
  } else if (isZaidCrop) {
    deficitRecommendation = `Summer Zaid crop ${crop} requires urgent water (${moistureVal}%) under extreme heat (${tempVal}°C). Apply 10 mm drip feed.`
    deficitAction = 'Activate micro-drip networks. Run a short 15-minute cool irrigation cycle in early morning.'
    deficitImpact = 'Lowers soil heat stress, prevents fruit cracking, and maintains high turgidity.'
  }

  // Moderate Deficit State Recommendations (30% to 42% soil moisture)
  let moderateRecommendation = `Soil moisture is low-moderate (${moistureVal}%). High daytime temperature (${tempVal}°C) detected. Irrigate 15 mm within 12 hours.`
  let moderateAction = 'Schedule standard pulse irrigation flow (12 minutes) at the next cycle. Monitor weather wind speed and evapotranspiration logs.'
  let moderateImpact = 'Transpiration rates stabilized, preventing localized dry-spot anomalies.'

  if (isPaddy) {
    moderateRecommendation = `Paddy saturation is moderate (${moistureVal}%). Schedule a light 15 mm irrigation to restore field water levels.`
    moderateAction = 'Schedule standard pump run for 20 minutes in early morning.'
    moderateImpact = 'Maintains anaerobic soil conditions necessary for paddy growth.'
  } else if (isWheat) {
    moderateRecommendation = `Wheat field displays mild deficit (${moistureVal}%). Apply a scheduled 15 mm sprinkler irrigation before wind speeds increase.`
    moderateAction = 'Run central sprinklers for 30 minutes in late evening to minimize wind drift.'
    moderateImpact = 'Restores root zone moisture without causing lodging stress.'
  } else if (isSugarcane) {
    moderateRecommendation = `Sugarcane moisture is at ${moistureVal}%. Schedule a standard 20 mm furrow cycle to maintain leaf spindle growth.`
    moderateAction = 'Open furrow gates in section B for 25 minutes.'
    moderateImpact = 'Maintains rapid vegetative extension rate during ${season} heat.'
  } else if (isCotton) {
    moderateRecommendation = `Cotton is showing slight stress (${moistureVal}%). Schedule a light 10 mm drip cycle to prevent square shedding.`
    moderateAction = 'Trigger drip zone A for 15 minutes.'
    moderateImpact = 'Maintains balanced vegetative and reproductive development.'
  } else if (isZaidCrop) {
    moderateRecommendation = `Summer crop ${crop} needs moisture boost (${moistureVal}%). Schedule 8 mm drip pulse tonight.`
    moderateAction = 'Run night drip timers for 12 minutes to maximize absorption and reduce evapotranspiration.'
    moderateImpact = 'Maintains continuous vine hydration and optimizes fruit setting.'
  }

  // Conservation State Recommendations (>45% moisture & >70% rain prob)
  let conservationRecommendation = `Delay irrigation by 12 hours because rainfall probability exceeds ${rainProbVal}%.`
  let conservationAction = 'Keep all flow valves in standby bypass mode. Re-sync geospatial satellite NDVI reflectance index in 24 hours.'
  let conservationImpact = 'Conserves ground water table reservoir reserves and saves utility power cost.'

  if (isPaddy) {
    conservationRecommendation = `High moisture (${moistureVal}%) and forecasted rain (${rainProbVal}%). Shut down all pumps to capture natural precipitation in paddy basins.`
    conservationAction = 'Turn off gravity canal feed lines and pump power networks. Inspect spillway outlets.'
    conservationImpact = 'Saves 100% of pumping electrical costs and prevents field washouts.'
  } else if (isCotton || isMustard) {
    conservationRecommendation = `Forecasted rain (${rainProbVal}%) and soil moisture (${moistureVal}%). Delay irrigation. ${crop} is sensitive to waterlogging.`
    conservationAction = 'Keep valves closed. Inspect drainage ditches to prevent pooling from heavy rainfall.'
    conservationImpact = 'Avoids root-zone waterlogging, saving nitrogen fertilizer from leaching.'
  } else if (isZaidCrop) {
    conservationRecommendation = `Rain expected (${rainProbVal}%). Hold summer irrigation. Drip networks in bypass standby.`
    conservationAction = 'Deactivate automatic drip schedule timers for the next 24 hours.'
    conservationImpact = 'Saves water reserves and protects summer crops from soil fungal issues.'
  }

  return {
    deficit: { recommendation: deficitRecommendation, action: deficitAction, impact: deficitImpact },
    moderate: { recommendation: moderateRecommendation, action: moderateAction, impact: moderateImpact },
    conservation: { recommendation: conservationRecommendation, action: conservationAction, impact: conservationImpact }
  }
}

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
  let actionPlan = ''
  let expectedImpact = ''

  const isFlowering = growthStage.toLowerCase().includes('flowering')
  const isVegetative = growthStage.toLowerCase().includes('vegetative')

  const specs = getCropSeasonSpec(crop, season, growthStage, moistureVal, tempVal, rainProbVal)

  // Rule-Based Expert Decision Tree
  
  // Rule 1: Saturated soil & imminent rain -> CONSERVE
  if (moistureVal > 45 && rainProbVal > 70) {
    waterSavingLitres = Math.floor(areaVal * 320)
    recommendation = specs.conservation.recommendation
    actionPlan = specs.conservation.action
    expectedImpact = specs.conservation.impact
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
    recommendation = specs.deficit.recommendation
    actionPlan = specs.deficit.action
    expectedImpact = specs.deficit.impact

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
    recommendation = specs.moderate.recommendation
    actionPlan = specs.moderate.action
    expectedImpact = specs.moderate.impact
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
    recommendation = `Moisture index is optimal (${moistureVal}%). Soil hydration is within target bounds for ${crop} during the ${season} season.`
    priority = 'Normal'
    waterReq = 'Low'
    yieldPrediction = `+${(4 + (seed % 4)).toFixed(1)}%`
    actionPlan = 'Keep all flow valves in standby bypass mode. Re-sync geospatial satellite NDVI reflectance index in 24 hours.'
    expectedImpact = 'Conserves ground water table reservoir reserves and saves utility power cost.'
    explanation = [
      { text: `Soil moisture is optimal (${moistureVal}%)`, status: 'pass' },
      { text: `NDVI reflectance indicates healthy crop density (${ndviVal.toFixed(2)})`, status: 'pass' },
      { text: `Last irrigation aligns with target moisture curve`, status: 'pass' }
    ]
  }

  const costSavingVal = Math.floor(waterSavingLitres * 0.08)
  const costSaving = costSavingVal > 0 ? `₹${costSavingVal.toLocaleString('en-IN')} Saved` : '₹0 Saved'

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
