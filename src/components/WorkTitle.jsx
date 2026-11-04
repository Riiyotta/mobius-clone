// Centered "Work" + "scroll / drag" (§3.2). Letters rise 300px → 0 inside a clipped box (§6.2).
export default function WorkTitle() {
  return (
    <div className="title-wrap">
      <div className="title-clip">
        <h1 className="title">
          {[...'Work'].map((c, i) => (
            <span key={i} className="title-char" style={{ animationDelay: `${1.13 + i * 0.025}s` }}>{c}</span>
          ))}
        </h1>
      </div>
      <h6 className="hint">scroll / drag</h6>
    </div>
  )
}
