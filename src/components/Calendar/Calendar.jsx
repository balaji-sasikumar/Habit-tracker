import { useState } from 'react'
import { isSameDay, isFutureDay, isCompletedOnDate } from '../../utils/date'
import styles from './Calendar.module.css'

const DAYS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

/**
 * Returns: 'all' | 'partial' | 'missed' | 'future' | 'none'
 */
function getDayStatus(date, habits, today) {
  if (!habits.length) return 'none'
  if (isFutureDay(date, today)) return 'future'

  const completed = habits.filter(h => isCompletedOnDate(h, date)).length
  const total     = habits.length

  if (completed === total) return 'all'
  if (completed  >  0)    return 'partial'
  return 'missed'
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

function getMonthCells(anchor) {
  const year      = anchor.getFullYear()
  const month     = anchor.getMonth()
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMo  = new Date(year, month + 1, 0).getDate()
  const cells     = []
  for (let i = 0; i < firstDay; i++)       cells.push(null)
  for (let d = 1; d <= daysInMo; d++)      cells.push(new Date(year, month, d))
  return cells
}

/* ── Component ────────────────────────────────────────── */
export default function Calendar({ habits, selectedDate, onSelectDate }) {
  const [view,   setView]   = useState('week')
  const [anchor, setAnchor] = useState(new Date())
  const today = new Date()

  function prev() {
    const d = new Date(anchor)
    view === 'week' ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1)
    setAnchor(d)
  }
  function next() {
    const d = new Date(anchor)
    view === 'week' ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1)
    setAnchor(d)
  }

  const renderDay = (d, key) => {
    if (!d) return <div key={key} />
    const isToday    = isSameDay(d, today)
    const isSelected = selectedDate && isSameDay(d, selectedDate)
    const status     = getDayStatus(d, habits, today)

    return (
      <button
        key={key}
        className={styles.dayBtn}
        onClick={() => onSelectDate(d)}
      >
        {/* Number circle */}
        <span className={[
          styles.num,
          isToday    ? styles.numToday    : '',
          isSelected && !isToday ? styles.numSelected : '',
        ].join(' ')}>
          {d.getDate()}
        </span>

        {/* Status dot — hidden for future / no data */}
        <span className={[
          styles.dot,
          status === 'all'     ? styles.dotAll     : '',
          status === 'partial' ? styles.dotPartial : '',
          status === 'missed'  ? styles.dotMissed  : '',
          // invisible placeholder keeps layout stable
          (status === 'future' || status === 'none') ? styles.dotHidden : '',
        ].join(' ')} />
      </button>
    )
  }

  const weekDays   = getWeekDays(anchor)
  const monthCells = getMonthCells(anchor)

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.monthLabel}>
          {MONTHS[anchor.getMonth()]} {anchor.getFullYear()}
        </span>
        <div className={styles.controls}>
          <button onClick={prev} className={styles.navBtn} aria-label="Previous">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
              <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={next} className={styles.navBtn} aria-label="Next">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
              <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={styles.toggle}>
            <button className={view === 'week'  ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('week')}>Week</button>
            <button className={view === 'month' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('month')}>Month</button>
          </div>
        </div>
      </div>

      {/* Day-name row */}
      <div className={styles.dayNames}>
        {DAYS.map(d => <span key={d} className={styles.dayName}>{d}</span>)}
      </div>

      {/* Grid */}
      {view === 'week'
        ? <div className={styles.weekGrid}>{weekDays.map((d, i)   => renderDay(d, i))}</div>
        : <div className={styles.monthGrid}>{monthCells.map((d, i) => renderDay(d, i))}</div>
      }

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotAll}`} />All done</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotPartial}`} />Partial</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotMissed}`} />Missed</span>
      </div>
    </div>
  )
}
