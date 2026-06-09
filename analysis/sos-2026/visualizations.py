"""
Generate SOS chart images for the nfl_tempo 2026 SOS article.

Run from anywhere:  python data-analysis/sos-2026/visualizations.py
Images are saved to: public/images/sos-2026/

Columns used:
  opp_def  = -off_sos  →  Opponent DEF Score, higher = harder for your offense
  opp_off  =  def_sos  →  Opponent OFF Score, higher = harder for your defense
"""

from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

HERE = Path(__file__).parent
df = pd.read_csv(HERE / 'sos_2026.csv')

# Unified direction: higher = harder for both
df['opp_def'] = -df['off_sos']
df['opp_off'] =  df['def_sos']

OUT = (HERE / '../../public/images/sos-2026').resolve()
OUT.mkdir(parents=True, exist_ok=True)

# Site palette
BG       = '#0a0a0a'
HARD     = '#ef4444'   # red-500
EASY     = '#22d3ee'   # cyan-400
TEXT     = '#e5e5e5'
MUTED    = '#737373'
ZERO_CLR = '#404040'


def bar_chart(data, col, title, xlabel, out_file):
    """Horizontal bar chart. Higher = harder, so sort descending → hardest at top."""
    sorted_df = data.sort_values(col, ascending=False).reset_index(drop=True)
    colors = [HARD if v > 0 else EASY for v in sorted_df[col]]

    fig, ax = plt.subplots(figsize=(9, 11))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.barh(range(len(sorted_df)), sorted_df[col], color=colors, height=0.65, zorder=2)
    ax.set_yticks(range(len(sorted_df)))
    ax.set_yticklabels(sorted_df['team'])
    ax.invert_yaxis()

    span = sorted_df[col].abs().max()
    pad  = span * 0.018
    for i, val in enumerate(sorted_df[col]):
        x  = val + pad if val >= 0 else val - pad
        ha = 'left' if val >= 0 else 'right'
        ax.text(x, i, f'{val:+.4f}', va='center', ha=ha, color=TEXT, fontsize=7.5)

    ax.axvline(0, color=ZERO_CLR, lw=1.0, zorder=1)
    ax.set_xlabel(xlabel, color=MUTED, fontsize=9, labelpad=8)
    ax.set_title(title, color=TEXT, fontsize=13, fontweight='bold', pad=14)

    ax.tick_params(length=0, colors=TEXT)
    for lbl in ax.get_yticklabels():
        lbl.set_fontsize(9)
    for lbl in ax.get_xticklabels():
        lbl.set_color(MUTED)
        lbl.set_fontsize(8)

    for sp in ax.spines.values():
        sp.set_visible(False)

    patches = [
        mpatches.Patch(facecolor=HARD, label='Harder', edgecolor='none'),
        mpatches.Patch(facecolor=EASY, label='Easier', edgecolor='none'),
    ]
    ax.legend(handles=patches, loc='lower right',
              facecolor='#1c1c1c', edgecolor='#333', labelcolor=TEXT,
              fontsize=8.5, framealpha=0.9)

    plt.tight_layout(pad=1.5)
    plt.savefig(OUT / out_file, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f'  saved  {out_file}')


def quadrant_chart(data, out_file):
    """
    x = opp_def (higher = harder opponent defenses, i.e. harder for your offense) → right = harder
    y = opp_off (higher = harder opponent offenses, i.e. harder for your defense) → up = harder

    Quadrants:
      bottom-left : easy opp DEF + easy opp OFF  (schedule gift)
      top-left    : easy opp DEF + hard opp OFF  (easy offense draw, tough defense draw)
      bottom-right: hard opp DEF + easy opp OFF  (tough offense draw, easy defense draw)
      top-right   : hard opp DEF + hard opp OFF  (tough both ways)
    """
    fig, ax = plt.subplots(figsize=(11, 10))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    x_pad, y_pad = 0.008, 0.006
    xlim = (data['opp_def'].min() - x_pad, data['opp_def'].max() + x_pad)
    ylim = (data['opp_off'].min() - y_pad, data['opp_off'].max() + y_pad)
    ax.set_xlim(xlim)
    ax.set_ylim(ylim)

    alpha = 0.07
    ax.fill_betweenx([ylim[0], 0], xlim[0], 0, color=EASY,      alpha=alpha)  # bottom-left: easy both
    ax.fill_betweenx([0, ylim[1]], xlim[0], 0, color='#a78bfa',  alpha=alpha)  # top-left:    easy def, hard off
    ax.fill_betweenx([ylim[0], 0], 0, xlim[1], color='#f97316',  alpha=alpha)  # bottom-right: hard def, easy off
    ax.fill_betweenx([0, ylim[1]], 0, xlim[1], color=HARD,       alpha=alpha)  # top-right:   hard both

    ax.axhline(0, color=ZERO_CLR, lw=1.0, zorder=1)
    ax.axvline(0, color=ZERO_CLR, lw=1.0, zorder=1)

    ax.scatter(data['opp_def'], data['opp_off'], color=TEXT, s=30, zorder=3, linewidths=0)

    for _, row in data.iterrows():
        ax.annotate(
            row['team'], xy=(row['opp_def'], row['opp_off']),
            xytext=(4, 3), textcoords='offset points',
            fontsize=7.5, color=TEXT, ha='left', va='bottom',
        )

    ql = dict(fontsize=8, color=MUTED, style='italic', ha='center', va='center')
    mid_x_left  = (xlim[0] + 0) / 2
    mid_x_right = (0 + xlim[1]) / 2
    mid_y_top   = (0 + ylim[1]) / 2
    mid_y_bot   = (ylim[0] + 0) / 2
    ax.text(mid_x_left,  mid_y_bot, 'Easy Both',              **ql)
    ax.text(mid_x_left,  mid_y_top, 'Easy Opp DEF\nHard Opp OFF', **ql)
    ax.text(mid_x_right, mid_y_bot, 'Hard Opp DEF\nEasy Opp OFF', **ql)
    ax.text(mid_x_right, mid_y_top, 'Hard Both',              **ql)

    ax.set_xlabel('Opponent DEF Score  (← easier   harder →)', color=MUTED, fontsize=9, labelpad=8)
    ax.set_ylabel('Opponent OFF Score  (← easier   harder →)', color=MUTED, fontsize=9, labelpad=8)
    ax.set_title('2026 NFL Schedule Difficulty: Opponent DEF vs. Opponent OFF', color=TEXT, fontsize=12, fontweight='bold', pad=14)

    ax.tick_params(colors=MUTED, length=3)
    for lbl in ax.get_xticklabels() + ax.get_yticklabels():
        lbl.set_color(MUTED)
        lbl.set_fontsize(8)

    for sp in ax.spines.values():
        sp.set_color(ZERO_CLR)

    plt.tight_layout(pad=1.5)
    plt.savefig(OUT / out_file, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f'  saved  {out_file}')


print(f'Writing images to {OUT}\n')

bar_chart(
    df, 'opp_def',
    title='2026 NFL Opponent DEF Score',
    xlabel='Avg Adjusted Defensive EPA/Play of 2026 Opponents  (higher = harder)',
    out_file='off-sos-2026.png',
)

bar_chart(
    df, 'opp_off',
    title='2026 NFL Opponent OFF Score',
    xlabel='Avg Adjusted Offensive EPA/Play of 2026 Opponents  (higher = harder)',
    out_file='def-sos-2026.png',
)

quadrant_chart(df, 'sos-quadrant-2026.png')

print('\nDone.')
