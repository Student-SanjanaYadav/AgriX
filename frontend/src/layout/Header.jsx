import React, { useState, useEffect } from 'react'
import { Bell, Menu, Check, Trash2, Sprout } from 'lucide-react'
import TransparentLogo from '../components/common/TransparentLogo'
import logoImg from '../assets/logo.png'
import { useLanguage } from '../context/LanguageContext'

const Header = ({ isCollapsed, setMobileOpen, mobileOpen, user = { name: "Farm Administrator", role: "Administrator" } }) => {
  const { language, setLanguage, t } = useLanguage()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 'init-1',
      title: 'Sensor Synchronization Completed',
      desc: 'All 48 edge hydrometers in Punjab Wheat plots are successfully reporting telemetry.',
      time: '5 min ago',
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      type: 'sensor'
    },
    {
      id: 'init-2',
      title: 'Rain Expected Tomorrow',
      desc: 'Local precipitation forecast maps a 75% probability of light showers in Ludhiana.',
      time: '1 hour ago',
      timestamp: Date.now() - 60 * 60 * 1000,
      unread: true,
      type: 'weather'
    },
    {
      id: 'init-3',
      title: 'Satellite Imagery Refreshed',
      desc: 'Sentinel-2 high-res orbits updated red-edge band indices for Maharashtra Cotton.',
      time: '3 hours ago',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      unread: false,
      type: 'satellite'
    }
  ])

  // Periodic tick to recalculate "time ago" timestamps
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  // Listen to custom notification events to push alerts dynamically
  useEffect(() => {
    const handleNotificationEvent = (e) => {
      if (!e?.detail) return
      const timestamp = Date.now()
      const newAlert = {
        id: `NT-EV-${timestamp}-${Math.random()}`,
        title: e.detail.title || 'Agricultural Event',
        desc: e.detail.desc || '',
        timestamp,
        unread: true,
        type: e.detail.type || 'info'
      }

      setNotifications(prev => {
        // Prevent duplicates of the same event by inspecting descriptions
        const alreadyExists = prev.some(item => item.desc === newAlert.desc)
        if (alreadyExists) return prev
        // Cap notifications array at maximum of 20 items
        return [newAlert, ...prev].slice(0, 20)
      })
    }

    window.addEventListener('farmNotification', handleNotificationEvent)
    return () => {
      window.removeEventListener('farmNotification', handleNotificationEvent)
    }
  }, [])

  const getInitials = (name) => {
    if (!name) return 'FA'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }

  const formatTimeAgo = (timestamp) => {
    const diffMs = Date.now() - timestamp
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/5 bg-[#050816]/60 px-6 backdrop-blur-xl select-none">
      {/* Left: Branding & Subtitle / Mobile Toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Branding & Subtitle */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <TransparentLogo src={logoImg} className="lg:hidden h-10 w-auto mr-1" alt="AgriX Logo" />
            <h1 className="font-sans font-black text-2xl md:text-3xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.15)] leading-none">
              AgriX
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-black text-emerald-400 tracking-widest uppercase ml-1.5 opacity-90">
              Spatial Decision Intelligence
            </span>
          </div>
          <p className="hidden md:block text-[9.5px] text-slate-400 font-semibold tracking-wide mt-1">
            Empowering Smarter Irrigation Through AI, Geospatial Intelligence & Predictive Analytics.
          </p>
        </div>
      </div>

      {/* Right: Notifications & Profile Action Panel */}
      <div className="flex items-center gap-4 relative">
        
        {/* Glassmorphism Language Selector Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/5 bg-white/3 text-[10px] md:text-xs font-black tracking-wide text-slate-300">
          <span className="pl-1 text-slate-400">🌐</span>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer
              ${language === 'en' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold' : 'hover:bg-white/5 hover:text-slate-100'}
            `}
          >
            English
          </button>
          <span className="text-white/10">|</span>
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer
              ${language === 'hi' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold' : 'hover:bg-white/5 hover:text-slate-100'}
            `}
          >
            हिन्दी
          </button>
        </div>

        {/* Interactive Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative p-2.5 rounded-xl border bg-white/3 hover:bg-white/8 text-slate-400 hover:text-slate-100 hover:border-white/10 shadow-inner transition-all duration-200 cursor-pointer
              ${dropdownOpen ? 'border-white/20 bg-white/8 text-slate-100' : 'border-white/5'}
            `}
          >
            <Bell className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border border-[#050816] shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Premium Glassmorphic Notifications Dropdown */}
          {dropdownOpen && (
            <>
              {/* Invisible Click Overlay to Close */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[480px] flex flex-col rounded-2xl border border-white/10 bg-[#090d26]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-fadeIn text-left">
                {/* Dropdown Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">{t("Agricultural Alerts")}</h4>
                    <p className="text-[9px] text-slate-500 font-bold font-mono mt-0.5">{unreadCount} {t("unread diagnostic items")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={markAllAsRead} 
                      className="p-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                      title={t("Mark all as read")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={clearNotifications}
                      className="p-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-[#ef4444]/10 text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                      title={t("Clear")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notifications Scroll Area */}
                <div className="flex-1 overflow-y-auto divide-y divide-white/5 max-h-[360px] scrollbar-none">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                      <Sprout className="h-8 w-8 text-slate-600 animate-pulse" />
                      <p>{t("No agricultural notifications active")}</p>
                    </div>
                  ) : (
                    notifications.map((item, idx) => {
                      const isLatest = idx === 0
                      return (
                        <div 
                          key={item.id} 
                          className={`p-4 flex flex-col gap-1 transition-all duration-200 hover:bg-white/2
                            ${item.unread ? 'bg-white/1' : 'opacity-70'}
                            ${isLatest && item.unread ? 'border-l-2 border-emerald-500' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-black tracking-wide leading-tight
                              ${item.unread ? 'text-slate-100' : 'text-slate-300'}
                            `}>
                              {item.title}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 font-mono">
                              {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                            {item.desc}
                          </p>
                          {item.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1 self-end shadow-[0_0_8px_#10b981]" />
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar & dynamic details */}
        <button className="group flex items-center gap-2.5 p-1 pr-3 rounded-full border border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/10 transition-all duration-200">
          {/* Avatar Ring */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050816]">
              <span className="font-sans font-bold text-xs text-emerald-400">
                {getInitials(user.name)}
              </span>
            </div>
          </div>
          
          {/* Profile Name (Hidden on very small screens) */}
          <span className="hidden md:inline-block font-sans text-xs font-semibold text-slate-300 tracking-wide group-hover:text-slate-100 transition-colors">
            {user.name}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
