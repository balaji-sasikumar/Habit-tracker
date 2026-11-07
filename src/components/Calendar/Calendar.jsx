import { useState } from 'react'
import styles from './Calendar.module.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function isSameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function dateKey(d) {
  return d ? d.toISOString().slice(0, 10) : ''
}

function getWeekDays(anchor) {
  const start = new Date(anchor)
  start.setDate(anchor.getDate() - anchor.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function getMonthDays(anchor) {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

export default function Calendar({ habits, selectedDate, onSelectDate }) {
  const [view, setView] = useState('week')
  const [anchor, setAnchor] = useState(new Date())
  const today = new Date()

  const hasCompleted = (date) => {
    if (!date || habits.length === 0) return false
    const key = dateKey(date)
    return habits.some(h => h.completions && h.completions[key])
  }

  function prevPeriod() {
    const d = new Date(anchor)
    if (view === 'week') d.setDate(d.getDate() - 7)
    else d.setMonth(d.getMonth() - 1)
    setAnchor(d)
  }

  function nextPeriod() {
    const d = new Date(anchor)
    if (view === 'week') d.setDate(d.getDate() + 7)
    else d.setMonth(d.getMonth() + 1)
    setAnchor(d)
  }

  const weekDays = getWeekDays(anchor)
  const monthCells = getMonthDays(anchor)

  const renderDay = (d, i) => {
    if (!d) return <div key={i} />
    const isToday = isSameDay(d, today)
    const isSelected = isSameDay(d, selectedDate)
    const done = hasCompleted(d)

    return (
      <button
        key={i}
        className={[
          styles.dayBtn,
          isToday ? styles.today : '',
          isSelected && !isToday ? styles.selected : '',
        ].join(' ')}
        onClick={() => onSelectDate(d)}
      >
        {d.getDate()}
        {done && <span className={styles.dot} />}
      </button>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.monthLabel}>
          {MONTHS[anchor.getMonth()]} {anchor.getFullYear()}
        </div>
        <div className={styles.controls}>
          <button onClick={prevPeriod} className={styles.navBtn}>‹</button>
          <button onClick={nextPeriod} className={styles.navBtn}>›</button>
          <div className={styles.toggle}>
            <button
              className={view === 'week' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setView('week')}
            >Week</button>
            <button
              className={view === 'month' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setView('month')}
            >Month</button>
          </div>
        </div>
      </div>

      {/* Day names row */}
      <div className={styles.dayNames}>
        {DAYS.map(d => <span key={d} className={styles.dayName}>{d}</span>)}
      </div>

      {view === 'week' ? (
        <div className={styles.weekRow}>
          {weekDays.map((d, i) => renderDay(d, i))}
        </div>
      ) : (
        <div className={styles.monthGrid}>
          {monthCells.map((d, i) => d ? renderDay(d, i) : <div key={i} />)}
        </div>
      )}
    </div>
  )
}
