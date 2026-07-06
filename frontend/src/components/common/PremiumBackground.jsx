import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PremiumBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particleStyles, setParticleStyles] = useState([])

  // Capture mouse move for subtle spotlight follow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Pre-generate particle coordinates on mount to prevent layout thrashing
  useEffect(() => {
    const styles = Array.from({ length: 20 }).map((_, idx) => ({
      id: idx,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1.5}px`,
      height: `${Math.random() * 3 + 1.5}px`,
      delay: `${Math.random() * -20}s`, // Negative delay makes them start animating immediately
      duration: `${Math.random() * 20 + 20}s`
    }))
    setParticleStyles(styles)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#050816]">
      {/* 1. Subtle Engineering Grid Texture */}
      <div className="absolute inset-0 grid-bg opacity-[0.22] mix-blend-overlay" />

      {/* 2. Large Blurred Radial Gradients (Slow Framer Motion Loop) */}
      
      {/* Emerald Green Glow (Top Left) */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0]
        }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-emerald-500/6 to-teal-500/0 blur-[130px]"
      />

      {/* Deep Blue Glow (Bottom Right) */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0]
        }}
        transition={{
          duration: 54,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-blue-600/8 to-cyan-500/0 blur-[140px]"
      />

      {/* Indigo/Purple Glow (Center Right) */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 50, -40, 0]
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[30%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-indigo-500/5 to-purple-500/0 blur-[120px]"
      />

      {/* 3. Floating Ambient Light Blobs (5-8 additional nodes) */}
      <div className="absolute inset-0 opacity-80">
        <div className="absolute top-[15%] left-[45%] w-48 h-48 bg-emerald-500/4 rounded-full blur-[80px] animate-float" style={{ animationDuration: '28s', animationDelay: '-5s' }} />
        <div className="absolute top-[55%] left-[15%] w-60 h-60 bg-blue-500/3 rounded-full blur-[90px] animate-float" style={{ animationDuration: '34s', animationDelay: '-12s' }} />
        <div className="absolute top-[75%] left-[55%] w-52 h-52 bg-purple-500/3 rounded-full blur-[85px] animate-float" style={{ animationDuration: '30s', animationDelay: '-8s' }} />
        <div className="absolute top-[25%] left-[75%] w-44 h-44 bg-cyan-500/3 rounded-full blur-[75px] animate-float" style={{ animationDuration: '38s', animationDelay: '-15s' }} />
        <div className="absolute bottom-[5%] left-[80%] w-40 h-40 bg-teal-500/3 rounded-full blur-[70px] animate-float" style={{ animationDuration: '26s', animationDelay: '-2s' }} />
      </div>

      {/* 4. Tiny Floating Particles (Hardware Accelerated CSS) */}
      <div className="absolute inset-0 overflow-hidden opacity-90">
        {particleStyles.map((style) => (
          <div
            key={style.id}
            className="absolute bg-emerald-400/20 rounded-full animate-float pointer-events-none"
            style={{
              top: style.top,
              left: style.left,
              width: style.width,
              height: style.height,
              animationDelay: style.delay,
              animationDuration: style.duration
            }}
          />
        ))}
      </div>

      {/* 5. Soft Radial Mouse-Follow Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none z-20 opacity-60 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(52, 211, 153, 0.035), transparent 75%)`
        }}
      />
    </div>
  )
}

export default PremiumBackground
