import { COLORS } from '../constants/colors'
import { formatAnglePi, toDegrees, SPECIAL_ANGLES } from '../utils/trig'

export default function AngleControl({ angle, onAngleChange }) {
  const degrees = Math.round(toDegrees(angle))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Angle
      </h2>

      {/* Degrees: primary large display */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-3 text-center">
        <div className="text-xs text-slate-400 mb-1">Angle</div>
        <div className={`font-mono font-bold text-4xl leading-none ${COLORS.arc.label}`}>
          {degrees}°
        </div>
      </div>

      {/* Radians: secondary small display */}
      <div className="flex gap-2 mb-4 text-center">
        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 min-w-0">
          <div className="text-xs text-slate-400 mb-0.5">In radians</div>
          <div className="font-mono text-sm text-slate-500">
            {angle.toFixed(3)}
          </div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 min-w-0">
          <div className="text-xs text-slate-400 mb-0.5">As π fraction</div>
          <div className={`font-mono text-sm ${COLORS.arc.label} opacity-75`}>
            {formatAnglePi(angle)}
          </div>
        </div>
      </div>

      {/* Slider in degrees */}
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={degrees}
        onChange={(e) => onAngleChange(parseInt(e.target.value) * Math.PI / 180)}
        className="w-full cursor-pointer"
        style={{ accentColor: COLORS.arc.stroke }}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1 mb-4">
        <span>0°</span>
        <span>90°</span>
        <span>180°</span>
        <span>270°</span>
        <span>360°</span>
      </div>

      {/* Special angle buttons — degrees primary */}
      <div className="flex flex-wrap gap-1.5">
        {SPECIAL_ANGLES.map((s) => {
          const active = Math.abs(angle - s.rad) < 0.025
          return (
            <button
              key={s.label}
              onClick={() => onAngleChange(s.rad)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                active
                  ? `${COLORS.arc.badge} border-rose-300`
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s.deg}°
            </button>
          )
        })}
      </div>
    </div>
  )
}
