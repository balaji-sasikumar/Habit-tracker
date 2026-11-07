import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getHabits, saveHabits } from '../utils/storage'
import { formatDateKey, isCompletedOnDate } from '../utils/date'

function todayKey() {
  return formatDateKey(new Date())
}

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10)
}

function calculateStreak(completions) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const local = formatDateKey(d)
    const utc = d.toISOString().slice(0, 10)
    if (completions[local] || completions[utc]) {
      streak++
    } else {
      break
    }
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
    const utc = todayKeyUTC()

    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h
        const completions = { ...h.completions }
        // If marked with either key, unmark both so state is clean
        if (completions[local] || completions[utc]) {
          delete completions[local]
          delete completions[utc]
        } else {
          // not marked → mark with local key
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
    completedToday: isCompletedOnDate(h, new Date()),
    streak: calculateStreak(h.completions || {}),
  }))

  return { habits: habitsWithMeta, addHabit, updateHabit, toggleCompletion, deleteHabit }
}
