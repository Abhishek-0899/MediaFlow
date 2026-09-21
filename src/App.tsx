
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import JSZip from 'jszip'
import './App.css'
import { StatCard } from './components/common/StatCard'
import { MediaControls } from './components/media/MediaControls'
import { MediaDetails } from './components/media/MediaDetails'
import { MediaGallery } from './components/media/MediaGallery'
import { MediaGroups } from './components/media/MediaGroups'
import { folderPatterns, initialMedia } from './data/mockMedia'
import type { MediaItem, MediaType } from './types/media'
import { buildFolderName, formatBytes, getDuplicateIds, getFileTypeFromName, groupMediaByDate } from './utils/media'

function App() {
  const [items, setItems] = useState<MediaItem[]>(initialMedia)
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3])
  const [filterType, setFilterType] = useState<'all' | MediaType>('all')
  const [search, setSearch] = useState('')
  const [folderPattern, setFolderPattern] = useState('YYYY/MM/DD')
  const [bulkLocation, setBulkLocation] = useState('Paris, France')
  const [bulkDate, setBulkDate] = useState('2026-09-18')
  const [bulkTags, setBulkTags] = useState('travel, archive')
  const [aiGrouping, setAiGrouping] = useState(true)
  const [cloudSync, setCloudSync] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [activeId, setActiveId] = useState<number>(1)

  const duplicateIdSet = useMemo(() => getDuplicateIds(items), [items])

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [items, filterType, search])

  const activeItem = items.find((item) => item.id === activeId) ?? visibleItems[0] ?? items[0]
  const mediaGroups = useMemo(() => groupMediaByDate(items), [items])

  const totalSize = items.reduce((sum, item) => sum + item.fileSizeBytes, 0)
  const totalStorageBytes = 8 * 1024 * 1024 * 1024 * 1024
  const availableStorageBytes = Math.max(totalStorageBytes - totalSize, 0)
  const storageUsedPercent = Math.min((totalSize / totalStorageBytes) * 100, 100)

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [items])

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }

  const selectAllVisible = () => {
    const next = visibleItems.map((item) => item.id)
    setSelectedIds(next)
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const nextItems: MediaItem[] = files.map((file, index) => {
      const type = getFileTypeFromName(file.name)
      const now = new Date(file.lastModified || Date.now())
      const date = now.toISOString().slice(0, 10)
      const time = now.toTimeString().slice(0, 5)
      const size = formatBytes(file.size)
      const width = type === 'photo' ? 3200 + (index % 5) * 400 : 1920 + (index % 4) * 180
      const height = type === 'photo' ? 2400 + (index % 3) * 300 : 1080 + (index % 3) * 180
      const duration = type === 'video' || type === 'audio' ? '00:01:24' : undefined
      const locations = ['Bali, Indonesia', 'Tokyo, Japan', 'Paris, France', 'Seoul, South Korea', 'Lisbon, Portugal']

      const previewUrl = URL.createObjectURL(file)

      return {
        id: Date.now() + index + Math.random(),
        name: file.name,
        type,
        size,
        fileSizeBytes: file.size,
        date,
        time,
        location: locations[index % locations.length],
        width,
        height,
        duration,
        folder: buildFolderName(date, folderPattern),
        tags: [type, 'recent', 'untagged'],
        duplicate: false,
        previewUrl,
      }
    })

    setItems((current) => [...nextItems, ...current])
    setSelectedIds((current) => [...nextItems.map((item) => item.id), ...current])
    setActiveId(nextItems[0].id)
    event.target.value = ''
  }

  const applyBulkChanges = () => {
    if (!selectedIds.length) return

    setItems((current) =>
      current.map((item) => {
        if (!selectedIds.includes(item.id)) return item

        const nextTags = Array.from(
          new Set([...item.tags, ...bulkTags.split(',').map((tag) => tag.trim()).filter(Boolean)]),
        )

        return {
          ...item,
          date: bulkDate || item.date,
          location: bulkLocation || item.location,
          folder: buildFolderName(bulkDate || item.date, folderPattern),
          tags: nextTags,
        }
      }),
    )
  }

  const removeDuplicateItems = () => {
    setItems((current) => current.filter((item) => !duplicateIdSet.has(item.id)))
    setSelectedIds((current) => current.filter((id) => !duplicateIdSet.has(id)))
  }

  const deleteSelectedItems = () => {
    if (!selectedIds.length) return

    setItems((current) => current.filter((item) => !selectedIds.includes(item.id)))
    setSelectedIds([])
  }

  const applyDateFolders = () => {
    setItems((current) => current.map((item) => ({ ...item, folder: buildFolderName(item.date, folderPattern) })))
  }

  const exportZip = async () => {
    setIsExporting(true)

    const zip = new JSZip()
    zip.file(
      'collection/manifest.json',
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          aiGrouping,
          cloudSync,
          items: items.map((item) => ({
            name: item.name,
            type: item.type,
            folder: item.folder,
            date: item.date,
            time: item.time,
            location: item.location,
            size: item.size,
            duration: item.duration,
            dimensions: item.width && item.height ? `${item.width}x${item.height}` : null,
            tags: item.tags,
          })),
        },
        null,
        2,
      ),
    )

    zip.file('collection/README.txt', 'This archive was generated by the Media Organizer app.')

    items.forEach((item) => {
      zip.file(`${item.folder}/${item.name}`, '')
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'organized-media-collection.zip'
    link.click()
    URL.revokeObjectURL(href)
    setIsExporting(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Suite</p>
            <h1>MediaFlow</h1>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active" type="button">Dashboard</button>
          <button className="nav-item" type="button">Library</button>
          <button className="nav-item" type="button">Collections</button>
          <button className="nav-item" type="button">AI Grouping</button>
          <button className="nav-item" type="button">Cloud Sync</button>
        </nav>

        <div className="sidebar-card">
          <p className="card-label">Storage</p>
          <strong>{formatBytes(totalStorageBytes)}</strong>
          <div className="progress-bar">
            <span style={{ width: `${storageUsedPercent}%` }} />
          </div>
          <small>{Math.round(storageUsedPercent)}% used • {formatBytes(availableStorageBytes)} free</small>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Photo & video optimizer</p>
            <h2>Organize your media library</h2>
          </div>

          <div className="actions">
            <label className="upload-button">
              <input type="file" multiple accept="image/*,video/*,audio/*" onChange={handleFileUpload} />
              Select media
            </label>
            <button className="primary-button" onClick={exportZip} disabled={isExporting} type="button">
              {isExporting ? 'Preparing ZIP...' : 'Export ZIP'}
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard label="Total files" value={String(items.length)} hint="+14 today" accent />
          <StatCard label="Unique photos" value={String(items.filter((item) => item.type === 'photo').length)} hint="Ready for review" />
          <StatCard label="Videos" value={String(items.filter((item) => item.type === 'video').length)} hint="2 long clips" />
          <StatCard label="Storage used" value={formatBytes(totalSize)} hint="Across all media" />
        </section>

        <section className="content-grid">
          <MediaGallery
            items={visibleItems}
            activeId={activeId}
            selectedIds={selectedIds}
            filterType={filterType}
            search={search}
            onSelectItem={setActiveId}
            onToggleSelect={toggleSelection}
            onFilterChange={setFilterType}
            onSearchChange={setSearch}
          />
          <MediaDetails activeItem={activeItem} />
        </section>

        <MediaGroups groups={mediaGroups} />

        <MediaControls
          bulkLocation={bulkLocation}
          bulkDate={bulkDate}
          bulkTags={bulkTags}
          folderPattern={folderPattern}
          folderPatterns={folderPatterns}
          onLocationChange={setBulkLocation}
          onDateChange={setBulkDate}
          onTagsChange={setBulkTags}
          onApplyBulk={applyBulkChanges}
          onRemoveDuplicates={removeDuplicateItems}
          onDeleteSelected={deleteSelectedItems}
          onSelectAllVisible={selectAllVisible}
          onFolderPatternChange={setFolderPattern}
          onApplyFolders={applyDateFolders}
          onToggleAiGrouping={() => setAiGrouping((value) => !value)}
          onToggleCloudSync={() => setCloudSync((value) => !value)}
          aiGrouping={aiGrouping}
          cloudSync={cloudSync}
        />
      </main>
    </div>
  )
}

export default App
