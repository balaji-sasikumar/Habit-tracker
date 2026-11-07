import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getHabits, saveHabits } from '../utils/storage'

// Use local date — avoids UTC offset mismatch (e.g. IST midnight = prev day in UTC)
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// Legacy UTC key — needed to migrate / unmark entries stored before the timezone fix
function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10)
}

function calculateStreak(completions) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (completions[key]) streak++
    else break
  }
  return streak
}

export function useHabits() {
  const [habits, setHabits] = useState(() => getHabits())

  const addHabit = useCallback((name, icon, color) => {
    const newHabit = {
      id: uuidv4(),
      name,
      icon: icon || '⭐',
      color: color || '#FFE5D0',
      completions: {},
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => {
      const updated = [...prev, newHabit]
      saveHabits(updated)
      return updated
    })
    return newHabit
  }, [])

  const updateHabit = useCallback((id, changes) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, ...changes } : h)
      saveHabits(updated)
      return updated
    })
  }, [])

  const toggleCompletion = useCallback((id) => {
    const local = todayKey()
    const utc   = todayKeyUTC()

    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h
        const completions = { ...h.completions }
        if (completions[local]) {
          // marked with new local key → unmark
          delete completions[local]
        } else if (completions[utc]) {
          // marked with old UTC key → unmark (migration path)
          delete completions[utc]
        } else {
          // not marked → mark with local key going forward
          completions[local] = true
        }
        return { ...h, completions }
      })
      saveHabits(updated)
      return updated
    })
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id)
      saveHabits(updated)
      return updated
    })
  }, [])

  const habitsWithMeta = habits.map(h => ({
    ...h,
    // Check both local and legacy UTC key so old data still shows as checked
    completedToday: !!(h.completions[todayKey()] || h.completions[todayKeyUTC()]),
    streak: calculateStreak(h.completions),
  }))

  return { habits: habitsWithMeta, addHabit, updateHabit, toggleCompletion, deleteHabit }
}
