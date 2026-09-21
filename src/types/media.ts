export type MediaType = 'photo' | 'video' | 'audio' | 'document'

export interface MediaItem {
  id: number
  name: string
  type: MediaType
  size: string
  fileSizeBytes: number
  date: string
  time: string
  location: string
  width?: number
  height?: number
  duration?: string
  folder: string
  tags: string[]
  duplicate: boolean
  previewUrl?: string
  metadataSource?: 'file' | 'fallback'
}

export interface MediaGroup {
  id: string
  label: string
  items: MediaItem[]
  photos: number
  videos: number
}

export interface ProcessingError {
  fileName: string
  message: string
}

export interface ProcessingResult {
  items: MediaItem[]
  errors: ProcessingError[]
}
