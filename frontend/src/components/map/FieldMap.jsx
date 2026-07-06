import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polygon, Popup, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  Globe, 
  Sparkles, 
  Droplets, 
  Home, 
  X,
  Target,
  Cpu
} from 'lucide-react'
import { getAllDistrictMarkers, generateFarmsForDistrict } from '../../data/farmGenerator'

const citiesData = getAllDistrictMarkers()

// Generate premium colored divIcons dynamically
const createCustomMarker = (status) => {
  let markerHtml = ''

  if (status === 'healthy') {
    markerHtml = `
      <div class="relative flex h-7 w-7 items-center justify-center">
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500/20 border border-emerald-500/35"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white/20 shadow-[0_0_8px_#10b981]"></span>
      </div>
    `
  } else if (status === 'moderate') {
    markerHtml = `
      <div class="relative flex h-7 w-7 items-center justify-center">
        <span class="absolute inline-flex h-full w-full rounded-full bg-amber-500/20 border border-amber-500/35"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white/20 shadow-[0_0_8px_#f59e0b]"></span>
      </div>
    `
  } else {
    // critical
    markerHtml = `
      <div class="relative flex h-7 w-7 items-center justify-center">
        <span class="absolute inline-flex h-full w-full rounded-full bg-rose-500/35 border border-rose-500/50 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white/20 shadow-[0_0_8px_#ef4444]"></span>
      </div>
    `
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: markerHtml,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  })
}

// Leaflet map controller subcomponent for fluid zoom animations
const MapController = ({ center, zoom }) => {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    })
  }, [center, zoom, map])
  return null
}

const FieldMap = ({ selectedFarm, onSelectFarm }) => {
  const defaultCenter = [22.9734, 78.6569] // India geographic focus
  const defaultZoom = 5
  
  // States
  const [activeCity, setActiveCity] = useState(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [mapZoom, setMapZoom] = useState(defaultZoom)
  const [mockFarms, setMockFarms] = useState([])

  // Bound Limit
  const indiaBounds = [
    [6.0, 67.0],
    [38.0, 99.0]
  ]

  // City Marker Click Handler
  const handleCityClick = (city) => {
    setActiveCity(city)
    setMapCenter([city.lat, city.lng])
    setMapZoom(12) // Zoom deep into district
    const numFarms = Math.floor(20 + Math.random() * 31) // 20 to 50 farms
    const generated = generateFarmsForDistrict(city.state, city.name, city.lat, city.lng, numFarms)
    setMockFarms(generated)
    onSelectFarm(null) // Reset farm selection
  }

  // Reset Map View Viewport
  const handleResetView = () => {
    setActiveCity(null)
    setMapCenter(defaultCenter)
    setMapZoom(defaultZoom)
    setMockFarms([])
    onSelectFarm(null)
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-[#050816]/40 backdrop-blur-md shadow-2xl flex flex-col">
      {/* Top Map Header Panel */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#090d26]/85 border border-white/10 backdrop-blur-md shadow-lg pointer-events-auto select-none">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-100 tracking-wide">
            {activeCity ? `${activeCity.name} Precision Grid` : 'Live Soil Telemetry'}
          </h4>
          <p className="text-[10px] text-slate-400">
            {activeCity ? 'Click on fields to inspect soil attributes' : 'Agricultural Hubs of India'}
          </p>
        </div>
      </div>

      {/* Floating Toolbar: Reset View (Visible only when zoomed in) */}
      {activeCity && (
        <div className="absolute top-4 right-16 z-[1000] pointer-events-auto">
          <button
            onClick={handleResetView}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090d26]/85 border border-white/10 backdrop-blur-md shadow-lg text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200"
            title="Reset Map View"
          >
            <Home className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">India View</span>
          </button>
        </div>
      )}

      {/* Floating Glassmorphic Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] p-4 rounded-xl bg-[#090d26]/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-3 pointer-events-auto select-none min-w-[160px]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-1.5 mb-0.5 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          Field Health Index
        </span>
        
        {/* Healthy Indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-200">Healthy</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">NDVI &gt; 0.6</span>
        </div>

        {/* Moderate Indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-200">Moderate</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold font-mono">NDVI 0.3-0.6</span>
        </div>

        {/* Critical Indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-200">Critical</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold font-mono">NDVI &lt; 0.3</span>
        </div>
      </div>

      {/* Floating Inspection Card (Visible when a farm is selected) */}
      {selectedFarm && (
        <div className="absolute bottom-6 left-6 z-[1000] p-4 rounded-xl bg-[#090d26]/95 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-3 pointer-events-auto min-w-[280px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              Farm Inspection
            </span>
            <button 
              onClick={() => onSelectFarm(null)}
              className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Details Table List */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Asset ID:</span>
              <span className="font-semibold text-slate-200 font-mono">{selectedFarm.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Crop Type:</span>
              <span className="font-semibold text-slate-200">{selectedFarm.crop}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Field Area:</span>
              <span className="font-semibold text-slate-200">{selectedFarm.area} ha</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Soil Moisture:</span>
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 shrink-0" />
                {selectedFarm.moisture}
              </span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-slate-500">Health Index:</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border
                ${selectedFarm.status === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : selectedFarm.status === 'moderate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}
              `}>
                {selectedFarm.status}
              </span>
            </div>
          </div>

          {/* AI Inference Action Plan Button */}
          <button 
            className="w-full mt-1.5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200"
            onClick={() => alert(`AI Analysis queued for selected asset ${selectedFarm.id}`)}
          >
            <Cpu className="h-4 w-4 animate-pulse" />
            Optimize Irrigation Plan
          </button>
        </div>
      )}

      {/* Map Implementation */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={4}
        maxZoom={18}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        scrollWheelZoom={true}
        className="flex-1 w-full h-full z-10"
      >
        {/* React Leaflet Pan/Zoom Coordinator Component */}
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Esri World Imagery Satellite Tiles */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
          className="dark-satellite-tiles"
        />

        {/* Custom Zoom Controls placed at upper right */}
        <ZoomControl position="topright" />

        {/* City Markers - Shown only when no district is selected */}
        {!activeCity && citiesData.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createCustomMarker(city.status)}
            eventHandlers={{
              click: () => handleCityClick(city)
            }}
          >
            <Popup className="premium-map-popup select-none">
              <div className="p-1 space-y-2.5 min-w-[200px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h5 className="font-bold text-xs text-slate-100 tracking-wide">{city.name} District</h5>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-1 rounded bg-white/3 border border-white/5">
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">Main Crop</span>
                    <p className="font-medium text-slate-200 mt-0.5">{city.crop}</p>
                  </div>
                  <div className="p-1 rounded bg-white/3 border border-white/5">
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">Moisture</span>
                    <p className={`font-bold mt-0.5 flex items-center gap-0.5
                      ${city.status === 'healthy' ? 'text-emerald-400' : city.status === 'moderate' ? 'text-amber-400' : 'text-rose-400'}
                    `}>
                      <Droplets className="h-3 w-3 shrink-0" />
                      {city.moisture}
                    </p>
                  </div>
                </div>
                <button
                  className="w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-400 font-bold border border-emerald-500/20 transition-all duration-200"
                  onClick={() => handleCityClick(city)}
                >
                  Inspect Farms
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected City Marker Marker (Shown when zoomed in) */}
        {activeCity && (
          <Marker
            position={[activeCity.lat, activeCity.lng]}
            icon={createCustomMarker(activeCity.status)}
          >
            <Popup className="premium-map-popup select-none">
              <div className="p-1 text-center min-w-[150px] space-y-2">
                <h5 className="font-bold text-xs text-slate-100">{activeCity.name} Hub Center</h5>
                <p className="text-[10px] text-slate-400">Displaying precision field polygons.</p>
                <button
                  onClick={handleResetView}
                  className="py-1 px-3 rounded-md bg-white/5 text-[9px] text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Back to India View
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Farm Polygons/Field Rectangles in selected district */}
        {activeCity && mockFarms.map((farm) => {
          const isSelected = selectedFarm && selectedFarm.id === farm.id
          
          const pathOptions = {
            ...farm.style,
            fillOpacity: isSelected ? 0.75 : 0.25,
            weight: isSelected ? 4.5 : 1.8,
            color: isSelected ? '#34d399' : farm.style.color,
            dashArray: isSelected ? '2, 2' : null
          }

          return (
            <Polygon
              key={farm.id}
              positions={farm.coordinates}
              pathOptions={pathOptions}
              eventHandlers={{
                click: (e) => {
                  onSelectFarm({
                    ...farm,
                    state: activeCity.state,
                    district: activeCity.name
                  })
                  L.DomEvent.stopPropagation(e) // Prevent click from triggering map triggers
                },
                mouseover: (e) => {
                  if (!isSelected) {
                    e.target.setStyle({ fillOpacity: 0.45, weight: 2.5 })
                  }
                },
                mouseout: (e) => {
                  if (!isSelected) {
                    e.target.setStyle({ fillOpacity: 0.25, weight: 1.8 })
                  }
                }
              }}
            >
              <Popup className="premium-map-popup select-none">
                <div className="p-1 min-w-[180px] space-y-2">
                  <h6 className="font-bold text-xs text-slate-100">{farm.name}</h6>
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <p>Crop: <span className="font-semibold text-slate-200">{farm.crop}</span></p>
                    <p>Area: <span className="font-semibold text-slate-200">{farm.area} ha</span></p>
                    <p>Moisture: <span className="font-bold text-cyan-400">{farm.moisture}</span></p>
                  </div>
                  <button
                    className={`w-full py-1.5 rounded text-[9px] font-bold border transition-all duration-200
                      ${isSelected 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                      }
                    `}
                    onClick={() => onSelectFarm(farm)}
                  >
                    {isSelected ? 'Asset Selected' : 'Select Farm Field'}
                  </button>
                </div>
              </Popup>
            </Polygon>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default FieldMap
