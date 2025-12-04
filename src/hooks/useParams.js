import { useMemo } from 'react'

// Minimal useParams replacement without react-router: parses /topic/:id
export const useParams = () => {
  const params = useMemo(() => {
    const path = window.location.pathname || ''
    const match = path.match(/\/topic\/(\d+)/)
    return match ? { id: match[1] } : {}
  }, [window.location.pathname])
  return params
}

