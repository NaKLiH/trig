import { COLORS } from '../constants/colors'

const W = 600, H = 200
const LEFT = 45, RIGHT = 585, MID = 100, AMP = 60
const SAMPLES = 300
const TWO_PI = 2 * Math.PI

function waveX(t) { return LEFT + (t / TWO_PI) * (RIGHT - LEFT) }
function waveY(v) { return MID - v * AMP }

function buildPath(fn) {
  const pts = []
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * TWO_PI
    pts.push(`${i === 0 ? 'M' : 'L'} ${waveX(t).toFixed(2)} ${waveY(fn(t)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const sinPath = buildPath(Math.sin)
const cosPath = buildPath(Math.cos)

const PI_MARKERS = [
  { t: 0,             label: '0°'   },
  { t: Math.PI / 2,  label: '90°'  },
  { t: Math.PI,      label: '180°' },
  { t: 3*Math.PI/2,  label: '270°' },
  { t: TWO_PI,       label: '360°' },
]

export default function SineWaveGraph({ angle }) {
  const cursorX = waveX(angle)
  const sinDotY = waveY(Math.sin(angle))
  const cosDotY = waveY(Math.cos(angle))
  const nearRight = cursorX > RIGHT - 65

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Sine & Cosine Waves
      </h2>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Amplitude guide lines */}
        <line x1={LEFT} y1={waveY(1)}  x2={RIGHT} y2={waveY(1)}  stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3"/>
        <line x1={LEFT} y1={waveY(-1)} x2={RIGHT} y2={waveY(-1)} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3"/>
        {/* Midline */}
        <line x1={LEFT} y1={MID} x2={RIGHT} y2={MID} stroke="#e2e8f0" strokeWidth={1}/>

        {/* Y labels */}
        <text x={LEFT - 5} y={waveY(1)}  textAnchor="end" fontSize={10} fill="#94a3b8" dominantBaseline="middle">1</text>
        <text x={LEFT - 5} y={MID}        textAnchor="end" fontSize={10} fill="#94a3b8" dominantBaseline="middle">0</text>
        <text x={LEFT - 5} y={waveY(-1)} textAnchor="end" fontSize={10} fill="#94a3b8" dominantBaseline="middle">−1</text>

        {/* π markers */}
        {PI_MARKERS.map(m => (
          <g key={m.label}>
            <line x1={waveX(m.t)} y1={12} x2={waveX(m.t)} y2={H - 18} stroke="#f1f5f9" strokeWidth={1}/>
            <text x={waveX(m.t)} y={H - 4} textAnchor="middle" fontSize={10} fill="#94a3b8">
              {m.label}
            </text>
          </g>
        ))}

        {/* Waves */}
        <path d={cosPath} fill="none" stroke={COLORS.cos.stroke} strokeWidth={2} opacity={0.65}/>
        <path d={sinPath} fill="none" stroke={COLORS.sin.stroke} strokeWidth={2.5}/>

        {/* Cursor */}
        <line x1={cursorX} y1={12} x2={cursorX} y2={H - 20} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2"/>

        {/* Value dots */}
        <circle cx={cursorX} cy={cosDotY} r={5} fill={COLORS.cos.stroke} stroke="white" strokeWidth={2}/>
        <circle cx={cursorX} cy={sinDotY} r={5} fill={COLORS.sin.stroke} stroke="white" strokeWidth={2}/>

        {/* Dot labels */}
        <text
          x={nearRight ? cursorX - 8 : cursorX + 8}
          y={sinDotY}
          fontSize={10} fill={COLORS.sin.text} fontWeight="600"
          dominantBaseline="middle"
          textAnchor={nearRight ? 'end' : 'start'}
        >
          {Math.sin(angle).toFixed(3)}
        </text>
        <text
          x={nearRight ? cursorX - 8 : cursorX + 8}
          y={cosDotY}
          fontSize={10} fill={COLORS.cos.text} fontWeight="600"
          dominantBaseline="middle"
          textAnchor={nearRight ? 'end' : 'start'}
        >
          {Math.cos(angle).toFixed(3)}
        </text>
      </svg>

      <div className="mt-2 flex gap-4 justify-center text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 inline-block rounded" style={{ background: COLORS.sin.stroke }}/>
          <span className={COLORS.sin.label}>sin θ</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 inline-block rounded" style={{ background: COLORS.cos.stroke }}/>
          <span className={COLORS.cos.label}>cos θ</span>
        </span>
      </div>
    </div>
  )
}
