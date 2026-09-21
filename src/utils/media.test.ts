import { describe, expect, it } from 'vitest'
import type { MediaItem } from '../types/media'
import {
  buildFolderName,
  formatBytes,
  getDisplayDate,
  getDuplicateIds,
  getFileTypeFromName,
  getTypeLabel,
  groupMediaByDate,
} from './media'

const createItem = (overrides: Partial<MediaItem> = {}): MediaItem => ({
  id: 1,
  name: 'photo.jpg',
  type: 'photo',
  size: '1 KB',
  fileSizeBytes: 1024,
  date: '2026-09-12',
  time: '12:00',
  location: 'Bali, Indonesia',
  folder: '2026/09/12',
  tags: [],
  duplicate: false,
  ...overrides,
})

describe('formatBytes', () => {
  it('formats bytes through terabytes', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 ** 2)).toBe('1.0 MB')
    expect(formatBytes(1024 ** 3)).toBe('1.0 GB')
    expect(formatBytes(1024 ** 4)).toBe('1.0 TB')
  })

  it('preserves small byte values', () => {
    expect(formatBytes(512)).toBe('512 B')
  })
})

describe('buildFolderName', () => {
  it('supports every configured folder pattern', () => {
    expect(buildFolderName('2026-09-12', 'YYYY/MM/DD')).toBe('2026/09/12')
    expect(buildFolderName('2026-09-12', 'YYYY-MM-DD')).toBe('2026-09-12')
    expect(buildFolderName('2026-09-12', 'YYYY/MM')).toBe('2026/09')
    expect(buildFolderName('2026-09-12', 'YYYY')).toBe('2026')
  })

  it('falls back for invalid dates and unknown patterns', () => {
    expect(buildFolderName('not-a-date', 'YYYY/MM/DD')).toBe('Unsorted')
    expect(buildFolderName('2026-09-12', 'unknown')).toBe('2026/09/12')
  })
})

describe('media labels and type detection', () => {
  it('detects supported file extensions case-insensitively', () => {
    expect(getFileTypeFromName('IMAGE.JPEG')).toBe('photo')
    expect(getFileTypeFromName('clip.MP4')).toBe('video')
    expect(getFileTypeFromName('voice.WAV')).toBe('audio')
    expect(getFileTypeFromName('notes.pdf')).toBe('document')
  })

  it('returns human-readable labels', () => {
    expect(getTypeLabel('photo')).toBe('Photo')
    expect(getTypeLabel('video')).toBe('Video')
    expect(getTypeLabel('audio')).toBe('Audio')
    expect(getTypeLabel('document')).toBe('Document')
  })
})

describe('getDisplayDate', () => {
  it('formats valid dates and handles missing metadata', () => {
    expect(getDisplayDate('2026-09-12')).toMatch(/September 12, 2026/)
    expect(getDisplayDate(undefined)).toBe('Date unavailable')
    expect(getDisplayDate('invalid')).toBe('Date unavailable')
  })
})

describe('getDuplicateIds', () => {
  it('finds matching names and sizes regardless of extension', () => {
    const items = [
      createItem({ id: 1, name: 'holiday.jpg', fileSizeBytes: 4096 }),
      createItem({ id: 2, name: 'holiday.png', fileSizeBytes: 4096 }),
      createItem({ id: 3, name: 'holiday.mp4', type: 'video', fileSizeBytes: 4096 }),
      createItem({ id: 4, name: 'different.jpg', fileSizeBytes: 4096 }),
    ]

    expect(getDuplicateIds(items)).toEqual(new Set([1, 2]))
  })

  it('does not mark unique files as duplicates', () => {
    expect(getDuplicateIds([createItem({ id: 1 }), createItem({ id: 2, name: 'other.jpg' })])).toEqual(new Set())
  })
})

describe('groupMediaByDate', () => {
  it('groups media, counts types, and sorts newest first', () => {
    const groups = groupMediaByDate([
      createItem({ id: 1, date: '2026-09-05', type: 'photo' }),
      createItem({ id: 2, date: '2026-09-12', type: 'video' }),
      createItem({ id: 3, date: '2026-09-12', type: 'photo' }),
    ])

    expect(groups.map((group) => group.id)).toEqual(['2026-09-12', '2026-09-05'])
    expect(groups[0]).toMatchObject({ photos: 1, videos: 1, label: 'September 12, 2026' })
    expect(groups[0].items.map((item) => item.id)).toEqual([2, 3])
  })

  it('places missing dates in a fallback group', () => {
    const [group] = groupMediaByDate([createItem({ date: '' })])

    expect(group).toMatchObject({ id: 'Date unavailable', label: 'Date unavailable' })
    expect(group.items).toHaveLength(1)
  })
})
