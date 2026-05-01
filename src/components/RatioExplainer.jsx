import { COLORS } from '../constants/colors'

const CX = 110, CY = 185
const FIXED_RADII = [55]
const FIXED_COLORS = ['#10b981']   // emerald only

export default function RatioExplainer({ angle, ratioScale, onRatioScaleChange }) {
  // Avoid degenerate triangles at 0° / 180° / 360° for the demo
  const a = (Math.abs(Math.sin(angle)) < 0.08) ? Math.PI / 4 : angle
  const sinA = Math.sin(a)
  const cosA = Math.cos(a)
  const ratio = Math.abs(sinA)
  const degLabel = Math.round(a * 180 / Math.PI)

  // Outer (interactive) circle radius — slider grows it from just above the middle one
  const outerR = 85 + ratioScale * 35   // ranges ~92 to ~155 as ratioScale goes 0.2→2.0

  const allCircles = [
    { r: FIXED_RADII[0], color: FIXED_COLORS[0] },
    { r: outerR,         color: '#f43f5e'        },
  ]

  const renderTriangle = ({ r, color }) => {
    const tipX = CX + cosA * r
    const tipY = CY - sinA * r
    const footX = tipX
    const footY = CY
    const oppLen = Math.abs(sinA * r)
    const labelX = tipX + (cosA >= 0 ? 8 : -8)
    const labelAnchor = cosA >= 0 ? 'start' : 'end'

    return (
      <g key={r}>
        {/* Circle outline */}
        <circle cx={CX} cy={CY} r={r}
          fill="none" stroke={color} strokeWidth={1.2}
          strokeDasharray="5 3" opacity={0.45}/>

        {/* Adjacent leg */}
        <line x1={CX} y1={CY} x2={footX} y2={footY}
          stroke={color} strokeWidth={1.5} opacity={0.4}/>

        {/* Opposite leg — the "height", emphasised */}
        <line x1={footX} y1={footY} x2={tipX} y2={tipY}
          stroke={color} strokeWidth={3} opacity={0.9}/>

        {/* Hypotenuse */}
        <line x1={CX} y1={CY} x2={tipX} y2={tipY}
          stroke={color} strokeWidth={1.8} opacity={0.7}/>

        {/* Right-angle marker */}
        {Math.abs(sinA) > 0.1 && Math.abs(cosA) > 0.1 && (
          <rect
            x={cosA >= 0 ? footX - 6 : footX}
            y={sinA >= 0 ? footY - 6 : footY}
            width={6} height={6}
            fill="none" stroke={color} strokeWidth={1} opacity={0.5}
          />
        )}

        {/* Tip dot */}
        <circle cx={tipX} cy={tipY} r={5} fill={color} stroke="white" strokeWidth={1.5}/>

        {/* Ratio label beside the tip */}
        <text x={labelX} y={tipY} fontSize={9.5} fill={color} fontWeight="700"
          dominantBaseline="middle" textAnchor={labelAnchor}>
          {oppLen.toFixed(1)} ÷ {r.toFixed(1)} = {ratio.toFixed(3)}
        </text>
      </g>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
        Why the ratio can't change — the tip must reach the circle
      </h2>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        The two triangles below both have the same angle ({degLabel}°) but different-sized
        circles. The tip of each triangle (coloured dot) has to sit exactly on its circle —
        that is what a circle means, every point the same distance from the centre.
        So when the circle gets bigger, the height of the triangle <em>must</em> grow to
        reach it. Both sides grow by the same factor, so the ratio height ÷ hypotenuse
        stays locked at <strong>{ratio.toFixed(3)}</strong>.
      </p>

      <svg width="100%" viewBox="-15 -15 380 265" className="overflow-visible">
        {/* Baseline */}
        <line x1={CX - 15} y1={CY} x2={CX + 180} y2={CY}
          stroke="#e2e8f0" strokeWidth={1}/>

        {/* Origin dot */}
        <circle cx={CX} cy={CY} r={4} fill="#64748b"/>
        <text x={CX - 12} y={CY + 4} fontSize={10} fill="#64748b">O</text>

        {/* Angle arc */}
        {Math.abs(sinA) > 0.05 && (
          <path
            d={`M ${CX + 20} ${CY} A 20 20 0 ${a > Math.PI ? 1 : 0} 0
              ${CX + 20 * cosA} ${CY - 20 * sinA}`}
            fill="none" stroke={COLORS.arc.stroke} strokeWidth={1.5}/>
        )}
        <text x={CX + 26} y={CY - 9} fontSize={10} fill={COLORS.arc.text} fontWeight="700">
          {degLabel}°
        </text>

        {/* Triangles — draw smallest first so larger ones sit on top */}
        {allCircles.map(renderTriangle)}

        {/* Callout banner */}
        <rect x={0} y={-13} width={270} height={22} rx={5}
          fill="#fef9c3" stroke="#fde68a" strokeWidth={1}/>
        <text x={10} y={3} fontSize={11} fill="#92400e" fontWeight="700">
          All ratios = sin({degLabel}°) = {ratio.toFixed(3)}
        </text>
      </svg>

      {/* Interactive slider: grow the outer circle */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <label className="text-sm font-semibold text-slate-600">
            Drag to grow the outer circle:
          </label>
          <span className="font-mono text-xs font-bold" style={{ color: '#f43f5e' }}>
            hyp = {outerR.toFixed(0)} · sin({degLabel}°) = {(ratio * outerR).toFixed(1)} ÷ {outerR.toFixed(0)} = {ratio.toFixed(3)}
          </span>
        </div>
        <input
          type="range" min={0.2} max={2.0} step={0.05}
          value={ratioScale}
          onChange={(e) => onRatioScaleChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: '#f43f5e' }}
        />
        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          Watch the red triangle grow as you drag — the height (thick line) grows to keep
          the tip on the circle. The ratio in the top-right always stays {ratio.toFixed(3)}.
          Just like π is the same ratio for any size circle, sin({degLabel}°) is the same
          ratio for any size triangle with this angle.
        </p>
      </div>
    </div>
  )
}
