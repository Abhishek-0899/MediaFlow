import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StatCard } from './StatCard'
import { Toggle } from './Toggle'

describe('StatCard', () => {
  it('renders its label, value, hint, and accent state', () => {
    const { container } = render(<StatCard label="Total files" value="12" hint="Ready" accent />)

    expect(screen.getByText('Total files')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('accent')
  })
})

describe('Toggle', () => {
  it('renders enabled state and forwards clicks', () => {
    const onToggle = vi.fn()
    render(<Toggle enabled label="Cloud storage sync" onToggle={onToggle} />)
    const button = screen.getByRole('button')

    expect(screen.getByText('Cloud storage sync')).toBeInTheDocument()
    expect(button).toHaveClass('on')

    fireEvent.click(button)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
