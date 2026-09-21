type StatCardProps = {
  label: string
  value: string
  hint: string
  accent?: boolean
}

export function StatCard({ label, value, hint, accent = false }: StatCardProps) {
  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  )
}
