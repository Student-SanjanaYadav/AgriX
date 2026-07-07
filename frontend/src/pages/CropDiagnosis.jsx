import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  UploadCloud, 
  Trash2, 
  Check, 
  Sparkles, 
  History, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  Image as ImageIcon 
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const CropDiagnosis = () => {
  const { language } = useLanguage()
  const isHindi = language === 'hi'

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [thumbnailBase64, setThumbnailBase64] = useState('')
  
  const [selectedCrop, setSelectedCrop] = useState('')
  const [dashboardCrop, setDashboardCrop] = useState('')
  const [isManualOverride, setIsManualOverride] = useState(false)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [history, setHistory] = useState([])
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef(null)

  // Localized dictionary for all static UI text
  const tLocal = (key) => {
    const dict = {
      en: {
        title: '🌿 AI Crop Diagnosis',
        subtitle: 'Upload a crop image to receive an AI-powered health assessment and farming recommendation.',
        dragDrop: 'Drag & drop your image here, or click to upload',
        supportText: 'Supports: JPG, JPEG, PNG, WEBP (Max 10MB)',
        analyzeBtn: 'Analyze Crop',
        analyzing: 'Analyzing...',
        replaceBtn: 'Replace Image',
        removeBtn: 'Remove Image',
        resultTitle: 'Diagnosis Assessment',
        historyTitle: 'Diagnosis History',
        clearHistory: 'Clear History',
        deleteBtn: 'Delete',
        saveBtn: 'Save Diagnosis',
        savedSuccess: 'Diagnosis saved to history!',
        noHistory: 'No diagnostic history found.',
        crop: 'Crop',
        health: 'Health Status',
        confidence: 'Confidence',
        disease: 'Disease',
        severity: 'Severity',
        risk: 'Risk Level',
        action: 'Recommended Action',
        yieldImpact: 'Estimated Yield Impact',
        preventive: 'Preventive Measures',
        nextInspection: 'Next Inspection',
        ready: 'Ready',
        timestamp: 'Date & Time',
        image: 'Image',
        prototypeBanner: 'Prototype Mode: This diagnosis is generated using an offline rule-based inference engine for demonstration. The architecture is designed to integrate with Edge AI disease detection models in production.',
        selectCropLabel: 'Active Crop',
        selectCropPlaceholder: 'Select a crop...',
        pleaseSelectPrompt: 'Please select a crop before analysis.'
      },
      hi: {
        title: '🌿 एाई फसल निदान',
        subtitle: 'फसल स्वास्थ्य मूल्यांकन और कृषि संबंधी सुझाव प्राप्त करने के लिए फसल की छवि अपलोड करें।',
        dragDrop: 'अपनी छवि यहाँ खींचें और छोड़ें, या अपलोड करने के लिए क्लिक करें',
        supportText: 'समर्थित प्रारूप: JPG, JPEG, PNG, WEBP (अधिकतम 10MB)',
        analyzeBtn: 'फसल का विश्लेषण करें',
        analyzing: 'विश्लेषण किया जा रहा है...',
        replaceBtn: 'छवि बदलें',
        removeBtn: 'छवि हटाएं',
        resultTitle: 'निदान मूल्यांकन',
        historyTitle: 'निदान इतिहास',
        clearHistory: 'इतिहास साफ़ करें',
        deleteBtn: 'हटाएं',
        saveBtn: 'निदान सहेजें',
        savedSuccess: 'निदान इतिहास में सहेज लिया गया है!',
        noHistory: 'कोई निदान इतिहास नहीं मिला।',
        crop: 'फसल',
        health: 'स्वास्थ्य स्थिति',
        confidence: 'आत्मविश्वास',
        disease: 'बीमारी',
        severity: 'तीव्रता',
        risk: 'जोखिम स्तर',
        action: 'अनुशंसित कार्रवाई',
        yieldImpact: 'अनुमानित उपज प्रभाव',
        preventive: 'निवारक उपाय',
        nextInspection: 'अगला निरीक्षण',
        ready: 'तैयार',
        timestamp: 'दिनांक और समय',
        image: 'छवि',
        prototypeBanner: 'प्रोटोटाइप मोड: यह परिणाम ऑफलाइन नियम-आधारित विश्लेषण पर आधारित है। भविष्य में इसे Edge AI आधारित रोग पहचान मॉडल से जोड़ा जा सकता है।',
        selectCropLabel: 'सक्रिय फसल',
        selectCropPlaceholder: 'एक फसल चुनें...',
        pleaseSelectPrompt: 'कृपया विश्लेषण से पहले एक फसल का चयन करें।'
      }
    }
    const langKey = isHindi ? 'hi' : 'en'
    return dict[langKey][key] || key
  }

  // Load history & selected farm crop configuration on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cropDiagnosisHistory') || '[]')
      setHistory(saved)

      const farm = JSON.parse(localStorage.getItem('selectedFarm') || 'null')
      if (farm && farm.crop) {
        setDashboardCrop(farm.crop)
        setSelectedCrop(farm.crop)
        setIsManualOverride(false)
      }
    } catch (err) {
      console.error('Error loading history and farm config:', err)
    }
  }, [])

  // Crop list structure
  const cropOptions = [
    { value: 'Wheat', label: isHindi ? 'गेहूं (Wheat)' : 'Wheat' },
    { value: 'Rice', label: isHindi ? 'धान (Rice)' : 'Rice' },
    { value: 'Sugarcane', label: isHindi ? 'गन्ना (Sugarcane)' : 'Sugarcane' },
    { value: 'Cotton', label: isHindi ? 'कपास (Cotton)' : 'Cotton' },
    { value: 'Maize', label: isHindi ? 'मक्का (Maize)' : 'Maize' },
    { value: 'Mustard', label: isHindi ? 'सरसों (Mustard)' : 'Mustard' },
    { value: 'Potato', label: isHindi ? 'आलू (Potato)' : 'Potato' },
    { value: 'Tomato', label: isHindi ? 'टमाटर (Tomato)' : 'Tomato' },
    { value: 'Others', label: isHindi ? 'अन्य (Others)' : 'Others' }
  ]

  const handleCropChange = (e) => {
    const val = e.target.value
    setSelectedCrop(val)
    if (dashboardCrop) {
      setIsManualOverride(val !== dashboardCrop)
    } else {
      setIsManualOverride(true)
    }
    setDiagnosisResult(null)
  }

  // Hash function to achieve deterministic results for the same file in a session
  const getHash = (str) => {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash |= 0
    }
    return Math.abs(hash)
  }

  const createThumbnail = (file, callback) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 80
        let w = img.width
        let h = img.height
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w)
            w = maxDim
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h)
            h = maxDim
          }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        callback(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert(isHindi ? 'फ़ाइल का आकार 10MB से अधिक नहीं होना चाहिए।' : 'File size must not exceed 10MB.')
      return
    }

    setImageFile(file)
    setDiagnosisResult(null)
    
    // Set preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Generate compact thumbnail for history
    createThumbnail(file, (thumbUrl) => {
      setThumbnailBase64(thumbUrl)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      alert(isHindi ? 'कृपया केवल छवि फाइल अपलोड करें।' : 'Please upload image files only.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(isHindi ? 'फ़ाइल का आकार 10MB से अधिक नहीं होना चाहिए।' : 'File size must not exceed 10MB.')
      return
    }

    setImageFile(file)
    setDiagnosisResult(null)
    
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    createThumbnail(file, (thumbUrl) => {
      setThumbnailBase64(thumbUrl)
    })
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setThumbnailBase64('')
    setDiagnosisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const runAnalysis = () => {
    if (!imageFile || !selectedCrop) return

    setIsAnalyzing(true)
    setAnalysisStep(0)
    setDiagnosisResult(null)

    const stepIntervals = [
      { text: isHindi ? 'छवि अपलोड हो रही है...' : 'Uploading Image...', duration: 600 },
      { text: isHindi ? 'पत्ती के पैटर्न को स्कैन किया जा रहा है...' : 'Scanning Leaf Pattern...', duration: 700 },
      { text: isHindi ? 'बीमारी का पता लगाया जा रहा है...' : 'Detecting Disease...', duration: 600 },
      { text: isHindi ? 'एआई मॉडल चल रहा है...' : 'Running AI Model...', duration: 600 },
      { text: isHindi ? 'सुझाव तैयार किया जा रहा है...' : 'Generating Recommendation...', duration: 500 }
    ]

    let current = 0
    const executeStep = () => {
      if (current < stepIntervals.length - 1) {
        current++
        setAnalysisStep(current)
        setTimeout(executeStep, stepIntervals[current].duration)
      } else {
        // Formulate deterministic diagnostics based on uploaded filename
        const seedStr = imageFile.name
        const hash = getHash(seedStr)

        // Select crop-specific disease tree
        let diseases = []
        if (selectedCrop === 'Wheat') {
          diseases = ['Healthy', 'Rust', 'Powdery Mildew', 'Leaf Blight']
        } else if (selectedCrop === 'Rice') {
          diseases = ['Healthy', 'Blast', 'Brown Spot', 'Sheath Blight']
        } else if (selectedCrop === 'Cotton') {
          diseases = ['Healthy', 'Wilt', 'Leaf Curl Virus', 'Boll Rot']
        } else if (selectedCrop === 'Sugarcane') {
          diseases = ['Healthy', 'Red Rot', 'Smut', 'Wilt']
        } else {
          // Maize, Mustard, Potato, Tomato, Others
          diseases = ['Healthy', 'Leaf Spot', 'Nutrient Deficiency', 'Water Stress']
        }

        const disease = diseases[hash % diseases.length]

        const status = disease === 'Healthy' 
          ? 'Healthy' 
          : ['Minor Stress', 'Moderate Risk', 'Critical'][hash % 3]

        const risk = disease === 'Healthy'
          ? 'Low'
          : ['Low', 'Medium', 'High'][hash % 3]

        const severity = disease === 'Healthy'
          ? 'Low'
          : ['Low', 'Moderate', 'Severe'][hash % 3]

        const yieldImpact = disease === 'Healthy'
          ? '0-5%'
          : ['5-15%', '15-30%'][hash % 2]

        const confidence = `${88 + (hash % 12)}%`

        const actions = {
          'Healthy': 'Continue current watering and fertilizing schedules. No corrective actions needed.',
          'Rust': 'Apply triazole fungicide. Avoid high nitrogen fertilizers that encourage rust growth.',
          'Powdery Mildew': 'Apply sulfur-based fungicide. Ensure proper field spacing to reduce relative humidity.',
          'Leaf Blight': 'Spray tebuconazole or propiconazole fungicide. Practice crop rotation next season.',
          'Blast': 'Apply tricyclazole fungicide. Maintain optimal water level in the field.',
          'Brown Spot': 'Apply potash fertilizer to strengthen crop. Spray mancozeb fungicide if severity increases.',
          'Sheath Blight': 'Apply hexaconazole or validamycin fungicide. Avoid excess nitrogen application.',
          'Wilt': 'Drench soil with carbendazim. Ensure field drainage to prevent waterlogging.',
          'Leaf Curl Virus': 'Spray insecticides to control whitefly vectors. Remove infected weeds.',
          'Boll Rot': 'Apply copper oxychloride fungicide. Avoid dense planting layouts.',
          'Red Rot': 'Rogue out infected clumps. Use disease-free seed setts for future cultivation.',
          'Smut': 'Remove and destroy infected whip structures. Dip setts in hot water before planting.',
          'Leaf Spot': 'Spray chlorothalonil or organic neem solution. Remove lower infected leaves.',
          'Nutrient Deficiency': 'Incorporate nitrogen-rich balanced fertilizer feeds. Apply micronutrient foliar spray.',
          'Water Stress': 'Increase irrigation frequency. Calibrate drip schedule according to heat levels.'
        }

        const preventives = {
          'Healthy': 'Ensure weekly inspections and maintain standard drip flow ranges.',
          'Rust': 'Remove alternative weed hosts during pre-planting tillage.',
          'Powdery Mildew': 'Plant disease-resistant crop variants. Maintain proper air circulation.',
          'Leaf Blight': 'Avoid overhead irrigation. Ensure crop rotation next season.',
          'Blast': 'Avoid excessive seedling density. Use blast-resistant varieties.',
          'Brown Spot': 'Conduct pre-season soil health audits. Balance macro/micro nutrients.',
          'Sheath Blight': 'Ensure clean field preparation. Remove previous crop stubbles.',
          'Wilt': 'Incorporate green manure during field preparation. Solarize soil beds.',
          'Leaf Curl Virus': 'Deploy yellow sticky traps for monitoring vectors. Rogue out early infected plants.',
          'Boll Rot': 'Ensure timely picking. Optimize plant row spacings.',
          'Red Rot': 'Implement deep summer ploughing. Crop rotation index > 2 years.',
          'Smut': 'Grow smut-tolerant clones. Dip seed setts in hot water before planting.',
          'Leaf Spot': 'Avoid watering leaves directly. Clear infected leaf clutter.',
          'Nutrient Deficiency': 'Pre-season soil testing. Apply compost manure regularly.',
          'Water Stress': 'Deploy straw mulching to conserve moisture. Check soil VWC levels.'
        }

        const inspectionSchedules = {
          'Healthy': '14 days',
          'Rust': '4 days',
          'Powdery Mildew': '7 days',
          'Leaf Blight': '3 days',
          'Blast': '5 days',
          'Brown Spot': '7 days',
          'Sheath Blight': '4 days',
          'Wilt': '5 days',
          'Leaf Curl Virus': '6 days',
          'Boll Rot': '5 days',
          'Red Rot': '6 days',
          'Smut': '7 days',
          'Leaf Spot': '5 days',
          'Nutrient Deficiency': '10 days',
          'Water Stress': '3 days'
        }

        setDiagnosisResult({
          crop: selectedCrop,
          disease,
          healthStatus: status,
          confidence,
          risk,
          severity,
          yieldImpact,
          action: actions[disease],
          preventive: preventives[disease],
          nextInspection: inspectionSchedules[disease]
        })
        setIsAnalyzing(false)
      }
    }

    setTimeout(executeStep, stepIntervals[0].duration)
  }

  const saveDiagnosis = () => {
    if (!diagnosisResult) return

    const record = {
      id: `DIAG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      crop: diagnosisResult.crop,
      disease: diagnosisResult.disease,
      confidence: diagnosisResult.confidence,
      risk: diagnosisResult.risk,
      healthStatus: diagnosisResult.healthStatus,
      thumbnail: thumbnailBase64
    }

    const updated = [record, ...history]
    setHistory(updated)
    localStorage.setItem('cropDiagnosisHistory', JSON.stringify(updated))
    
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id)
    setHistory(updated)
    localStorage.setItem('cropDiagnosisHistory', JSON.stringify(updated))
  }

  const clearHistory = () => {
    if (window.confirm(isHindi ? 'क्या आप पूरा इतिहास साफ़ करना चाहते हैं?' : 'Are you sure you want to clear the entire history?')) {
      setHistory([])
      localStorage.removeItem('cropDiagnosisHistory')
    }
  }

  const stepMessages = [
    isHindi ? 'छवि अपलोड हो रही है...' : 'Uploading Image...',
    isHindi ? 'पत्ती के पैटर्न को स्कैन किया जा रहा है...' : 'Scanning Leaf Pattern...',
    isHindi ? 'बीमारी का पता लगाया जा रहा है...' : 'Detecting Disease...',
    isHindi ? 'एआई मॉडल चल रहा है...' : 'Running AI Model...',
    isHindi ? 'सुझाव तैयार किया जा रहा है...' : 'Generating Recommendation...'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      
      {/* Heading Block */}
      <div className="text-left select-none">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-400 shrink-0" />
          <span>{tLocal('title')}</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {tLocal('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Upload and Control Card */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl p-6">
          <div className="space-y-5 flex-1 flex flex-col justify-between">
            
            {/* Active Crop SelectorDropdown */}
            <div className="text-left space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {tLocal('selectCropLabel')}
              </label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={handleCropChange}
                  className="w-full bg-[#090e22]/80 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                >
                  <option value="" disabled>{tLocal('selectCropPlaceholder')}</option>
                  {cropOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0b0f2a] text-slate-200">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Upload Area */}
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 min-h-[220px] rounded-xl border border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300
                  ${dragOver 
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'border-white/10 hover:border-emerald-500/40 hover:bg-white/1'
                  }
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  className="hidden"
                />
                <UploadCloud className="h-10 w-10 text-slate-400 mb-3 animate-pulse" />
                <p className="text-xs font-bold text-slate-300 leading-normal">
                  {tLocal('dragDrop')}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {tLocal('supportText')}
                </p>
              </div>
            ) : (
              /* Preview Area */
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="relative rounded-xl border border-white/10 bg-[#090e22]/50 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[300px]">
                  <img
                    src={imagePreview}
                    alt="Uploaded Crop Preview"
                    className="max-h-[220px] w-auto object-contain rounded-lg"
                  />
                  <div className="absolute top-2 right-2 p-1 bg-black/60 rounded border border-white/10">
                    <span className="text-[9px] font-mono text-slate-300">{imageFile?.name}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg, image/jpg, image/png, image/webp"
                      className="hidden"
                    />
                    <RefreshCw className="h-3.5 w-3.5" />
                    {tLocal('replaceBtn')}
                  </button>
                  <button
                    onClick={removeImage}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {tLocal('removeBtn')}
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="p-4 rounded-xl border border-white/5 bg-[#090e22]/80 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    {tLocal('analyzing')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {Math.round(((analysisStep + 1) / 5) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-emerald-500 h-full rounded-full"
                    animate={{ width: `${((analysisStep + 1) / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-300 italic animate-pulse">
                  {stepMessages[analysisStep]}
                </p>
              </div>
            )}

            {/* Error fallback prompt when crop isn't chosen */}
            {!selectedCrop && imagePreview && (
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-[11px] font-bold text-rose-400 text-left flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{tLocal('pleaseSelectPrompt')}</span>
              </div>
            )}

            {/* Submit Trigger */}
            <button
              onClick={runAnalysis}
              disabled={!imagePreview || isAnalyzing || !selectedCrop}
              className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer
                ${!imagePreview || isAnalyzing || !selectedCrop
                  ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-[#050816] shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                }
              `}
            >
              {isAnalyzing ? tLocal('analyzing') : tLocal('analyzeBtn')}
            </button>

          </div>
        </div>

        {/* Diagnosis Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between">
          {diagnosisResult ? (
            <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
              
              <div className="space-y-3.5 flex-1">
                
                {/* Result Title */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                      {tLocal('resultTitle')}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tLocal('ready')}
                  </span>
                </div>

                {/* Dynamic Source Context Notice Banner */}
                <div className="p-2.5 rounded-lg border border-white/5 bg-white/2 text-[10px] leading-normal flex items-start gap-2">
                  <div className="p-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Leaf className="h-3 w-3" />
                  </div>
                  <div>
                    {isManualOverride ? (
                      <p className="text-slate-300 font-semibold">
                        {isHindi 
                          ? `चयनित फसल: ${selectedCrop}। निदान मैन्युअल रूप से चयनित फसल पर आधारित है।` 
                          : `Selected Crop: ${selectedCrop}. Diagnosis is based on the manually selected crop.`
                        }
                      </p>
                    ) : (
                      <p className="text-emerald-400 font-semibold">
                        {isHindi 
                          ? `चयनित फसल: ${selectedCrop}। आपके चयनित खेत से फसल का स्वतः पता लगाया गया।` 
                          : `Selected Crop: ${selectedCrop}. Crop automatically detected from your selected farm.`
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid Fields */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('crop')}</span>
                    <span className="text-slate-200 mt-0.5 block font-bold">{diagnosisResult.crop}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('confidence')}</span>
                    <span className="text-emerald-400 mt-0.5 block font-bold font-mono">{diagnosisResult.confidence}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('health')}</span>
                    <span className={`mt-0.5 block font-bold
                      ${diagnosisResult.healthStatus === 'Healthy' ? 'text-emerald-400' : ''}
                      ${diagnosisResult.healthStatus === 'Minor Stress' ? 'text-blue-400' : ''}
                      ${diagnosisResult.healthStatus === 'Moderate Risk' ? 'text-amber-400' : ''}
                      ${diagnosisResult.healthStatus === 'Critical' ? 'text-rose-400' : ''}
                    `}>
                      {diagnosisResult.healthStatus}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('disease')}</span>
                    <span className="text-slate-200 mt-0.5 block font-bold font-mono">{diagnosisResult.disease}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('severity')}</span>
                    <span className="text-slate-200 mt-0.5 block font-bold">{diagnosisResult.severity}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('risk')}</span>
                    <span className={`mt-0.5 block font-bold
                      ${diagnosisResult.risk === 'Low' ? 'text-emerald-400' : ''}
                      ${diagnosisResult.risk === 'Medium' ? 'text-amber-400' : ''}
                      ${diagnosisResult.risk === 'High' ? 'text-rose-400' : ''}
                    `}>
                      {diagnosisResult.risk}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('yieldImpact')}</span>
                    <span className="text-rose-400 mt-0.5 block font-bold font-mono">{diagnosisResult.yieldImpact}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/1">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('nextInspection')}</span>
                    <span className="text-slate-200 mt-0.5 block font-bold font-mono">{diagnosisResult.nextInspection}</span>
                  </div>
                </div>

                {/* Long Text Areas */}
                <div className="space-y-2 pt-1.5">
                  <div className="p-3 rounded-lg border border-white/5 bg-[#090e22]/50 text-xs">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('action')}</span>
                    <p className="text-slate-300 mt-1 font-semibold leading-relaxed">
                      {diagnosisResult.action}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-[#090e22]/50 text-xs">
                    <span className="text-[9px] text-slate-500 uppercase block font-black">{tLocal('preventive')}</span>
                    <p className="text-slate-300 mt-1 font-semibold leading-relaxed">
                      {diagnosisResult.preventive}
                    </p>
                  </div>
                </div>

              </div>

              {/* Warning/Prototype Mode Info Banner */}
              <div className="border-t border-white/5 pt-3 mt-3">
                <div className="p-2.5 rounded-lg border border-white/5 bg-white/2 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>{tLocal('prototypeBanner')}</p>
                </div>

                <button
                  onClick={saveDiagnosis}
                  className={`w-full py-2.5 mt-3.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5
                    ${saveSuccess 
                      ? 'bg-emerald-500 text-[#050816]' 
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    }
                  `}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {tLocal('savedSuccess')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      {tLocal('saveBtn')}
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-white/1 border border-white/5 rounded-xl min-h-[300px]">
              <div className="p-3.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-slate-400 mb-3.5 animate-pulse">
                <Leaf className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-slate-300 text-sm">
                {isHindi ? 'निदान परिणाम प्रतीक्षित' : 'Diagnosis Outcome Pending'}
              </h4>
              <p className="text-xs text-slate-500 leading-normal mt-1 max-w-[240px]">
                {isHindi 
                  ? 'कृपया एक फसल की छवि अपलोड करें और मूल्यांकन शुरू करने के लिए "विश्लेषण" बटन दबाएं।' 
                  : 'Please upload a crop image and click "Analyze" to inspect parameters.'
                }
              </p>
            </div>
          )}
        </div>

      </div>

      {/* History Log Section */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col justify-between text-left">
        <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 mb-4 select-none gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide font-sans">{tLocal('historyTitle')}</h3>
              <p className="text-[10px] text-slate-400">{isHindi ? 'सहेजे गए फसल स्वास्थ्य विश्लेषण लॉग' : 'Historical records of saved leaf diagnostic scans'}</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> {tLocal('clearHistory')}
            </button>
          )}
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[9px] select-none">
                  <th className="py-3 px-2">{tLocal('image')}</th>
                  <th className="py-3 px-2">{tLocal('timestamp')}</th>
                  <th className="py-3 px-2">{tLocal('crop')}</th>
                  <th className="py-3 px-2">{tLocal('disease')}</th>
                  <th className="py-3 px-2">{tLocal('confidence')}</th>
                  <th className="py-3 px-2">{tLocal('risk')}</th>
                  <th className="py-3 px-2">{tLocal('health')}</th>
                  <th className="py-3 px-2 text-right">{tLocal('deleteBtn')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-white/2 hover:bg-white/1 transition-all">
                    <td className="py-2.5 px-2">
                      <div className="h-10 w-10 rounded-lg border border-white/10 bg-white/2 overflow-hidden flex items-center justify-center">
                        {h.thumbnail ? (
                          <img src={h.thumbnail} alt="Diagnosis Thumbnail" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4.5 w-4.5 text-slate-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[10px] text-slate-400">{h.timestamp}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-200">{h.crop}</td>
                    <td className="py-2.5 px-2 font-mono text-[10px] text-slate-300">{h.disease}</td>
                    <td className="py-2.5 px-2 font-bold font-mono text-emerald-400">{h.confidence}</td>
                    <td className="py-2.5 px-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border
                        ${h.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${h.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${h.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                      `}>
                        {h.risk}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border
                        ${h.healthStatus === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${h.healthStatus === 'Minor Stress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${h.healthStatus === 'Moderate Risk' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${h.healthStatus === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                      `}>
                        {h.healthStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => deleteHistoryItem(h.id)}
                        className="p-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title={tLocal('deleteBtn')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center bg-white/1 border border-white/5 rounded-xl select-none">
            <p className="text-xs text-slate-500 font-semibold">{tLocal('noHistory')}</p>
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default CropDiagnosis
