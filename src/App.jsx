import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useHabits } from './hooks/useHabits'
import { getPin } from './utils/storage'
import Home from './pages/Home/Home'
import AddHabit from './pages/AddHabit/AddHabit'
import Onboarding from './components/Onboarding/Onboarding'
import PinLock from './components/PinLock/PinLock'
import './App.css'

const IDLE_MS = 15_000

function isSetupDone() {
  try {
    const u = JSON.parse(localStorage.getItem('habit_tracker_user'))
    return !!(u?.name) && !!getPin()
  } catch {
    return false
  }
}

export default function App() {
  const habitStore = useHabits()
  const [setupDone, setSetupDone] = useState(() => isSetupDone())
  const [locked, setLocked] = useState(() => isSetupDone())
  const idleTimer = useRef(null)

  const startIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setLocked(true), IDLE_MS)
  }, [])

  useEffect(() => {
    if (!setupDone || locked) return
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, startIdleTimer, { passive: true }))
    startIdleTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, startIdleTimer))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [setupDone, locked, startIdleTimer])

  useEffect(() => {
    if (!setupDone) return
    let hiddenAt = null
    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now()
      } else {
        if (hiddenAt && Date.now() - hiddenAt >= IDLE_MS) setLocked(true)
        hiddenAt = null
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [setupDone])

  if (!setupDone) {
    return (
      <div className="app-shell" style={{ overflowY: 'auto' }}>
        <Onboarding onDone={() => { setSetupDone(true); setLocked(false) }} />
      </div>
    )
  }

  if (locked) {
    return <PinLock onUnlock={() => { setLocked(false); startIdleTimer() }} />
  }

  return (
    <div className="app-shell">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home habitStore={habitStore} />} />
          <Route path="/add" element={<AddHabit habitStore={habitStore} />} />
          <Route path="/edit/:id" element={<AddHabit habitStore={habitStore} />} />
        </Routes>
      </div>
    </div>
  )
}
