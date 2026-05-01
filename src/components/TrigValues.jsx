import { COLORS } from '../constants/colors'
import { specialValueLabel } from '../utils/trig'

function fmt(n) { return parseFloat(n.toFixed(4)) }

function ValueCard({ colorKey, label, value, fraction, extra }) {
  const c = COLORS[colorKey]
  return (
    <div className={`flex-1 rounded-xl p-3 border ${c.border} bg-white`}>
      <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${c.label}`}>
        {label}
      </div>
      <div className={`font-mono font-bold text-xl ${c.label}`}>
        {value}
      </div>
      {fraction && (
        <div className={`text-xs mt-1 font-medium ${c.label} opacity-75`}>
          = {fraction}
        </div>
      )}
      {extra && (
        <div className="text-xs mt-1 text-slate-400">{extra}</div>
      )}
    </div>
  )
}

export default function TrigValues({ angle }) {
  const sinVal = Math.sin(angle)
  const cosVal = Math.cos(angle)
  const tanVal = Math.tan(angle)
  const tanDefined = Math.abs(cosVal) > 0.005

  const special = specialValueLabel(angle)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Values at this angle
      </h2>
      <div className="flex gap-2">
        <ValueCard
          colorKey="sin"
          label="sin θ"
          value={fmt(sinVal)}
          fraction={special?.sin}
        />
        <ValueCard
          colorKey="cos"
          label="cos θ"
          value={fmt(cosVal)}
          fraction={special?.cos}
        />
        <div className={`flex-1 rounded-xl p-3 border ${COLORS.tan.border} bg-white`}>
          <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${COLORS.tan.label}`}>
            tan θ
          </div>
          {tanDefined ? (
            <div className={`font-mono font-bold text-xl ${COLORS.tan.label}`}>
              {fmt(tanVal)}
            </div>
          ) : (
            <div className="font-mono font-bold text-xl text-slate-300">
              undef.
            </div>
          )}
          <div className="text-xs mt-1 text-slate-400">sin ÷ cos = opp ÷ adj</div>
        </div>
      </div>

      <div className="mt-3 bg-slate-50 rounded-xl px-3 py-2 text-center text-xs text-slate-500">
        sin²θ + cos²θ ={' '}
        <span className="font-mono font-bold text-slate-700">
          {(sinVal ** 2 + cosVal ** 2).toFixed(4)}
        </span>
        {' '}(always = 1 ✓)
      </div>
    </div>
  )
}
