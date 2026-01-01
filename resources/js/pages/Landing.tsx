import React from "react"
import { Head } from "@inertiajs/react"
import LandingPage from "@/components/LandingPage"
import { FullScreenToggle } from "@/components/fullscreen-toggle"

const Landing: React.FC = () => {
  return (
    <>
      <Head title="GPLaravel – Routing Sandbox" />
      
      {/* Wrap everything in a relative container */}
      <div className="relative min-h-screen">
        
        {/* Floating Fullscreen Button (Top Right) */}
        <div className="absolute top-4 right-4 z-50">
          <FullScreenToggle />
        </div>

        <LandingPage />
      </div>
    </>
  )
}

export default Landing