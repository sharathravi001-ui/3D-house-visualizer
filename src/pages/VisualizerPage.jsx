import { useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Home, ArrowLeft, Bed, Bath, Car, Maximize2,
  ChevronLeft, ChevronRight, Building2, Layers,
  Sun, Info,
} from 'lucide-react'
import { resolveModel } from '../data/houseModels'
import ExteriorScene from '../components/three/ExteriorScene'
import InteriorScene from '../components/three/InteriorScene'

/* ── Tab IDs ── */
const TAB_EXTERIOR = 'exterior'
const TAB_INTERIOR = 'interior'

/* ── Spec badge ── */
function Spec({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 py-2 bg-white/5 rounded-xl min-w-[64px]">
      <Icon className="w-4 h-4 text-brand-400" />
      <span className="text-white font-bold text-sm leading-none">{value}</span>
      <span className="text-white/40 text-[10px] leading-none">{label}</span>
    </div>
  )
}

/* ── Room navigation pill ── */
function RoomPill({ room, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40'
          : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white'
      }`}
    >
      <span className="text-base leading-none">{room.icon}</span>
      <span>{room.name}</span>
    </button>
  )
}

/* ── Floor badge ── */
function FloorBadge({ floor }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
      floor === 1 ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
    }`}>
      {floor === 1 ? 'Main Floor' : '2nd Floor'}
    </span>
  )
}

/* ── Control hint overlay ── */
function ControlHint({ tab }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white/50 text-xs px-4 py-2 rounded-full border border-white/10">
        <span>🖱️</span>
        <span>
          {tab === TAB_EXTERIOR
            ? 'Left-drag to orbit · Scroll to zoom · Right-drag to pan'
            : 'Left-drag to look around · Scroll to zoom'}
        </span>
      </div>
    </div>
  )
}

/* ══ Main page ══ */
export default function VisualizerPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const model = resolveModel(
    params.get('url'),
    params.get('lotWidth'),
    params.get('lotDepth'),
  )

  const [tab, setTab] = useState(TAB_EXTERIOR)
  const [roomIdx, setRoomIdx] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const rooms = model.rooms
  const currentRoom = rooms[roomIdx]

  const prevRoom = useCallback(() => setRoomIdx(i => (i - 1 + rooms.length) % rooms.length), [rooms.length])
  const nextRoom = useCallback(() => setRoomIdx(i => (i + 1) % rooms.length), [rooms.length])

  const s = model.specs

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">

      {/* ── Top navbar ── */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 backdrop-blur border-b border-white/5 flex-shrink-0 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors mr-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
            <Home className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm leading-none">{model.name}</p>
            <p className="text-white/35 text-[11px] mt-0.5">{model.builder} · {model.community}, {model.city}</p>
          </div>
        </div>

        {/* Specs row */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <Spec icon={Maximize2} value={s.sqft.toLocaleString()} label="sq ft" />
          <Spec icon={Bed}       value={s.beds}                  label="beds" />
          <Spec icon={Bath}      value={`${s.baths}.${s.halfBaths}`} label="baths" />
          <Spec icon={Car}       value={s.garage}                label="garage" />
          <Spec icon={Layers}    value={s.storeys}               label="floors" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Lot info */}
          <button
            onClick={() => setShowInfo(v => !v)}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">{model.lot.width}′ × {model.lot.depth}′ lot</span>
          </button>

          {/* Tab switcher */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/8">
            <button
              onClick={() => setTab(TAB_EXTERIOR)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === TAB_EXTERIOR
                  ? 'bg-brand-500 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Exterior
            </button>
            <button
              onClick={() => setTab(TAB_INTERIOR)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === TAB_INTERIOR
                  ? 'bg-brand-500 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Interior
            </button>
          </div>
        </div>
      </header>

      {/* ── Lot info dropdown ── */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-30 bg-gray-900 border border-white/10 rounded-2xl p-4 w-72 shadow-2xl">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-400" /> Property Details
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['Model',     model.name],
              ['Builder',   model.builder],
              ['Community', model.community],
              ['Elevation', model.elevation],
              ['Lot',       `${model.lot.width}′ × ${model.lot.depth}′`],
              ['House',     `${model.house.width}′ × ${model.house.depth}′`],
              ['Total Area', `${s.sqft.toLocaleString()} sq ft`],
              ['Bedrooms',   s.beds],
              ['Bathrooms',  `${s.baths} full · ${s.halfBaths} half`],
              ['Garage',     `${s.garage}-car attached`],
              ['Storeys',    s.storeys],
              ['Est. Price', s.priceRange],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-white/40">{k}</span>
                <span className="text-white/80 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Interior room strip ── */}
      {tab === TAB_INTERIOR && (
        <div className="flex-shrink-0 bg-gray-900/60 backdrop-blur border-b border-white/5 px-4 py-2 z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button onClick={prevRoom} className="text-white/40 hover:text-white flex-shrink-0 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {rooms.map((r, i) => (
              <RoomPill key={r.id} room={r} active={i === roomIdx} onClick={() => setRoomIdx(i)} />
            ))}
            <button onClick={nextRoom} className="text-white/40 hover:text-white flex-shrink-0 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 3D Canvas area ── */}
      <div className="flex-1 relative overflow-hidden">
        {tab === TAB_EXTERIOR && (
          <>
            <ExteriorScene model={model} />
            <ControlHint tab={TAB_EXTERIOR} />
            {/* Exterior label */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              <div className="bg-black/50 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10 font-medium">
                📐 Lot: {model.lot.width}′ wide × {model.lot.depth}′ deep
              </div>
              <div className="bg-black/50 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
                🏠 {model.name} · {model.house.width}′ × {model.house.depth}′ footprint
              </div>
            </div>
          </>
        )}

        {tab === TAB_INTERIOR && (
          <>
            {/* Key swap — remount canvas when room changes */}
            <InteriorScene key={currentRoom.id} room={currentRoom} />
            <ControlHint tab={TAB_INTERIOR} />

            {/* Room label */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur text-white font-semibold text-sm px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-lg">{currentRoom.icon}</span>
                <span>{currentRoom.name}</span>
                <FloorBadge floor={currentRoom.floor} />
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={prevRoom}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white p-2 rounded-xl border border-white/10 transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextRoom}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white p-2 rounded-xl border border-white/10 transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Room counter */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex items-center gap-1.5">
                {rooms.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRoomIdx(i)}
                    className={`pointer-events-auto rounded-full transition-all ${
                      i === roomIdx ? 'w-5 h-2 bg-brand-400' : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
