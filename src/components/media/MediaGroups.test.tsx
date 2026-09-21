import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { MediaGroup } from '../../types/media'
import { MediaGroups } from './MediaGroups'

const groups: MediaGroup[] = [
  {
    id: '2026-09-12',
    label: 'September 12, 2026',
    photos: 1,
    videos: 1,
    items: [
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
        tags: [],
        duplicate: false,
      },
      {
        id: 2,
        name: 'walkthrough.mp4',
        type: 'video',
        size: '10 MB',
        fileSizeBytes: 10_000_000,
        date: '2026-09-12',
        time: '10:00',
        location: 'Tokyo, Japan',
        folder: '2026/09/12',
        tags: [],
        duplicate: false,
      },
    ],
  },
]

describe('MediaGroups', () => {
  it('renders the empty state', () => {
    render(<MediaGroups groups={[]} />)

    expect(screen.getByText('No media grouped yet')).toBeInTheDocument()
  })

  it('renders group counts and item names', () => {
    render(<MediaGroups groups={groups} />)

    expect(screen.getByText('September 12, 2026')).toBeInTheDocument()
    expect(screen.getByText('2 items')).toBeInTheDocument()
    expect(screen.getByText('1 photos')).toBeInTheDocument()
    expect(screen.getByText('1 videos')).toBeInTheDocument()
    expect(screen.getByText('beach.jpg')).toBeInTheDocument()
    expect(screen.getByText('walkthrough.mp4')).toBeInTheDocument()
  })
})
