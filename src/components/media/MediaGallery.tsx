import type { MediaItem, MediaType } from '../../types/media'
import { getTypeLabel } from '../../utils/media'

type MediaGalleryProps = {
  items: MediaItem[]
  activeId: number
  selectedIds: number[]
  filterType: 'all' | MediaType
  search: string
  onSelectItem: (id: number) => void
  onToggleSelect: (id: number) => void
  onFilterChange: (value: 'all' | MediaType) => void
  onSearchChange: (value: string) => void
}

const renderItemPreview = (item: MediaItem, isLarge = false) => {
  if (item.type === 'photo' && item.previewUrl) {
    return <img src={item.previewUrl} alt={item.name} className={isLarge ? 'media-image large' : 'media-image'} />
  }

  if ((item.type === 'video' || item.type === 'audio') && item.previewUrl) {
    return (
      <video
        src={item.previewUrl}
        className={isLarge ? 'media-video large' : 'media-video'}
        controls={isLarge}
        muted
        playsInline
      />
    )
  }

  return (
    <div className={isLarge ? 'preview-large preview-type large' : 'media-preview preview-type'}>
      <span>{item.type === 'video' ? '▶' : item.type === 'audio' ? '♫' : '◉'}</span>
    </div>
  )
}

export function MediaGallery({
  items,
  activeId,
  selectedIds,
  filterType,
  search,
  onSelectItem,
  onToggleSelect,
  onFilterChange,
  onSearchChange,
}: MediaGalleryProps) {
  return (
    <div className="gallery-panel panel-card">
      <div className="panel-header">
        <div>
          <p className="card-label">Media library</p>
          <h3>Preview & filter</h3>
        </div>
        <div className="toolbar">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search media or location"
            className="search-input"
          />
          <select value={filterType} onChange={(event) => onFilterChange(event.target.value as 'all' | MediaType)}>
            <option value="all">All</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      <div className="media-grid">
        {items.map((item) => (
          <article
            key={item.id}
            className={`media-card ${activeId === item.id ? 'selected' : ''}`}
            onClick={() => onSelectItem(item.id)}
          >
            {renderItemPreview(item)}
            <div className="media-topline">
              <div className="checkbox-wrap" onClick={(event) => event.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                />
              </div>
              {item.duplicate && <span className="pill duplicate">Duplicate</span>}
            </div>
            <div className="media-body">
              <strong>{item.name}</strong>
              <small>
                {item.date} • {item.time}
              </small>
              <div className="meta-row">
                <span>{getTypeLabel(item.type)}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
