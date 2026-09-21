import type { MediaType } from '../types/media'

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB', 'TB', 'PB']
  let value = bytes / 1024
  let index = 0

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }

  return `${value.toFixed(1)} ${units[index]}`
}

export const buildFolderName = (date: string, pattern: string) => {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return 'Unsorted'

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')

  switch (pattern) {
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'YYYY/MM':
      return `${year}/${month}`
    case 'YYYY':
      return `${year}`
    default:
      return `${year}/${month}/${day}`
  }
}

export const getTypeLabel = (type: MediaType) => {
  switch (type) {
    case 'photo':
      return 'Photo'
    case 'video':
      return 'Video'
    case 'audio':
      return 'Audio'
    default:
      return 'Document'
  }
}

export const getFileTypeFromName = (name: string): MediaType => {
  const lowercase = name.toLowerCase()

  if (lowercase.endsWith('.mp4') || lowercase.endsWith('.mov') || lowercase.endsWith('.avi')) return 'video'
  if (lowercase.endsWith('.mp3') || lowercase.endsWith('.wav') || lowercase.endsWith('.aac')) return 'audio'
  if (lowercase.endsWith('.jpg') || lowercase.endsWith('.jpeg') || lowercase.endsWith('.png')) return 'photo'

  return 'document'
}
