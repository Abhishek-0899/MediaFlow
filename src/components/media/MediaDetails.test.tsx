import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { MediaItem } from '../../types/media'
import { MediaDetails } from './MediaDetails'

const item: MediaItem = {
  id: 1,
  name: 'beach.jpg',
  type: 'photo',
  size: '2 MB',
  fileSizeBytes: 2_000_000,
  date: '2026-09-12',
  time: '18:42',
  location: 'Bali, Indonesia',
  width: 4000,
  height: 3000,
  folder: '2026/09/12',
  tags: ['travel', 'sunset'],
  duplicate: false,
}

describe('MediaDetails', () => {
  it('renders an empty state when no item is active', () => {
    render(<MediaDetails />)

    expect(screen.getByText('No media selected')).toBeInTheDocument()
  })

  it('renders metadata, dimensions, folder, and tags for the active item', () => {
    render(<MediaDetails activeItem={item} />)

    expect(screen.getByRole('heading', { name: 'beach.jpg' })).toBeInTheDocument()
    expect(screen.getByText('Photo')).toBeInTheDocument()
    expect(screen.getByText('4000 × 3000')).toBeInTheDocument()
    expect(screen.getByText('2026/09/12')).toBeInTheDocument()
    expect(screen.getByText('#travel')).toBeInTheDocument()
    expect(screen.getByText('#sunset')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
