import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Ruler, Link as LinkIcon, ArrowRight, Layers } from 'lucide-react'

const SAMPLE_URL = 'https://mattamyhomes.com/ontario/kitchener-waterloo-guelph/kitchener/wildflowers/the-grayson'

export default function LandingPage() {
  const navigate = useNavigate()
  const [lotWidth, setLotWidth] = useState('33.9')
  const [lotDepth, setLotDepth] = useState('142.9')
  const [planUrl, setPlanUrl] = useState(SAMPLE_URL)

  function handleGenerate(e) {
    e.preventDefault()
    const params = new URLSearchParams({ lotWidth, lotDepth, url: planUrl })
    navigate(`/visualizer?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center gap-3 px-8 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">HomeViz 3D</span>
        <span className="ml-auto text-xs text-white/30 font-mono">v1.0</span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-8 py-16 max-w-7xl mx-auto w-full">
        {/* Left: copy */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Layers className="w-3 h-3" />
            AI-Powered 3D House Walkthrough
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            See your<br />
            <span className="text-brand-400">dream home</span><br />
            come to life
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Paste any builder floor plan URL, enter your lot dimensions, and get an
            interactive 3D walkthrough — exterior curb appeal, staged interior rooms,
            and the full lot layout.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {['Exterior 3D View', 'Interior Walkthrough', 'Lot Layout', 'Staged Furniture', 'Landscaping'].map(f => (
              <span key={f} className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full max-w-md">
          <form onSubmit={handleGenerate} className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
            <h2 className="text-white font-bold text-xl mb-1">Generate Visualization</h2>
            <p className="text-white/40 text-sm mb-6">Enter your lot size and floor plan link to begin</p>

            {/* Lot dimensions */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
                <Ruler className="w-4 h-4 text-brand-400" />
                Lot Dimensions (feet)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Width</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="200"
                    value={lotWidth}
                    onChange={e => setLotWidth(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white/12 transition-all"
                    placeholder="33.9"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Depth</label>
                  <input
                    type="number"
                    step="0.1"
                    min="60"
                    max="500"
                    value={lotDepth}
                    onChange={e => setLotDepth(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white/12 transition-all"
                    placeholder="142.9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Floor plan URL */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
                <LinkIcon className="w-4 h-4 text-brand-400" />
                Floor Plan URL
              </label>
              <input
                type="url"
                value={planUrl}
                onChange={e => setPlanUrl(e.target.value)}
                className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white/12 transition-all"
                placeholder="https://builder.com/floor-plan/..."
                required
              />
              <p className="text-white/25 text-xs mt-2">
                Currently supports: Mattamy Homes floor plans. More builders coming soon.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm group"
            >
              Generate 3D Visualization
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-white/20 text-xs mt-4">
              Sample pre-loaded: Mattamy Grayson · Wildflowers, Kitchener
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-5 border-t border-white/5">
        <p className="text-white/20 text-xs">HomeViz 3D — Interactive House Visualizer for New Home Buyers</p>
      </div>
    </div>
  )
}
