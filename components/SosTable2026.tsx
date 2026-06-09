'use client'
import { useState } from 'react'

type SortCol = 'oppDef' | 'oppOff'

const DATA = [
  { team: 'CAR', oppDef:  0.0283, oppOff: -0.0140 },
  { team: 'CHI', oppDef:  0.0201, oppOff:  0.0049 },
  { team: 'PIT', oppDef:  0.0189, oppOff: -0.0225 },
  { team: 'LV',  oppDef:  0.0126, oppOff: -0.0011 },
  { team: 'LAC', oppDef:  0.0079, oppOff:  0.0075 },
  { team: 'GB',  oppDef:  0.0061, oppOff:  0.0082 },
  { team: 'CIN', oppDef:  0.0050, oppOff: -0.0262 },
  { team: 'SF',  oppDef:  0.0048, oppOff:  0.0094 },
  { team: 'TB',  oppDef:  0.0027, oppOff: -0.0130 },
  { team: 'BUF', oppDef:  0.0025, oppOff: -0.0013 },
  { team: 'NYJ', oppDef:  0.0003, oppOff:  0.0016 },
  { team: 'ARI', oppDef: -0.0006, oppOff:  0.0219 },
  { team: 'TEN', oppDef: -0.0009, oppOff: -0.0029 },
  { team: 'IND', oppDef: -0.0013, oppOff: -0.0180 },
  { team: 'DEN', oppDef: -0.0015, oppOff: -0.0009 },
  { team: 'BAL', oppDef: -0.0018, oppOff: -0.0209 },
  { team: 'KC',  oppDef: -0.0033, oppOff:  0.0008 },
  { team: 'NYG', oppDef: -0.0062, oppOff:  0.0151 },
  { team: 'NE',  oppDef: -0.0066, oppOff:  0.0012 },
  { team: 'ATL', oppDef: -0.0071, oppOff: -0.0126 },
  { team: 'DAL', oppDef: -0.0077, oppOff:  0.0320 },
  { team: 'JAX', oppDef: -0.0085, oppOff:  0.0061 },
  { team: 'WAS', oppDef: -0.0091, oppOff:  0.0215 },
  { team: 'MIA', oppDef: -0.0118, oppOff:  0.0197 },
  { team: 'NO',  oppDef: -0.0126, oppOff: -0.0229 },
  { team: 'LA',  oppDef: -0.0157, oppOff:  0.0272 },
  { team: 'DET', oppDef: -0.0193, oppOff: -0.0077 },
  { team: 'CLE', oppDef: -0.0213, oppOff: -0.0206 },
  { team: 'SEA', oppDef: -0.0220, oppOff:  0.0302 },
  { team: 'HOU', oppDef: -0.0246, oppOff:  0.0146 },
  { team: 'MIN', oppDef: -0.0286, oppOff:  0.0329 },
  { team: 'PHI', oppDef: -0.0426, oppOff:  0.0327 },
]

function fmt(v: number) {
  return (v >= 0 ? '+' : '') + v.toFixed(4)
}

function Cell({ value }: { value: number }) {
  const hard = value > 0
  return (
    <td className="px-4 py-2.5 text-right tabular-nums">
      <span className={hard ? 'text-red-400' : 'text-cyan-400'}>
        {fmt(value)}
      </span>
    </td>
  )
}

export default function SosTable2026() {
  const [sortCol, setSortCol] = useState<SortCol>('oppDef')

  const sorted = [...DATA].sort((a, b) => b[sortCol] - a[sortCol])

  function ColHeader({ col, label }: { col: SortCol; label: string }) {
    const active = sortCol === col
    return (
      <th
        className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
        onClick={() => setSortCol(col)}
      >
        <span className={active ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}>
          {label}{active ? ' ↓' : ''}
        </span>
      </th>
    )
  }

  return (
    <div className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900">
              <th className="w-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Team
              </th>
              <ColHeader col="oppDef" label="Opp DEF" />
              <ColHeader col="oppOff" label="Opp OFF" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {sorted.map(({ team, oppDef, oppOff }, i) => (
              <tr key={team} className="bg-neutral-950 transition-colors hover:bg-neutral-900">
                <td className="px-4 py-2.5 text-xs text-neutral-600">{i + 1}</td>
                <td className="px-4 py-2.5 font-semibold text-white">{team}</td>
                <Cell value={oppDef} />
                <Cell value={oppOff} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-right text-xs text-neutral-600">
        Higher = harder. Click a column to sort.
      </p>
    </div>
  )
}
