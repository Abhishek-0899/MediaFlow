import type { MediaItem } from '../../types/media'
import { getTypeLabel } from '../../utils/media'

type MediaDetailsProps = {
  activeItem?: MediaItem
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

export function MediaDetails({ activeItem }: MediaDetailsProps) {
  if (!activeItem) {
    return (
      <aside className="details-panel panel-card">
        <div className="panel-header compact">
          <div>
            <p className="card-label">Selected item</p>
            <h3>No media selected</h3>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="details-panel panel-card">
      <div className="panel-header compact">
        <div>
          <p className="card-label">Selected item</p>
          <h3>{activeItem.name}</h3>
        </div>
      </div>

      {renderItemPreview(activeItem, true)}

      <div className="detail-list">
        <div><span>Type</span><strong>{getTypeLabel(activeItem.type)}</strong></div>
        <div><span>Date</span><strong>{activeItem.date}</strong></div>
        <div><span>Time</span><strong>{activeItem.time}</strong></div>
        <div><span>Location</span><strong>{activeItem.location}</strong></div>
        <div><span>Dimensions</span><strong>{activeItem.width && activeItem.height ? `${activeItem.width} × ${activeItem.height}` : 'N/A'}</strong></div>
        <div><span>Duration</span><strong>{activeItem.duration ?? '—'}</strong></div>
        <div><span>Folder</span><strong>{activeItem.folder}</strong></div>
      </div>

      <div className="tag-cloud">
        {activeItem.tags.map((tag) => (
          <span key={`${activeItem.id}-${tag}`} className="tag">#{tag}</span>
        ))}
      </div>
    </aside>
  )
}
