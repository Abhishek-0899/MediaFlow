import type { MediaGroup } from '../../types/media'

type MediaGroupsProps = {
  groups: MediaGroup[]
}

export function MediaGroups({ groups }: MediaGroupsProps) {
  if (!groups.length) {
    return (
      <div className="panel-card">
        <div className="panel-header compact">
          <div>
            <p className="card-label">Organized groups</p>
            <h3>No media grouped yet</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-card">
      <div className="panel-header compact">
        <div>
          <p className="card-label">Organized groups</p>
          <h3>Review by date</h3>
        </div>
      </div>

      <div className="group-collection">
        {groups.map((group) => (
          <div key={group.id} className="media-group-card">
            <div className="group-heading">
              <strong>{group.label}</strong>
              <span>{group.items.length} items</span>
            </div>
            <div className="group-meta">
              <span>{group.photos} photos</span>
              <span>{group.videos} videos</span>
            </div>
            <div className="group-tag-list">
              {group.items.slice(0, 4).map((item) => (
                <span key={item.id} className="group-tag">{item.name}</span>
              ))}
              {group.items.length > 4 && <span className="group-tag muted">+{group.items.length - 4} more</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
