import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  TrendingUp, 
  BrainCircuit, 
  CloudSun, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import TransparentLogo from '../components/common/TransparentLogo'
import logoImg from '../assets/logo.png'

const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { name: 'AgriX Intelligence', icon: BrainCircuit, path: '/intelligence' },
    { name: 'Weather', icon: CloudSun, path: '/weather' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ]

  const location = useLocation()
  
  // Resolve active menu item based on current pathname
  const activeItem = menuItems.find(item => {
    if (item.path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(item.path)
  })?.name || 'Dashboard'

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: mobileOpen ? 0 : undefined
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#050816]/85 border-r border-white/5 backdrop-blur-xl select-none
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header/Branding */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <Link 
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden w-full"
          >
            {isCollapsed ? (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/2 border border-white/5 overflow-hidden">
                <TransparentLogo 
                  src={logoImg} 
                  className="w-14 h-auto max-w-none transform -translate-y-[2px] scale-145" 
                  alt="AgriX Icon" 
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <TransparentLogo 
                  src={logoImg} 
                  className="h-14 w-auto" 
                  alt="AgriX Logo" 
                />
              </motion.div>
            )}
          </Link>
 
          {/* Mobile Close Button */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto overflow-x-hidden scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.name === activeItem

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-4 py-3.5 px-3.5 rounded-xl transition-all duration-200 overflow-hidden
                  ${isActive 
                    ? 'text-emerald-400 bg-gradient-to-r from-emerald-500/10 to-emerald-500/0 border border-emerald-500/20 font-medium shadow-[inset_0_0_12px_rgba(16,185,129,0.02)]' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/3'
                  }
                `}
              >
                {/* Active Glowing Side Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Menu Icon */}
                <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 
                  ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-100'}
                `} />

                {/* Menu Text */}
                {!isCollapsed && (
                  <span className="font-medium text-sm tracking-wide transition-opacity duration-200">
                    {item.name}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all duration-200 origin-left z-50">
                    <div className="bg-[#0b0f2a] border border-white/10 px-3 py-1.5 rounded-lg shadow-xl">
                      <p className="text-xs font-semibold text-slate-200 whitespace-nowrap">{item.name}</p>
                    </div>
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Toggle Expand/Collapse (Desktop Only) */}
        <div className="hidden lg:flex p-4 border-t border-white/5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-slate-100 hover:border-white/10 shadow-inner transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider uppercase">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
