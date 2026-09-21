import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MediaControls } from './MediaControls'

const renderControls = () => {
  const callbacks = {
    onLocationChange: vi.fn(),
    onDateChange: vi.fn(),
    onTagsChange: vi.fn(),
    onApplyBulk: vi.fn(),
    onRemoveDuplicates: vi.fn(),
    onDeleteSelected: vi.fn(),
    onSelectAllVisible: vi.fn(),
    onFolderPatternChange: vi.fn(),
    onApplyFolders: vi.fn(),
    onToggleAiGrouping: vi.fn(),
    onToggleCloudSync: vi.fn(),
  }

  render(
    <MediaControls
      bulkLocation="Paris, France"
      bulkDate="2026-09-18"
      bulkTags="travel, archive"
      folderPattern="YYYY/MM/DD"
      folderPatterns={['YYYY/MM/DD', 'YYYY-MM-DD']}
      aiGrouping
      cloudSync
      {...callbacks}
    />,
  )

  return callbacks
}

describe('MediaControls', () => {
  it('forwards metadata field changes and bulk actions', () => {
    const callbacks = renderControls()

    fireEvent.change(screen.getByDisplayValue('Paris, France'), { target: { value: 'Tokyo, Japan' } })
    fireEvent.change(screen.getByDisplayValue('2026-09-18'), { target: { value: '2026-09-20' } })
    fireEvent.change(screen.getByDisplayValue('travel, archive'), { target: { value: 'city' } })
    fireEvent.click(screen.getByRole('button', { name: 'Select all visible' }))
    fireEvent.click(screen.getByRole('button', { name: 'Apply to selected' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove duplicates' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }))

    expect(callbacks.onLocationChange).toHaveBeenCalledWith('Tokyo, Japan')
    expect(callbacks.onDateChange).toHaveBeenCalledWith('2026-09-20')
    expect(callbacks.onTagsChange).toHaveBeenCalledWith('city')
    expect(callbacks.onSelectAllVisible).toHaveBeenCalledTimes(1)
    expect(callbacks.onApplyBulk).toHaveBeenCalledTimes(1)
    expect(callbacks.onRemoveDuplicates).toHaveBeenCalledTimes(1)
    expect(callbacks.onDeleteSelected).toHaveBeenCalledTimes(1)
  })

  it('forwards folder and automation controls', () => {
    const callbacks = renderControls()
    const pattern = screen.getByDisplayValue('YYYY/MM/DD')
    const toggles = screen.getAllByRole('button').filter((button) => button.classList.contains('toggle'))

    fireEvent.change(pattern, { target: { value: 'YYYY-MM-DD' } })
    fireEvent.click(screen.getByRole('button', { name: 'Apply folder structure' }))
    fireEvent.click(toggles[0])
    fireEvent.click(toggles[1])

    expect(callbacks.onFolderPatternChange).toHaveBeenCalledWith('YYYY-MM-DD')
    expect(callbacks.onApplyFolders).toHaveBeenCalledTimes(1)
    expect(callbacks.onToggleAiGrouping).toHaveBeenCalledTimes(1)
    expect(callbacks.onToggleCloudSync).toHaveBeenCalledTimes(1)
    expect(screen.getByText('AI clusters active')).toBeInTheDocument()
    expect(screen.getByText('Auto-sync enabled to Drive + Dropbox')).toBeInTheDocument()
  })
})
