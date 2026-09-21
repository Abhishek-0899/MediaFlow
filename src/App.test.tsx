import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the initial library and organized date groups', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Organize your media library' })).toBeInTheDocument()
    expect(screen.getAllByText('beach-sunset.jpg').length).toBeGreaterThan(0)
    expect(screen.getByText('September 12, 2026')).toBeInTheDocument()
    expect(screen.getByText('Storage used')).toBeInTheDocument()
  })

  it('filters media through the gallery search', () => {
    render(<App />)
    const search = screen.getByPlaceholderText('Search media or location')

    fireEvent.change(search, { target: { value: 'Tokyo' } })

    expect(screen.getAllByText('city-walkthrough.mov').length).toBeGreaterThan(0)
    expect(document.querySelector('.media-grid')?.textContent).toContain('city-walkthrough.mov')
    expect(document.querySelector('.media-grid')?.textContent).not.toContain('beach-sunset.jpg')
  })

  it('deletes the initially selected items from the library', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }))

    expect(screen.queryByText('beach-sunset.jpg')).not.toBeInTheDocument()
    expect(screen.queryByText('lake-ride.mp4')).not.toBeInTheDocument()
    expect(screen.queryByText('family-reunion.png')).not.toBeInTheDocument()
    expect(screen.getAllByText('studio-session.jpg').length).toBeGreaterThan(0)
  })
})
