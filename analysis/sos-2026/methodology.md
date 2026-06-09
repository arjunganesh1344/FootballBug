# Methodology: 2026 Opponent DEF Score & Opponent OFF Score via Opponent-Adjusted EPA

## Goal

For every NFL team, produce two strength of schedule scores based on their 2026 opponents' 2025 performance:

- **Opponent DEF Score** — how tough are the defenses your offense will face? Higher = harder.
- **Opponent OFF Score** — how tough are the offenses your defense will face? Higher = harder.

Both scores use the same direction: **higher = harder**. See the note in Step 5 on how `off_sos` from the CSV is transformed before publishing.

---

## Data Sources

All data pulled via the `nfl_data_py` Python package, which wraps the nflfastR dataset.

- **Play-by-play**: `nfl.import_pbp_data([2025])` — all 2025 NFL plays, regular season (weeks 1–18) and playoffs (weeks 19–22)
- **2026 schedule**: `nfl.import_schedules([2026])` — full regular season schedule, weeks 1–18

---

## Step 1: Filter Plays

From the 2025 play-by-play data, we kept only plays where:

- `play_type` is `'pass'` or `'run'`
- `two_point_attempt == 0` (exclude two-point conversions)
- `epa` is not null
- `posteam` is not null

This left **48,771 plays** across weeks 1–22.

---

## Step 2: Compute Raw EPA/Play by Unit

Using the filtered plays, we computed each team's average EPA per play from two perspectives:

- **Raw offensive EPA/play**: grouped by `posteam`, averaged `epa`
  - Positive = better than average offense
- **Raw defensive EPA/play**: grouped by `defteam`, averaged `epa`
  - Negative = better than average defense (they suppressed EPA)

> Note: defensive EPA is measured from the offense's perspective — a defense that held offenses below the league average will have a negative raw_def_epa relative to the mean.

---

## Step 3: Build Opponent Matchup Lookup

From the same play-by-play data, we extracted every unique `(posteam, defteam)` pairing per game. This gives us:

- For each team's **offense**: which defenses did they face in 2025?
- For each team's **defense**: which offenses did they face in 2025?

---

## Step 4: Opponent-Adjust EPA

Raw EPA/play is inflated or deflated by opponent quality. A team that faced weak defenses all year will look like a better offense than they really are. We correct for this with a one-level opponent adjustment.

### Formula

```
adj_off_epa = raw_off_epa - (avg_opp_def_epa - league_avg_def_epa)
adj_def_epa = raw_def_epa - (avg_opp_off_epa - league_avg_off_epa)
```

### How to read this

**Offensive adjustment**: if your opponents' defenses were better than league average (lower `raw_def_epa`), the term in parentheses is negative, so we add to your offensive EPA — crediting you for a harder schedule. If your opponents' defenses were worse than average, we subtract — penalizing you for padding stats.

**Defensive adjustment**: same logic in reverse. If you faced better-than-average offenses, we credit your defense. If you faced weak offenses, we penalize.

### What "one-level" means

This adjustment uses each opponent's *raw* EPA — it does not further adjust for *their* opponents' quality. Going deeper (iterating until convergence) is how metrics like DVOA works, but one level of adjustment captures the majority of the signal and is transparent and reproducible.

---

## Step 5: Compute 2026 SOS Scores

From the 2026 schedule (`import_schedules([2026])`), we used:
- `home_team` and `away_team` to build a full list of matchups
- `game_type == 'REG'` to keep regular season only (272 games, weeks 1–18)

For each team, we joined their 17 opponents against the 2025 adjusted EPA values computed above:

- **`off_sos`** (CSV column) = average `adj_def_epa` of all 2026 opponents
  - Lower = harder (you face better defenses)
- **`def_sos`** (CSV column) = average `adj_off_epa` of all 2026 opponents
  - Higher = harder (you face better offenses)

### Published score names and direction

The raw `off_sos` column has an inverted sign relative to `def_sos`, which is confusing. For publication and visualizations, both are transformed to a unified scale where **higher = harder**:

- **Opponent DEF Score** = `-off_sos` — higher means tougher defenses for your offense
- **Opponent OFF Score** = `def_sos` — no change; higher already means tougher offenses for your defense

This transformation is applied in `visualizations.py` and reflected in the article. The `sos_2026.csv` file retains the raw `off_sos` / `def_sos` column names for traceability back to the notebook.

---

## Limitations

- **One year of data**: 2025 performance is the sole input. Teams that underwent major roster changes (new QB, key free agent departures, new coaching staff) may be poor proxies for 2026.
- **One-level adjustment**: not fully iterative like DVOA. Captures most opponent quality signal but not all.
- **Regular season schedule only for 2026**: playoff matchups are unknown so SOS reflects only the 17-game regular season slate.
- **Unit-level splits not separated**: offensive and defensive EPA are whole-unit numbers, not broken down by passing vs. rushing. A team with a great passing offense but weak run game gets one blended number.
