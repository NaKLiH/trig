import { useState } from 'react'
import UnitCircle from './components/UnitCircle'
import AngleControl from './components/AngleControl'
import TrigValues from './components/TrigValues'
import SineWaveGraph from './components/SineWaveGraph'
import RatioExplainer from './components/RatioExplainer'
import './index.css'

export default function App() {
  const [angle, setAngle] = useState(Math.PI / 4)
  const [ratioScale, setRatioScale] = useState(1.0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800">
            Trigonometry & The Unit Circle
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Just like π, sin and cos are{' '}
            <span className="text-purple-600 font-semibold">fixed ratios</span> — the same for any triangle with the same angles, no matter the size
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Why a circle? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-bold text-slate-700 text-base mb-2">Why do we use a circle?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            A right triangle can only have angles up to 90°. But angles go all the way to
            360° — think of a compass or a spinning wheel. The circle fixes this: drag P
            anywhere around it and you cover every angle from 0° to 360°. The triangle
            inside reshapes itself as P moves, and sin, cos, and tan track what happens
            to the sides at every angle.
          </p>
        </div>

        {/* Key insight: trig ratios are like π */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="text-amber-800 font-bold text-base mb-2">
            Sin, cos, and tan are like π — they are fixed ratios
          </h2>
          <p className="text-amber-800 text-sm leading-relaxed">
            You already know π ≈ 3.14. But what actually <em>is</em> π? It is a ratio —
            take any circle, divide its circumference by its diameter, and you always get the
            same answer: π. A dinner plate, a bicycle wheel, a planet — the ratio is always π.
          </p>
          <p className="text-amber-800 text-sm leading-relaxed mt-2">
            Sin, cos, and tan work exactly the same way. Pick any angle — say 30°.
            Draw a right-angled triangle with a 30° corner. Measure the side <em>opposite</em> that
            angle, then divide by the <em>hypotenuse</em>. You always get 0.5 — no matter how big
            or small the triangle. That ratio has a name: <strong>sin(30°) = 0.5</strong>.
            Just like π is "circumference ÷ diameter", sin(30°) is "opposite ÷ hypotenuse at 30°".
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: unit circle, controls, values */}
          <div className="flex flex-col gap-5">
            <UnitCircle angle={angle} onAngleChange={setAngle} />
            <AngleControl angle={angle} onAngleChange={setAngle} />
            <TrigValues angle={angle} />
          </div>

          {/* Right: waves and arc-length callout */}
          <div className="flex flex-col gap-5">
            <SineWaveGraph angle={angle} />

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="text-blue-800 font-bold text-sm mb-2">
                Why the hypotenuse is always 1
              </h3>
              <p className="text-blue-700 text-xs leading-relaxed mb-2">
                The hypotenuse of the triangle is the line from the centre O to the point P.
                But that line is just the radius of the circle — and because we drew a circle
                with radius 1, the hypotenuse is <em>always</em> exactly 1, no matter where P is.
                That is why it is called the <strong>unit</strong> circle.
              </p>
              <p className="text-blue-700 text-xs leading-relaxed">
                This is the clever part. Because the hypotenuse is 1, dividing by it changes
                nothing — so the ratios simplify: sin θ = opposite ÷ 1 = opposite, and
                cos θ = adjacent ÷ 1 = adjacent. The{' '}
                <span className="font-semibold text-blue-700">blue side</span> is sin θ and
                the <span className="font-semibold text-emerald-700">green side</span> is
                cos θ — you can just read them straight off the diagram.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="text-amber-800 font-bold text-sm mb-3">
                Tan — the third ratio
              </h3>
              <p className="text-amber-800 text-xs leading-relaxed mb-2">
                There are three sides in a right triangle, so there are three possible ratios:
              </p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"/>
                  <span className="text-slate-700">opposite ÷ hypotenuse = <strong className="text-blue-600">sin θ</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>
                  <span className="text-slate-700">adjacent ÷ hypotenuse = <strong className="text-emerald-600">cos θ</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"/>
                  <span className="text-slate-700">opposite ÷ adjacent = <strong className="text-amber-600">tan θ</strong> (no hypotenuse needed)</span>
                </div>
              </div>
              <p className="text-amber-800 text-xs leading-relaxed mb-2">
                The <span className="font-semibold">dashed amber line</span> is the tangent to
                the circle at its rightmost point — where the circle meets the x-axis on the right.
                A tangent line touches a curve at exactly one point without crossing it. At the
                rightmost point the radius points straight across, so the tangent is straight up
                and down — a fixed vertical line sitting at x=1.
              </p>
              <p className="text-amber-800 text-xs leading-relaxed mb-2">
                The line stays fixed at x=1 rather than moving with P. The height of the
                amber segment where the angle ray meets it equals tan θ.
              </p>
              <p className="text-amber-800 text-xs leading-relaxed">
                Try dragging P close to 90°. The <span className="font-semibold text-emerald-700">green
                adjacent side</span> shrinks towards zero — dividing by nearly zero gives a huge
                number, so tan shoots off towards infinity and the amber segment flies off the screen.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="text-slate-600 font-bold text-sm mb-2">
                Curious about radians? (optional)
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Radians are just another way to measure angles that mathematicians prefer — a
                full circle is 2π radians instead of 360°, so 180° = π radians and 90° = π/2.
                You don't need them to understand this page, but they show up a lot later in maths.
              </p>
            </div>
          </div>
        </div>

        {/* Full-width: ratio explainer */}
        <RatioExplainer
          angle={angle}
          ratioScale={ratioScale}
          onRatioScaleChange={setRatioScale}
        />

      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        Built for curious minds — trigonometry made visual
      </footer>
    </div>
  )
}
