import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/storage'
import Calendar from '../../components/Calendar/Calendar'
import HabitCard from '../../components/HabitCard/HabitCard'
import styles from './Home.module.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function toKey(d) {
  return d.toISOString().slice(0, 10)
}

function isSameDay(a, b) {
  return toKey(a) === toKey(b)
}

function formatSelectedDate(d, today) {
  if (isSameDay(d, today)) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (isSameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })
}

export default function Home({ habitStore }) {
  const { habits, toggleCompletion, deleteHabit } = habitStore
  const navigate = useNavigate()
  const user = getUser()
  const today = new Date()

  const [selectedDate, setSelectedDate] = useState(today)

  const selectedKey = toKey(selectedDate)
  const isToday = isSameDay(selectedDate, today)

  // For today: use live completedToday; for other dates: check completions map
  const habitsForDate = habits.map(h => ({
    ...h,
    completedOnDate: !!(h.completions && h.completions[selectedKey]),
  }))

  // Progress — only meaningful for today
  const completedCount = habitsForDate.filter(h => h.completedOnDate).length
  const totalCount = habits.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.greetingLine}>{getGreeting()},</p>
          <h1 className={styles.nameLine}>{user.name} 👋</h1>
          <p className={styles.date}>
            {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className={styles.avatar}>
          <span className={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        habits={habits}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Selected date label + progress */}
      {totalCount > 0 && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              {formatSelectedDate(selectedDate, today)}
              <span className={styles.progressSub}> · {completedCount}/{totalCount} done</span>
            </span>
            <span className={styles.progressPct}>{Math.round(progress)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Habit list */}
      <div className={styles.section}>
        {habits.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌱</span>
            <p className={styles.emptyTitle}>No habits yet</p>
            <p className={styles.emptyText}>Tap the + button to add your first habit!</p>
          </div>
        ) : (
          <div className={styles.list}>
            {habitsForDate.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completedOnDate={habit.completedOnDate}
                onToggle={toggleCompletion}
                onDelete={deleteHabit}
                readOnly={!isToday}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button className={styles.fab} onClick={() => navigate('/add')} aria-label="Add habit">
        <span className={styles.fabIcon}>+</span>
      </button>
    </div>
  )
}
