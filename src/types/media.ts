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
}
