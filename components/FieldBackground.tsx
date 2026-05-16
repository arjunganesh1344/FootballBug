const YARD_LINES = [
  { pct: 10, label: '10' },
  { pct: 20, label: '20' },
  { pct: 30, label: '30' },
  { pct: 40, label: '40' },
  { pct: 50, label: '50' },
  { pct: 60, label: '40' },
  { pct: 70, label: '30' },
  { pct: 80, label: '20' },
  { pct: 90, label: '10' },
]

export default function FieldBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {YARD_LINES.map(({ pct, label }) => (
        <div
          key={pct}
          className="absolute w-full flex items-center"
          style={{ top: `${pct}%` }}
        >
          {/* yard line */}
          <div className="absolute w-full h-px bg-white/10" />
          {/* left number */}
          <span
            className="absolute left-6 text-white/20 text-sm font-mono font-bold tracking-widest select-none"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {label}
          </span>
          {/* right number */}
          <span
            className="absolute right-6 text-white/20 text-sm font-mono font-bold tracking-widest select-none"
            style={{ transform: 'rotate(90deg)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
