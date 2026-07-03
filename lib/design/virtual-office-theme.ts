export const virtualOfficeTheme = {
  backgrounds: {
    app: "bg-[#070b12] text-slate-100",
    commandCenter:
      "bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(16,185,129,0.10),transparent_28%),linear-gradient(180deg,#09111d_0%,#070b12_58%,#05070b_100%)]",
    officeGrid:
      "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] before:bg-[size:42px_42px]",
    reviewRoom:
      "bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.20),transparent_34%),linear-gradient(180deg,#0b1220_0%,#080d16_100%)]",
  },
  surfaces: {
    base: "border border-white/8 bg-[#101826]/86 shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
    raised: "border border-white/10 bg-[#121d2c]/92 shadow-[0_18px_54px_rgba(0,0,0,0.34)]",
    sunken: "border border-slate-700/80 bg-[#0b111c]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
    glass: "border border-white/10 bg-white/[0.055] backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.24)]",
    mapDeck: "border border-cyan-100/12 bg-[#0d1624]/88 shadow-[0_24px_90px_rgba(8,47,73,0.22)]",
  },
  roomCards: {
    base: "relative overflow-hidden rounded-[20px] border p-4 transition duration-200 hover:-translate-y-0.5",
    cyan: "border-cyan-100/18 bg-gradient-to-br from-cyan-300/12 via-[#111b29] to-[#0b111b]",
    teal: "border-emerald-100/18 bg-gradient-to-br from-emerald-300/12 via-[#111b29] to-[#0b111b]",
    amber: "border-amber-100/20 bg-gradient-to-br from-amber-300/12 via-[#161b23] to-[#0b111b]",
    red: "border-rose-100/20 bg-gradient-to-br from-rose-300/12 via-[#161821] to-[#0b111b]",
    violet: "border-blue-100/18 bg-gradient-to-br from-indigo-300/12 via-[#111827] to-[#0b111b]",
  },
  evidencePanels: {
    neutral: "border border-white/8 bg-[#0f1724]/84",
    success: "border border-emerald-200/16 bg-emerald-300/[0.055]",
    warning: "border border-amber-200/18 bg-amber-300/[0.06]",
    danger: "border border-rose-200/18 bg-rose-300/[0.06]",
    review: "border border-blue-200/16 bg-blue-300/[0.055]",
  },
  actionPanels: {
    base: "border border-white/9 bg-[#121c2b]/88 shadow-[0_16px_48px_rgba(0,0,0,0.22)]",
    primary: "border border-cyan-200/22 bg-cyan-300/[0.07]",
    hold: "border border-amber-200/22 bg-amber-300/[0.07]",
    reject: "border border-rose-200/22 bg-rose-300/[0.07]",
  },
  localOnlyNotices: {
    base: "border border-cyan-100/14 bg-cyan-200/[0.045] text-cyan-50",
    quiet: "border border-slate-300/12 bg-slate-200/[0.04] text-slate-200",
  },
  typography: {
    overline: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500",
    title: "text-base font-bold tracking-tight text-white",
    sectionTitle: "text-lg font-black tracking-tight text-white",
    body: "text-sm leading-6 text-slate-300",
    caption: "text-xs leading-5 text-slate-500",
    metric: "text-2xl font-black tabular-nums tracking-tight text-white",
  },
  focus:
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200/80",
} as const;

export type VirtualOfficeTheme = typeof virtualOfficeTheme;
export type OfficeSurfaceTone = keyof typeof virtualOfficeTheme.surfaces;
export type RoomCardAccent = keyof typeof virtualOfficeTheme.roomCards;
export type EvidencePanelTone = keyof typeof virtualOfficeTheme.evidencePanels;
export type ActionPanelTone = keyof typeof virtualOfficeTheme.actionPanels;
