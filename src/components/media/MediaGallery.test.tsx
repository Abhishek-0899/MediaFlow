import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MediaItem } from '../../types/media'
import { MediaGallery } from './MediaGallery'

const items: MediaItem[] = [
  {
    id: 1,
    name: 'beach.jpg',
    type: 'photo',
    size: '2 MB',
    fileSizeBytes: 2_000_000,
    date: '2026-09-12',
    time: '18:42',
    location: 'Bali, Indonesia',
    folder: '2026/09/12',
    tags: ['travel'],
    duplicate: true,
  },
  {
    id: 2,
    name: 'walkthrough.mp4',
    type: 'video',
    size: '10 MB',
    fileSizeBytes: 10_000_000,
    date: '2026-09-11',
    time: '10:00',
    location: 'Tokyo, Japan',
    folder: '2026/09/11',
    tags: ['city'],
    duplicate: false,
  },
]

const renderGallery = () => {
  const onSelectItem = vi.fn()
  const onToggleSelect = vi.fn()
  const onFilterChange = vi.fn()
  const onSearchChange = vi.fn()

  render(
    <MediaGallery
      items={items}
      activeId={1}
      selectedIds={[2]}
      filterType="all"
      search=""
      onSelectItem={onSelectItem}
      onToggleSelect={onToggleSelect}
      onFilterChange={onFilterChange}
      onSearchChange={onSearchChange}
    />,
  )

  return { onSelectItem, onToggleSelect, onFilterChange, onSearchChange }
}

describe('MediaGallery', () => {
  it('renders media cards, active state, and duplicate badges', () => {
    renderGallery()

    expect(screen.getByText('beach.jpg')).toBeInTheDocument()
    expect(screen.getByText('walkthrough.mp4')).toBeInTheDocument()
    expect(screen.getByText('Duplicate')).toBeInTheDocument()
    expect(screen.getByText('Photo')).toBeInTheDocument()
    expect(screen.getByText('Video')).toBeInTheDocument()
    expect(screen.getByText('beach.jpg').closest('article')).toHaveClass('selected')
  })

  it('forwards search, filter, selection, and checkbox interactions', () => {
    const callbacks = renderGallery()
    const search = screen.getByPlaceholderText('Search media or location')
    const filter = screen.getByDisplayValue('All')

    fireEvent.change(search, { target: { value: 'Bali' } })
    fireEvent.change(filter, { target: { value: 'photo' } })
    fireEvent.click(screen.getByText('beach.jpg').closest('article') as HTMLElement)
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(callbacks.onSearchChange).toHaveBeenCalledWith('Bali')
    expect(callbacks.onFilterChange).toHaveBeenCalledWith('photo')
    expect(callbacks.onSelectItem).toHaveBeenCalledWith(1)
    expect(callbacks.onToggleSelect).toHaveBeenCalledWith(1)
  })
})
