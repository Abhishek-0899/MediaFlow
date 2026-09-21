type ToggleProps = {
  enabled: boolean
  onToggle: () => void
  label: string
}

export function Toggle({ enabled, onToggle, label }: ToggleProps) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button className={`toggle ${enabled ? 'on' : ''}`} onClick={onToggle} type="button">
        <span />
      </button>
    </div>
  )
}
