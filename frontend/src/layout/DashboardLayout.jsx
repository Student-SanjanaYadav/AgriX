import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Network, BookOpen, HelpCircle, Mail } from 'lucide-react'
import PremiumBackground from '../components/common/PremiumBackground'
import VoiceAssistant from '../components/common/VoiceAssistant'

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-sans overflow-x-hidden relative">
      {/* Premium Background Canvas */}
      <PremiumBackground />

      {/* Collapsible Left Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen}
      />

      {/* Main Layout Area */}
      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out relative z-10
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'}
        `}
      >
        {/* Top Header */}
        <Header 
          isCollapsed={isCollapsed} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen}
        />

        {/* Main Dashboard Content Viewport */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

        {/* Professional Footer */}
        <footer className="w-full border-t border-white/5 pt-8 pb-4 text-xs font-semibold text-slate-500 select-none mt-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/3 border border-white/5 text-slate-400">
                <Network className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-bold text-slate-300">AgriX Spatial Intelligence Platform</p>
                <p className="text-[10px] text-slate-500">Continuous Evapotranspiration Telemetry</p>
              </div>
            </div>
            
            {/* Quick links & status */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex gap-4 text-slate-400">
                <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Documentation</a>
                <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> Help Center</a>
                <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Support</a>
              </div>
              
              <div className="text-right">
                <p className="text-slate-400 font-mono text-[10px]">Sentinel-2 Connection: <span className="text-emerald-400 font-bold uppercase">Synced</span></p>
                <p className="text-[9px] text-slate-500">© 2026 AgriX Inc. All rights reserved. v4.2.0-Prod</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <VoiceAssistant />
    </div>
  )
}

export default DashboardLayout
