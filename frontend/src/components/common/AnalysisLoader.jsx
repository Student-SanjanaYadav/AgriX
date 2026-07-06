import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  BrainCircuit, 
  Database, 
  Layers, 
  Check 
} from 'lucide-react'

const AnalysisLoader = ({ isLoading, onComplete, farmId }) => {
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    { label: 'Fetching satellite imagery...', icon: Database },
    { label: 'Processing NDVI index grids...', icon: Layers },
    { label: 'Running AgriX Intelligence inference...', icon: BrainCircuit },
    { label: 'Finalizing diagnostic metrics...', icon: CheckCircle2 }
  ]

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0)
      return
    }

    // Step progression timing: Total 2.0 seconds (500ms per step)
    const stepDuration = 500
    
    const timers = steps.map((_, index) => {
      return setTimeout(() => {
        setCurrentStep(index)
      }, index * stepDuration)
    })

    // Final completion timer
    const completeTimer = setTimeout(() => {
      onComplete()
    }, steps.length * stepDuration)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(completeTimer)
    }
  }, [isLoading, onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/75 backdrop-blur-sm pointer-events-auto select-none"
        >
          {/* Blue ambient glow */}
          <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Loader Card */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="p-6 rounded-2xl border border-white/10 bg-[#090d26]/90 backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4 flex flex-col relative overflow-hidden"
          >
            {/* Top scanning bar effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 animate-pulse" />

            {/* Title / Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <BrainCircuit className="h-5.5 w-5.5 animate-spin-slow" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">AI Asset Diagnostic</h3>
                <p className="text-[10px] text-slate-400">Analyzing field: {farmId || 'N/A'}</p>
              </div>
            </div>

            {/* Steps Progress List */}
            <div className="space-y-4 my-2 text-left">
              {steps.map((step, idx) => {
                const StepIcon = step.icon
                const isCompleted = idx < currentStep
                const isActive = idx === currentStep
                const isPending = idx > currentStep

                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between gap-4 transition-all duration-200
                      ${isActive ? 'text-blue-400 scale-[1.02] font-semibold' : ''}
                      ${isCompleted ? 'text-emerald-400/80' : ''}
                      ${isPending ? 'text-slate-600' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Step icon */}
                      <div className={`p-1.5 rounded-lg border
                        ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : ''}
                        ${isActive ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : ''}
                        ${isPending ? 'bg-white/1 border-white/5 text-slate-600' : ''}
                      `}>
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs tracking-wide">{step.label}</span>
                    </div>

                    {/* Step state checkmark / spinner */}
                    <div className="shrink-0">
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                        </motion.div>
                      )}
                      {isActive && (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      )}
                      {isPending && (
                        <Circle className="h-4 w-4 text-slate-700" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom linear progress bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnalysisLoader
