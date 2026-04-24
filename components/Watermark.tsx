'use client'

import { useEffect, useState } from 'react'

export function Watermark() {
  const [user, setUser] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('user_email') || 'GFX Academy'
    setUser(email)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          suppressHydrationWarning
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(-45deg)`,
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.1)',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {user}
        </div>
      ))}
    </div>
  )
}
