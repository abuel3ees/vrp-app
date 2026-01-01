import { Maximize, Minimize } from 'lucide-react' // or your icon set
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button' // assuming shadcn/ui button

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Sync React state with browser state (e.g. if user presses Esc)
  useEffect(() => {
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleFullScreen}
      title="Toggle Fullscreen"
    >
      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
    </Button>
  )
}