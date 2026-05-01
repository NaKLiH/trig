export const SPECIAL_ANGLES = [
  { rad: 0,                   label: '0',    deg: 0   },
  { rad: Math.PI / 6,         label: 'π/6',  deg: 30  },
  { rad: Math.PI / 4,         label: 'π/4',  deg: 45  },
  { rad: Math.PI / 3,         label: 'π/3',  deg: 60  },
  { rad: Math.PI / 2,         label: 'π/2',  deg: 90  },
  { rad: 2 * Math.PI / 3,     label: '2π/3', deg: 120 },
  { rad: 3 * Math.PI / 4,     label: '3π/4', deg: 135 },
  { rad: Math.PI,             label: 'π',    deg: 180 },
  { rad: 5 * Math.PI / 4,     label: '5π/4', deg: 225 },
  { rad: 3 * Math.PI / 2,     label: '3π/2', deg: 270 },
  { rad: 7 * Math.PI / 4,     label: '7π/4', deg: 315 },
  { rad: 2 * Math.PI,         label: '2π',   deg: 360 },
]

const SNAP_TOLERANCE = 0.025

export function snapToSpecialAngle(rad) {
  for (const s of SPECIAL_ANGLES) {
    if (Math.abs(rad - s.rad) < SNAP_TOLERANCE) return s
  }
  return null
}

export function formatAnglePi(rad) {
  const snap = snapToSpecialAngle(rad)
  if (snap) return snap.label
  return rad.toFixed(2)
}

export function toDegrees(rad) {
  return rad * (180 / Math.PI)
}

const SIN_LABELS = {
  0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2',
  90: '1', 120: '√3/2', 135: '√2/2', 180: '0',
  225: '−√2/2', 270: '−1', 315: '−√2/2', 360: '0',
}
const COS_LABELS = {
  0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2',
  90: '0', 120: '−1/2', 135: '−√2/2', 180: '−1',
  225: '−√2/2', 270: '0', 315: '√2/2', 360: '1',
}

export function specialValueLabel(rad) {
  const snap = snapToSpecialAngle(rad)
  if (!snap) return null
  return {
    sin: SIN_LABELS[snap.deg] ?? null,
    cos: COS_LABELS[snap.deg] ?? null,
  }
}
