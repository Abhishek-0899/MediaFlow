type MediaControlsProps = {
  bulkLocation: string
  bulkDate: string
  bulkTags: string
  folderPattern: string
  folderPatterns: string[]
  onLocationChange: (value: string) => void
  onDateChange: (value: string) => void
  onTagsChange: (value: string) => void
  onApplyBulk: () => void
  onRemoveDuplicates: () => void
  onDeleteSelected: () => void
  onSelectAllVisible: () => void
  onFolderPatternChange: (value: string) => void
  onApplyFolders: () => void
  onToggleAiGrouping: () => void
  onToggleCloudSync: () => void
  aiGrouping: boolean
  cloudSync: boolean
}

export function MediaControls({
  bulkLocation,
  bulkDate,
  bulkTags,
  folderPattern,
  folderPatterns,
  onLocationChange,
  onDateChange,
  onTagsChange,
  onApplyBulk,
  onRemoveDuplicates,
  onDeleteSelected,
  onSelectAllVisible,
  onFolderPatternChange,
  onApplyFolders,
  onToggleAiGrouping,
  onToggleCloudSync,
  aiGrouping,
  cloudSync,
}: MediaControlsProps) {
  return (
    <section className="lower-grid">
      <div className="panel-card">
        <div className="panel-header compact">
          <div>
            <p className="card-label">Metadata tools</p>
            <h3>Bulk correction</h3>
          </div>
          <button className="ghost-button" onClick={onSelectAllVisible} type="button">Select all visible</button>
        </div>

        <div className="bulk-form">
          <label>
            <span>Location</span>
            <input value={bulkLocation} onChange={(event) => onLocationChange(event.target.value)} />
          </label>
          <label>
            <span>Date</span>
            <input type="date" value={bulkDate} onChange={(event) => onDateChange(event.target.value)} />
          </label>
          <label>
            <span>Tags</span>
            <input value={bulkTags} onChange={(event) => onTagsChange(event.target.value)} />
          </label>
        </div>

        <div className="action-row">
          <button className="primary-button" onClick={onApplyBulk} type="button">Apply to selected</button>
          <button className="danger-button" onClick={onRemoveDuplicates} type="button">Remove duplicates</button>
          <button className="danger-button" onClick={onDeleteSelected} type="button">Delete selected</button>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header compact">
          <div>
            <p className="card-label">Auto-organize</p>
            <h3>Date-based folders</h3>
          </div>
          <select value={folderPattern} onChange={(event) => onFolderPatternChange(event.target.value)}>
            {folderPatterns.map((pattern) => (
              <option key={pattern} value={pattern}>{pattern}</option>
            ))}
          </select>
        </div>

        <div className="folder-list">
          {folderPatterns.map((pattern) => (
            <div key={pattern} className="folder-pill">{pattern}</div>
          ))}
        </div>

        <div className="action-row">
          <button className="primary-button" onClick={onApplyFolders} type="button">Apply folder structure</button>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header compact">
          <div>
            <p className="card-label">AI automation</p>
            <h3>Smart grouping</h3>
          </div>
        </div>

        <div className="toggle-row">
          <span>AI-powered grouping</span>
          <button className={`toggle ${aiGrouping ? 'on' : ''}`} onClick={onToggleAiGrouping} type="button">
            <span />
          </button>
        </div>
        <div className="toggle-row">
          <span>Cloud storage sync</span>
          <button className={`toggle ${cloudSync ? 'on' : ''}`} onClick={onToggleCloudSync} type="button">
            <span />
          </button>
        </div>

        <div className="group-summary">
          <strong>{aiGrouping ? 'AI clusters active' : 'AI clusters paused'}</strong>
          <small>{cloudSync ? 'Auto-sync enabled to Drive + Dropbox' : 'Offline mode active'}</small>
        </div>
      </div>
    </section>
  )
}
