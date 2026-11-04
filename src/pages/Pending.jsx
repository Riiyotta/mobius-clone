// Temporary shell while the page's recon spec is being measured.
export default function Pending({ name }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
      {name} — being rebuilt
    </div>
  )
}
