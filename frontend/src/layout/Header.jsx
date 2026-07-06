import React from 'react'
import { Bell, Menu, User, Sprout } from 'lucide-react'
import TransparentLogo from '../components/common/TransparentLogo'
import logoImg from '../assets/logo.png'

const Header = ({ isCollapsed, setMobileOpen, mobileOpen }) => {
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
            {/* Small icon shown in header only on mobile for brand presence */}
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
      <div className="flex items-center gap-4">
        {/* Notification Bell Icon */}
        <button className="group relative p-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-slate-100 hover:border-white/10 shadow-inner transition-all duration-200">
          <Bell className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
          
          {/* Pulsing indicator badge */}
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </span>
        </button>

        {/* Profile Avatar */}
        <button className="group flex items-center gap-2.5 p-1 pr-3 rounded-full border border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/10 transition-all duration-200">
          {/* Avatar Ring */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050816]">
              <span className="font-sans font-bold text-xs text-emerald-400">SY</span>
            </div>
          </div>
          
          {/* Profile Name (Hidden on very small screens) */}
          <span className="hidden md:inline-block font-sans text-xs font-semibold text-slate-300 tracking-wide group-hover:text-slate-100 transition-colors">
            Sanjana Yadav
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
