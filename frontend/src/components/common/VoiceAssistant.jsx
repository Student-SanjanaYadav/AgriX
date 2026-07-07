import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, X, Volume2, HelpCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const VoiceAssistant = () => {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)

  const isHindi = language === 'hi'

  // Localized string mapper to ensure isolation and zero breaking changes
  const tLocal = (key) => {
    const dictionary = {
      en: {
        title: 'AgriX Voice Assistant',
        hint: "Click the mic and speak a command (e.g., 'Analyze my field')",
        listening: 'Listening to your voice...',
        youSaid: 'You said:',
        assistant: 'Assistant:',
        unsupported: 'Voice recognition is not supported in this browser.',
        ready: 'Ready',
        close: 'Close Panel'
      },
      hi: {
        title: 'एग्रीएक्स वॉइस असिस्टेंट',
        hint: "माइक पर क्लिक करें और बोलें (जैसे: 'मेरे खेत का विश्लेषण करो')",
        listening: 'आपकी आवाज सुन रहा हूँ...',
        youSaid: 'आपने कहा:',
        assistant: 'असिस्टेंट:',
        unsupported: 'इस ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है।',
        ready: 'तैयार',
        close: 'पैनल बंद करें'
      }
    }
    const langKey = isHindi ? 'hi' : 'en'
    return dictionary[langKey][key] || key
  }

  // Parse voice commands and build dynamic templates from live dashboard data
  const processCommand = (transcript) => {
    // 1. Transcript Normalization
    const cleanText = transcript
      .toLowerCase()
      .trim()
      .replace(/[?.,!;:]/g, '') // remove common punctuations
      .replace(/\s+/g, ' ');     // collapse multiple spaces

    // Define keyword mappings
    const enFieldKeywords = [
      'analyze', 'analyse', 'analyze field', 'analyse field', 'analyze my field', 
      'analyse my field', 'analyze my farm', 'analyse my farm', 'farm analysis', 
      'field analysis', 'check my farm', 'check field', 'check crop', 'check my crop', 
      'crop status', 'field status', 'farm status', 'how is my farm', 'how is my field', 
      'how is my crop', 'farm health', 'field report', 'analyze current field', 'show analysis'
    ]
    const hiFieldKeywords = [
      'मेरे खेत का विश्लेषण करो', 'खेत का विश्लेषण', 'विश्लेषण करो', 'मेरे खेत की स्थिति', 
      'खेत की स्थिति', 'मेरे खेत की रिपोर्ट', 'खेत की जानकारी', 'मेरे खेत का हाल', 
      'खेत कैसा है', 'मेरी फसल कैसी है', 'मेरी फसल की रिपोर्ट', 'फसल की स्थिति', 
      'फसल कैसी चल रही है'
    ]

    const enWeatherKeywords = [
      'weather', 'weather today', "today's weather", 'tomorrow weather', 'forecast', 
      'weather forecast', 'current weather', 'climate', 'rain', 'rainfall', 'will it rain', 
      'will it rain today', 'rain forecast', 'temperature', 'humidity', 'wind'
    ]
    const hiWeatherKeywords = [
      'मौसम', 'मौसम बताओ', 'मौसम कैसा है', 'मौसम की जानकारी', 'आज का मौसम', 
      'कल का मौसम', 'बारिश होगी', 'आज बारिश होगी', 'कल बारिश होगी', 'बारिश की संभावना', 
      'तापमान', 'आर्द्रता', 'हवा की गति'
    ]

    const enRecKeywords = [
      'recommendation', 'recommend', 'advice', 'suggestion', 'ai advice', 
      'ai recommendation', 'best action', 'next action', 'what should i do', 'what is your advice'
    ]
    const hiRecKeywords = [
      'सुझाव', 'सलाह', 'एआई सुझाव', 'मुझे क्या करना चाहिए', 'आगे क्या करना चाहिए', 
      'अगला कदम', 'सबसे अच्छा सुझाव'
    ]

    const enIrrigateKeywords = [
      'irrigate', 'irrigation', 'should i irrigate', 'can i irrigate', 'need irrigation', 
      'irrigation required', 'should i water', 'should i water today', 'water field', 
      'water crop', 'water required'
    ]
    const hiIrrigateKeywords = [
      'सिंचाई', 'क्या सिंचाई करनी चाहिए', 'सिंचाई करूँ', 'पानी देना चाहिए', 
      'आज पानी देना चाहिए', 'खेत में पानी डालूँ', 'खेत में पानी डालना है', 'क्या खेत को पानी चाहिए'
    ]

    const enHealthKeywords = [
      'crop health', 'plant health', 'crop condition', 'health', 'healthy', 'disease', 
      'disease status', 'is my crop healthy'
    ]
    const hiHealthKeywords = [
      'फसल की स्थिति', 'फसल स्वस्थ है', 'फसल कैसी है', 'पौधे की स्थिति', 'बीमारी', 'रोग'
    ]

    const enSummaryKeywords = [
      'summary', 'summarize', 'overview', 'farm summary', 'complete summary', 'report'
    ]
    const hiSummaryKeywords = [
      'सारांश', 'रिपोर्ट', 'पूरा विवरण', 'संक्षेप', 'स्थिति बताओ'
    ]

    const enRiskKeywords = [
      'risk', 'danger', 'problem', 'issues', 'alerts', 'warning'
    ]
    const hiRiskKeywords = [
      'जोखिम', 'खतरा', 'समस्या', 'चेतावनी', 'अलर्ट'
    ]

    const enMoistureKeywords = [
      'soil moisture', 'moisture', 'water level', 'soil water'
    ]
    const hiMoistureKeywords = [
      'मिट्टी की नमी', 'नमी', 'पानी का स्तर'
    ]

    const enHelpKeywords = [
      'help', 'commands', 'available commands', 'show commands', 'guide me', 'how to use', 
      'what can you do', 'start'
    ]
    const hiHelpKeywords = [
      'मदद', 'सहायता', 'कमांड', 'कमांड दिखाओ', 'क्या कर सकते हो', 'कैसे उपयोग करें'
    ]

    const matchesIntent = (keywords) => {
      return keywords.some(keyword => {
        const kw = keyword.toLowerCase().trim().replace(/[?.,!;:]/g, '')
        return cleanText === kw || cleanText.includes(kw)
      })
    }

    // Match Help commands first (independent of selected farm validation)
    const isHelp = isHindi ? matchesIntent(hiHelpKeywords) : matchesIntent(enHelpKeywords)
    if (isHelp) {
      return {
        speech: isHindi 
          ? "आप मुझसे खेत का विश्लेषण, मौसम, सिंचाई, फसल की स्थिति, एआई सुझाव या पूरे खेत का सारांश पूछ सकते हैं।"
          : "You can ask me about farm analysis, weather, irrigation advice, crop health, AI recommendations, or a complete farm summary.",
        text: isHindi
          ? "आप मुझसे खेत का विश्लेषण, मौसम, सिंचाई, फसल की स्थिति, एआई सुझाव या पूरे खेत का सारांश पूछ सकते हैं।"
          : "You can ask me about farm analysis, weather, irrigation advice, crop health, AI recommendations, or a complete farm summary."
      }
    }

    // Validate selected farm for all other commands
    let selectedFarm = null
    let metrics = null

    try {
      selectedFarm = JSON.parse(localStorage.getItem('selectedFarm') || 'null')
      metrics = JSON.parse(localStorage.getItem('selectedFarmMetrics') || 'null')
    } catch (err) {
      console.error('Error parsing localStorage inside voice command handler:', err)
    }

    if (!selectedFarm || !metrics || !selectedFarm.id) {
      return {
        speech: isHindi ? 'कृपया पहले किसी खेत का चयन करें।' : 'Please select a farm first.',
        text: isHindi ? 'कृपया पहले किसी खेत का चयन करें।' : 'Please select a farm first.'
      }
    }

    const cropTranslations = {
      paddy: 'धान',
      rice: 'धान',
      wheat: 'गेहूं',
      cotton: 'कपास',
      sugarcane: 'गन्ना',
      barley: 'जौ',
      millets: 'बाजरा',
      bajra: 'बाजरा',
      potato: 'आलू',
      maize: 'मक्का',
      saffron: 'केसर',
      tea: 'चाय',
      cardamom: 'इलायची',
      cashew: 'काजू',
      spices: 'मसाले'
    }

    const getTranslatedCrop = (cropName) => {
      if (!cropName) return 'N/A'
      const key = cropName.toLowerCase().split(' ')[0]
      return cropTranslations[key] || cropName
    }

    const getTranslatedStatus = (statusName) => {
      if (!statusName) return 'N/A'
      const s = statusName.toLowerCase()
      if (s === 'healthy') return 'स्वस्थ'
      if (s === 'moderate') return 'मध्यम'
      if (s === 'critical') return 'गंभीर'
      return statusName
    }

    const getTranslatedRisk = (riskVal) => {
      if (!riskVal) return 'N/A'
      const r = riskVal.toLowerCase()
      if (r === 'low') return 'कम'
      if (r === 'moderate') return 'मध्यम'
      if (r === 'high') return 'अधिक'
      return riskVal
    }

    const crop = selectedFarm.crop || 'N/A'
    const cropHindi = getTranslatedCrop(crop)
    const district = selectedFarm.district || selectedFarm.name?.split(' ')[0] || 'N/A'
    const healthScore = metrics.healthScore || 'N/A'
    const moisture = selectedFarm.moisture || metrics.soilMoisture || 'N/A'
    const temp = metrics.temperature || 'N/A'
    const humidity = metrics.humidity || 'N/A'
    const windSpeed = metrics.windSpeed || 'N/A'
    const rainProbability = metrics.rainProbability ?? '10'
    const status = metrics.status || selectedFarm.status || 'healthy'
    const statusHindi = getTranslatedStatus(status)
    const risk = metrics.risk || 'Low'
    const riskHindi = getTranslatedRisk(risk)
    const priority = metrics.priority || 'Normal'
    const priorityHindi = isHindi ? (priority.toLowerCase() === 'high' ? 'उच्च' : priority.toLowerCase() === 'medium' ? 'मध्यम' : 'कम') : priority
    const recommendation = metrics.recommendation || 'N/A'
    const actionPlan = metrics.actionPlan || 'N/A'
    const growthStage = selectedFarm.growthStage || metrics.growthStage || 'Vegetative'

    // Match Hindi Intents
    if (isHindi) {
      if (matchesIntent(hiFieldKeywords)) {
        const isRainExpected = parseFloat(rainProbability) > 50
        const weatherSentence = isRainExpected ? 'कल वर्षा होने की संभावना है।' : 'कल वर्षा की संभावना कम है।'
        const irrigateSentence = (status === 'healthy' || parseFloat(moisture) > 40) 
          ? 'आज सिंचाई की आवश्यकता नहीं है।' 
          : 'आज सिंचाई करने की सलाह दी जाती है।'

        return {
          speech: `आपके चयनित खेत में ${cropHindi} की खेती हो रही है। फसल की स्थिति ${healthScore} प्रतिशत है। मिट्टी की नमी ${moisture} है। ${weatherSentence} ${irrigateSentence}`,
          text: `आपके चयनित खेत में ${cropHindi} की खेती हो रही है।\nफसल की स्थिति ${healthScore} प्रतिशत है।\nमिट्टी की नमी ${moisture} है।\n${weatherSentence}\n${irrigateSentence}`
        }
      }

      if (matchesIntent(hiWeatherKeywords)) {
        return {
          speech: `${district} में वर्तमान मौसम ${temp} है, आर्द्रता ${humidity} है, हवा की गति ${windSpeed} है, और बारिश की संभावना ${rainProbability} प्रतिशत है।`,
          text: `${district} में वर्तमान मौसम ${temp} है, आर्द्रता ${humidity} है, हवा की गति ${windSpeed} है, और बारिश की संभावना ${rainProbability} प्रतिशत है।`
        }
      }

      if (matchesIntent(hiHealthKeywords)) {
        return {
          speech: `आपके ${cropHindi} के खेत का फसल स्वास्थ्य स्कोर ${healthScore} प्रतिशत है, जो कि ${statusHindi} स्थिति में है। विकास की अवस्था ${growthStage} है।`,
          text: `आपके ${cropHindi} के खेत का फसल स्वास्थ्य स्कोर ${healthScore} प्रतिशत है, जो कि ${statusHindi} स्थिति में है। विकास की अवस्था ${growthStage} है।`
        }
      }

      if (matchesIntent(hiRecKeywords)) {
        return {
          speech: `एआई सुझाव: ${recommendation}। कार्य योजना: ${actionPlan}।`,
          text: `एआई सुझाव: ${recommendation}।\nकार्य योजना: ${actionPlan}।`
        }
      }

      if (matchesIntent(hiIrrigateKeywords)) {
        let irrigateSentence = ''
        if (status === 'healthy' || parseFloat(moisture) > 40) {
          irrigateSentence = `मिट्टी की नमी ${moisture} पर अनुकूल है। सिंचाई को टाला जा सकता है।`
        } else if (status === 'moderate') {
          irrigateSentence = `मिट्टी की नमी ${moisture} पर मध्यम है। कम समय के लिए सिंचाई करने की सलाह दी जाती है।`
        } else {
          irrigateSentence = `मिट्टी की नमी ${moisture} पर बेहद कम है। तुरंत सिंचाई करने की अत्यधिक सलाह दी जाती है।`
        }
        return {
          speech: irrigateSentence,
          text: irrigateSentence
        }
      }

      if (matchesIntent(hiSummaryKeywords)) {
        return {
          speech: `खेत ${selectedFarm.id} का सारांश। फसल: ${cropHindi}। स्वास्थ्य: ${healthScore} प्रतिशत। नमी: ${moisture}। जोखिम का स्तर: ${riskHindi}। प्राथमिकता: ${priorityHindi}।`,
          text: `खेत ${selectedFarm.id} का सारांश।\nफसल: ${cropHindi}।\nस्वास्थ्य: ${healthScore} प्रतिशत।\nनमी: ${moisture}।\nजोखिम का स्तर: ${riskHindi}।\nप्राथमिकता: ${priorityHindi}।`
        }
      }

      if (matchesIntent(hiRiskKeywords)) {
        return {
          speech: `फसल ${cropHindi} के लिए नैदानिक जोखिम का स्तर ${riskHindi} है। प्राथमिकता की स्थिति ${priorityHindi} है।`,
          text: `फसल ${cropHindi} के लिए नैदानिक जोखिम का स्तर ${riskHindi} है।\nप्राथमिकता की स्थिति ${priorityHindi} है।`
        }
      }

      if (matchesIntent(hiMoistureKeywords)) {
        return {
          speech: `मिट्टी की नमी का स्तर वर्तमान में ${moisture} है।`,
          text: `मिट्टी की नमी का स्तर वर्तमान में ${moisture} है।`
        }
      }
    } else {
      // Match English Intents
      if (matchesIntent(enFieldKeywords)) {
        const isRainExpected = parseFloat(rainProbability) > 50
        const weatherSentence = isRainExpected ? 'Rain is expected tomorrow.' : 'Rain probability is low.'
        const irrigateSentence = (status === 'healthy' || parseFloat(moisture) > 40) 
          ? 'Irrigation can be delayed.' 
          : 'Irrigation is recommended.'

        return {
          speech: `Your selected field contains ${crop}. Crop health is ${healthScore}%. Soil moisture is ${moisture}. ${weatherSentence} ${irrigateSentence}`,
          text: `Your selected field contains ${crop}.\nCrop health is ${healthScore}%.\nSoil moisture is ${moisture}.\n${weatherSentence}\n${irrigateSentence}`
        }
      }

      if (matchesIntent(enWeatherKeywords)) {
        return {
          speech: `The current weather in ${district} is ${temp} with ${humidity} humidity, wind speed of ${windSpeed}, and rain probability of ${rainProbability}%.`,
          text: `The current weather in ${district} is ${temp} with ${humidity} humidity, wind speed of ${windSpeed}, and rain probability of ${rainProbability}%.`
        }
      }

      if (matchesIntent(enHealthKeywords)) {
        return {
          speech: `The crop health score for your ${crop} field is ${healthScore}%, which is in ${status} status. Growth stage is ${growthStage}.`,
          text: `The crop health score for your ${crop} field is ${healthScore}%, which is in ${status} status. Growth stage is ${growthStage}.`
        }
      }

      if (matchesIntent(enRecKeywords)) {
        return {
          speech: `AI Decision Recommendation: ${recommendation}. Action Plan: ${actionPlan}.`,
          text: `AI Decision Recommendation: ${recommendation}.\nAction Plan: ${actionPlan}.`
        }
      }

      if (matchesIntent(enIrrigateKeywords)) {
        let irrigateSentence = ''
        if (status === 'healthy' || parseFloat(moisture) > 40) {
          irrigateSentence = `Soil moisture is optimal at ${moisture}. Irrigation can be delayed.`
        } else if (status === 'moderate') {
          irrigateSentence = `Moderate moisture level at ${moisture}. Short pulse irrigation is recommended.`
        } else {
          irrigateSentence = `Critical moisture deficit at ${moisture}. Immediate high-flow irrigation is recommended.`
        }
        return {
          speech: irrigateSentence,
          text: irrigateSentence
        }
      }

      if (matchesIntent(enSummaryKeywords)) {
        return {
          speech: `Field ${selectedFarm.id} summary. Crop: ${crop}. Health: ${healthScore}%. Moisture: ${moisture}. Risk level: ${risk}. Priority: ${priority}.`,
          text: `Field ${selectedFarm.id} summary.\nCrop: ${crop}.\nHealth: ${healthScore}%.\nMoisture: ${moisture}.\nRisk level: ${risk}.\nPriority: ${priority}.`
        }
      }

      if (matchesIntent(enRiskKeywords)) {
        return {
          speech: `The diagnostic risk level for crop ${crop} is ${risk} with priority status ${priority}.`,
          text: `The diagnostic risk level for crop ${crop} is ${risk} with priority status ${priority}.`
        }
      }

      if (matchesIntent(enMoistureKeywords)) {
        return {
          speech: `The soil moisture level is currently ${moisture}. VWC is within expected boundaries.`,
          text: `The soil moisture level is currently ${moisture}. VWC is within expected boundaries.`
        }
      }
    }

    // Default Fallback
    return {
      speech: isHindi 
        ? "क्षमा करें, मैं आपकी बात समझ नहीं पाया। आप मौसम, फसल की स्थिति, सिंचाई, एआई सुझाव या खेत के विश्लेषण के बारे में पूछ सकते हैं।"
        : "Sorry, I didn't understand that command. You can ask about weather, crop health, irrigation, AI recommendations, or farm analysis.",
      text: isHindi
        ? "क्षमा करें, मैं आपकी बात समझ नहीं पाया। आप मौसम, फसल की स्थिति, सिंचाई, एआई सुझाव या खेत के विश्लेषण के बारे में पूछ सकते हैं।"
        : "Sorry, I didn't understand that command. You can ask about weather, crop health, irrigation, AI recommendations, or farm analysis."
    }
  }

  // Initialize Speech Recognition once on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = isHindi ? 'hi-IN' : 'en-US'

      rec.onstart = () => {
        isListeningRef.current = true
        setIsListening(true)
        setErrorMsg('')
        setRecognizedText('')
        setAiResponse('')
      }

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setRecognizedText(transcript)
        
        const result = processCommand(transcript)
        setAiResponse(result.text)
        speak(result.speech)
      }

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          setErrorMsg(isHindi ? 'कृपया पुनः प्रयास करें।' : 'Please try speaking again.')
        } else if (event.error === 'not-allowed') {
          setErrorMsg(isHindi ? 'माइक एक्सेस की अनुमति नहीं है।' : 'Microphone permission denied.')
        } else if (event.error === 'aborted') {
          // Component closed or manual cancellation
        } else if (event.error === 'network') {
          setErrorMsg(isHindi ? 'नेटवर्क त्रुटि।' : 'Network error.')
        } else if (event.error === 'audio-capture') {
          setErrorMsg(isHindi ? 'ऑडियो कैप्चर त्रुटि।' : 'Audio capture error.')
        } else {
          setErrorMsg(isHindi ? 'त्रुटि उत्पन्न हुई।' : 'Error occurred during recognition.')
        }
        isListeningRef.current = false
        setIsListening(false)
      }

      rec.onend = () => {
        isListeningRef.current = false
        setIsListening(false)
      }

      recognitionRef.current = rec
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [])

  // Sync language property when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (isListeningRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          // ignore
        }
      }
      recognitionRef.current.lang = isHindi ? 'hi-IN' : 'en-US'
    }
  }, [language])

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Speech Synthesis player helper
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = isHindi ? 'hi-IN' : 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg(tLocal('unsupported'))
      return
    }

    if (isListeningRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error('Error stopping recognition:', e)
      }
    } else {
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Error starting recognition:', e)
      }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      
      {/* Assistant Dialog Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#050816]/90 backdrop-blur-xl shadow-2xl p-4 mb-4 text-left overflow-hidden relative"
          >
            {/* Soft Ambient Light Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />
            
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 tracking-wide uppercase font-sans">
                  {tLocal('title')}
                </span>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false)
                  if (isListeningRef.current && recognitionRef.current) {
                    try {
                      recognitionRef.current.abort()
                    } catch (e) {
                      // ignore
                    }
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
                title={tLocal('close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation/Diagnostics panel */}
            <div className="space-y-3 min-h-[120px] flex flex-col justify-between">
              
              {/* Instructions and transcriptions */}
              <div className="space-y-2 flex-1">
                {!recognizedText && !isListening && !errorMsg && (
                  <p className="text-slate-400 text-xs leading-relaxed font-sans flex items-start gap-1.5 p-2 rounded bg-white/2 border border-white/5">
                    <HelpCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    {tLocal('hint')}
                  </p>
                )}

                {isListening && (
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs p-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>{tLocal('listening')}</span>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-rose-400 text-xs font-semibold p-2 bg-rose-500/5 rounded border border-rose-500/10">
                    {errorMsg}
                  </p>
                )}

                {recognizedText && (
                  <div className="space-y-2.5 p-2.5 rounded-lg bg-white/3 border border-white/5">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">
                        {tLocal('youSaid')}
                      </span>
                      <p className="text-slate-200 font-semibold text-xs mt-0.5 italic">
                        "{recognizedText}"
                      </p>
                    </div>

                    {aiResponse && (
                      <div className="border-t border-white/5 pt-2 flex items-start gap-1.5">
                        <Volume2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <span className="text-[9px] text-emerald-400 font-black tracking-wider uppercase block">
                            {tLocal('assistant')}
                          </span>
                          <p className="text-emerald-300 font-bold text-xs mt-0.5">
                            {aiResponse}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Panel Interaction Controls */}
              <div className="flex justify-center items-center py-2.5">
                <div className="relative">
                  {/* Listening Pulse Waves */}
                  {isListening && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-blue-500/25 pointer-events-none"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        className="absolute inset-0 rounded-full bg-blue-500/35 pointer-events-none"
                      />
                    </>
                  )}

                  <button
                    onClick={toggleListening}
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all cursor-pointer shadow-lg
                      ${isListening 
                        ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="relative">
        {/* Soft Notification Pulse if panel is closed and listening is active (safety fallback) */}
        {isListening && !isOpen && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500/30 pointer-events-none"
          />
        )}
        
        <button
          onClick={() => {
            setIsOpen(!isOpen)
            setErrorMsg('')
          }}
          className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-50
            ${isOpen 
              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]' 
              : 'bg-emerald-500 border-emerald-400 text-[#050816] hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
            }
          `}
        >
          {isOpen ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
      </div>

    </div>
  )
}

export default VoiceAssistant
