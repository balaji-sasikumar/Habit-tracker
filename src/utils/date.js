export function formatDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function isSameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isFutureDay(d, today = new Date()) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return a > b
}

export function isCompletedOnDate(habit, date) {
  if (!habit || !habit.completions) return false
  const key = formatDateKey(date)
  if (habit.completions[key]) return true
  
  // Support legacy UTC key if date matches today
  const today = new Date()
  if (isSameDay(date, today)) {
    const utcKey = date.toISOString().slice(0, 10)
    if (habit.completions[utcKey]) return true
  }
  return false
}
