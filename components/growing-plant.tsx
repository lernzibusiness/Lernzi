/** Decorative, locally rendered artwork using Lernzi's existing palette. */
export default function GrowingPlant({ className = "", small = false }: { className?: string; small?: boolean }) {
  return <svg className={`growing-plant ${className}`} viewBox="0 0 220 250" fill="none" aria-hidden="true" focusable="false">
    <ellipse cx="112" cy="232" rx="76" ry="12" fill="#1E3A8A" opacity=".09" />
    <g className="plant-foliage">
      <path d="M111 194C111 155 97 113 115 49" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" />
      <path d="M107 160C66 160 43 133 42 107C79 101 107 122 107 160Z" fill="#10B981" />
      <path d="M105 158L57 119" stroke="#1E3A8A" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 129C145 130 176 105 178 75C141 73 110 91 108 129Z" fill="#06B6D4" />
      <path d="M113 124L162 88" stroke="#1E3A8A" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <path d="M106 100C75 100 57 78 57 51C88 49 107 69 106 100Z" fill="#10B981" />
      <path d="M103 94L69 63" stroke="#1E3A8A" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <path d="M113 65C112 34 130 15 157 14C161 43 143 62 113 65Z" fill="#10B981" />
      <path d="M119 57L146 27" stroke="#1E3A8A" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      {!small && <>
        <path d="M133 192C147 170 158 155 180 144M88 191C76 173 61 169 30 169" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" />
        <path d="M157 168C151 141 168 124 199 125C199 148 183 164 157 168Z" fill="#10B981" />
        <path d="M67 178C40 188 18 181 12 157C36 147 59 157 67 178Z" fill="#06B6D4" />
      </>}
    </g>
    <path d="M69 183H151L141 221C139 229 131 233 111 233C91 233 81 229 79 221Z" fill="#1E3A8A" />
    <path d="M69 183H124L119 221C118 228 107 231 96 230C86 229 81 226 79 220Z" fill="#3B82F6" />
    <rect x="63" y="177" width="94" height="16" rx="8" fill="#3B82F6" />
    <path d="M74 182H142" stroke="#F8FAFC" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
    <path d="M86 202L89 217" stroke="#F8FAFC" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
  </svg>;
}
