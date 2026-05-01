import { useRef, useCallback } from 'react'
import { COLORS } from '../constants/colors'

const CX = 150, CY = 150, R = 120
const ARC_R = 30
const TANGENT_X = CX + R   // x = 270, the right edge of the circle (where tan is measured)

function angleFromPointer(e, svgEl) {
  const rect = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const scaleX = 320 / rect.width
  const scaleY = 300 / rect.height
  const svgX = (clientX - rect.left) * scaleX
  const svgY = (clientY - rect.top) * scaleY
  const dx = svgX - CX
  const dy = -(svgY - CY)
  let angle = Math.atan2(dy, dx)
  if (angle < 0) angle += 2 * Math.PI
  return angle
}

export default function UnitCircle({ angle, onAngleChange }) {
  const svgRef = useRef(null)
  const dragging = useRef(false)

  const cosVal = Math.cos(angle)
  const sinVal = Math.sin(angle)
  const tanVal = Math.tan(angle)

  const px = CX + cosVal * R
  const py = CY - sinVal * R
  const fx = px
  const fy = CY

  // Angle arc
  const arcEndX = CX + ARC_R * cosVal
  const arcEndY = CY - ARC_R * sinVal
  const largeArcFlag = angle > Math.PI ? 1 : 0
  const showArc = angle > 0.02

  const arcMidAngle = angle / 2
  const arcLabelX = CX + (ARC_R + 16) * Math.cos(arcMidAngle)
  const arcLabelY = CY - (ARC_R + 16) * Math.sin(arcMidAngle)

  // Tan visualization — vertical tangent line at x = CX+R, height = tan(θ) × R
  const tanDefined = Math.abs(cosVal) > 0.06
  const tanSegH = tanVal * R                          // signed SVG height (negative = upward)
  const tanY = CY - tanSegH                           // y-coordinate of intersection (may be off-screen)
  const tanIsLarge = Math.abs(tanSegH) > 130          // going off-screen — show ∞ label instead of dot label

  const handlePointerDown = useCallback((e) => {
    dragging.current = true
    if (e.pointerId != null) svgRef.current?.setPointerCapture(e.pointerId)
    onAngleChange(angleFromPointer(e, svgRef.current))
  }, [onAngleChange])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    onAngleChange(angleFromPointer(e, svgRef.current))
  }, [onAngleChange])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const showCosLabel = Math.abs(cosVal) > 0.18
  const showSinLabel = Math.abs(sinVal) > 0.18

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Unit Circle — drag P to explore
      </h2>
      <svg
        ref={svgRef}
        width="100%"
        viewBox="0 0 320 300"
        className="touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Axes */}
        <line x1={12} y1={CY} x2={305} y2={CY} stroke="#cbd5e1" strokeWidth={1.5}/>
        <line x1={CX} y1={12} x2={CX}  y2={288} stroke="#cbd5e1" strokeWidth={1.5}/>

        {/* Axis labels */}
        <text x={298} y={CY - 7} fontSize={10} fill="#94a3b8">+x</text>
        <text x={13}  y={CY - 7} fontSize={10} fill="#94a3b8">−x</text>
        <text x={CX + 5} y={18}  fontSize={10} fill="#94a3b8">+y</text>
        <text x={CX + 5} y={285} fontSize={10} fill="#94a3b8">−y</text>

        {/* Unit tick marks and labels */}
        {[1, -1].map(sign => (
          <g key={sign}>
            <line x1={CX + sign*R} y1={CY - 4} x2={CX + sign*R} y2={CY + 4} stroke="#94a3b8" strokeWidth={1}/>
            <text x={CX + sign*R} y={CY + 16} textAnchor="middle" fontSize={9} fill="#94a3b8">{sign}</text>
            <line x1={CX - 4} y1={CY - sign*R} x2={CX + 4} y2={CY - sign*R} stroke="#94a3b8" strokeWidth={1}/>
            <text x={CX - 14} y={CY - sign*R} textAnchor="middle" fontSize={9} fill="#94a3b8" dominantBaseline="middle">{sign}</text>
          </g>
        ))}

        {/* Circle */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={2}/>

        {/* Sector fill */}
        {showArc && (
          <path
            d={`M ${CX} ${CY} L ${CX + R} ${CY} A ${R} ${R} 0 ${largeArcFlag} 0 ${px} ${py} Z`}
            fill={COLORS.arc.fill}
          />
        )}

        {/* Angle arc */}
        {showArc && (
          <path
            d={`M ${CX + ARC_R} ${CY} A ${ARC_R} ${ARC_R} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}`}
            fill="none" stroke={COLORS.arc.stroke} strokeWidth={1.5}
          />
        )}

        {/* Arc / angle label */}
        {showArc && (
          <text
            x={arcLabelX} y={arcLabelY}
            fontSize={10} fill={COLORS.arc.text} fontWeight="600"
            textAnchor="middle" dominantBaseline="middle"
          >
            {Math.round(angle * 180 / Math.PI)}°
          </text>
        )}

        {/* Tangent line — touches the circle at exactly one point (x=1, the right edge) */}
        {tanDefined && (
          <>
            <line
              x1={TANGENT_X} y1={20} x2={TANGENT_X} y2={280}
              stroke={COLORS.tan.stroke} strokeWidth={1}
              strokeDasharray="4 3" opacity={0.5}
            />
            {/* Label the touch point — this is where the tangent meets the circle */}
            <circle cx={TANGENT_X} cy={CY} r={3} fill={COLORS.tan.stroke} opacity={0.7}/>
            <text x={TANGENT_X + 5} y={CY - 6} fontSize={8} fill={COLORS.tan.text} opacity={0.8}>
              touches
            </text>
            <text x={TANGENT_X + 5} y={CY + 3} fontSize={8} fill={COLORS.tan.text} opacity={0.8}>
              circle here
            </text>
          </>
        )}

        {/* Tan: segment from x-axis to intersection; SVG clips automatically at viewBox edge */}
        {tanDefined && (
          <g>
            {/* Faint extension of hypotenuse ray toward the tangent line (Q1/Q4 only) */}
            {cosVal > 0 && (
              <line
                x1={px} y1={py} x2={TANGENT_X} y2={tanY}
                stroke={COLORS.tan.stroke} strokeWidth={1.5}
                strokeDasharray="3 3" opacity={0.5}
              />
            )}
            {/* Tan segment — height from x-axis to intersection */}
            <line
              x1={TANGENT_X} y1={CY} x2={TANGENT_X} y2={tanY}
              stroke={COLORS.tan.stroke} strokeWidth={3}
            />
            {/* Dot at intersection (may be off-screen for large tan) */}
            {!tanIsLarge && (
              <circle cx={TANGENT_X} cy={tanY} r={4}
                fill={COLORS.tan.stroke} stroke="white" strokeWidth={1.5}/>
            )}
            {/* Label: normal when fits, ∞ when segment goes off-screen */}
            {!tanIsLarge && (
              <text x={TANGENT_X + 7} y={tanY} fill={COLORS.tan.text} dominantBaseline="middle">
                <tspan fontSize={10} fontWeight="600" x={TANGENT_X + 7} dy="-7">tan θ</tspan>
                <tspan fontSize={9} fontWeight="400" x={TANGENT_X + 7} dy="13">= {tanVal.toFixed(2)}</tspan>
              </text>
            )}
            {tanIsLarge && (
              <text x={TANGENT_X + 5} y={tanVal > 0 ? 26 : 282}
                fontSize={9} fill={COLORS.tan.text} fontWeight="600">
                tan → {tanVal > 0 ? '+∞' : '−∞'}
              </text>
            )}
          </g>
        )}

        {/* Triangle legs */}
        <line x1={CX} y1={CY} x2={fx} y2={fy} stroke={COLORS.cos.stroke} strokeWidth={2.5}/>
        <line x1={fx} y1={fy} x2={px} y2={py} stroke={COLORS.sin.stroke} strokeWidth={2.5}/>
        <line x1={CX} y1={CY} x2={px} y2={py} stroke={COLORS.hyp.stroke} strokeWidth={2.5}/>

        {/* Right-angle marker */}
        {Math.abs(sinVal) > 0.08 && Math.abs(cosVal) > 0.08 && (
          <rect
            x={cosVal >= 0 ? fx - 8 : fx}
            y={sinVal >= 0 ? fy - 8 : fy}
            width={8} height={8}
            fill="none" stroke="#94a3b8" strokeWidth={1}
          />
        )}

        {/* Leg labels */}
        {showCosLabel && (
          <text
            x={(CX + fx) / 2} y={sinVal >= 0 ? CY + 14 : CY - 6}
            textAnchor="middle" fill={COLORS.cos.text}
          >
            <tspan fontSize={10} fontWeight="600" x={(CX + fx) / 2} dy="0">cos θ</tspan>
            <tspan fontSize={9} fontWeight="400" x={(CX + fx) / 2} dy="13">= {cosVal.toFixed(2)}</tspan>
          </text>
        )}
        {showSinLabel && (
          <text
            x={cosVal >= 0 ? px + 22 : px - 22}
            y={(CY + py) / 2}
            textAnchor="middle" fill={COLORS.sin.text} dominantBaseline="middle"
          >
            <tspan fontSize={10} fontWeight="600" x={cosVal >= 0 ? px + 22 : px - 22} dy="-7">sin θ</tspan>
            <tspan fontSize={9} fontWeight="400" x={cosVal >= 0 ? px + 22 : px - 22} dy="13">= {sinVal.toFixed(2)}</tspan>
          </text>
        )}

        {/* Hypotenuse label "1" */}
        <text
          x={(CX + px) / 2 - 10 * sinVal}
          y={(CY + py) / 2 - 10 * cosVal}
          textAnchor="middle" fontSize={11} fill={COLORS.hyp.text} fontWeight="bold"
          dominantBaseline="middle"
        >
          1
        </text>

        {/* Origin */}
        <circle cx={CX} cy={CY} r={3} fill="#64748b"/>

        {/* Foot dot */}
        {Math.abs(sinVal) > 0.06 && (
          <circle cx={fx} cy={fy} r={3} fill={COLORS.cos.stroke}/>
        )}

        {/* Point P — draggable handle */}
        <circle cx={px} cy={py} r={10} fill="white" stroke={COLORS.hyp.stroke} strokeWidth={2.5} style={{ cursor: 'grab' }}/>
        <circle cx={px} cy={py} r={4}  fill={COLORS.hyp.stroke}/>
        {/* P label */}
        <text
          x={px + (cosVal >= 0 ? 13 : -13)}
          y={py + (sinVal >= 0 ? -4 : 14)}
          fontSize={11} fill={COLORS.hyp.text} fontWeight="bold"
          textAnchor={cosVal >= 0 ? 'start' : 'end'}
        >
          P
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.hyp.swatch}`}/>
          <span className={COLORS.hyp.label}>Hypotenuse OP = 1</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.sin.swatch}`}/>
          <span className={COLORS.sin.label}>sin θ — opposite</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.cos.swatch}`}/>
          <span className={COLORS.cos.label}>cos θ — adjacent</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-sm inline-block border ${COLORS.tan.swatch}`}/>
          <span className={COLORS.tan.label}>tan θ — length along the tangent line (that is why it is called tangent)</span>
        </span>
      </div>
    </div>
  )
}
