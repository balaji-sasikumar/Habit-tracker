import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/storage'
import { isSameDay, isFutureDay, isCompletedOnDate } from '../../utils/date'
import Calendar from '../../components/Calendar/Calendar'
import HabitCard from '../../components/HabitCard/HabitCard'
import ProfileModal from '../../components/ProfileModal/ProfileModal'
import AiCompanion from '../../components/AiCompanion/AiCompanion'
import styles from './Home.module.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatSelectedDate(d, today) {
  if (isSameDay(d, today)) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (isSameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })
}

export default function Home({ habitStore }) {
  const { habits, toggleCompletion } = habitStore
  const navigate = useNavigate()
  const today = new Date()

  const [selectedDate, setSelectedDate] = useState(today)
  const [showProfile, setShowProfile] = useState(false)
  const [, forceRender] = useState(0)   // force re-render after name change

  const isToday = isSameDay(selectedDate, today)
  const isFutureDate = isFutureDay(selectedDate, today)

  const user = getUser()

  const habitsForDate = habits.map(h => ({
    ...h,
    completedOnDate: isCompletedOnDate(h, selectedDate),
  }))

  const completedCount = habitsForDate.filter(h => h.completedOnDate).length
  const totalCount = habits.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={styles.page}>
      {/* ── STICKY TOP ─────────────────────── */}
      <div className={styles.top}>
        <div className={styles.header}>
          <div>
            <p className={styles.greetingLine}>{getGreeting()},</p>
            <h1 className={styles.nameLine}>{user.name} 👋</h1>
            <p className={styles.date}>
              {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button className={styles.avatar} onClick={() => setShowProfile(true)} aria-label="Profile">
            <span className={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</span>
          </button>
        </div>

        <div className={styles.aiWrapper}>
          <AiCompanion habits={habits} />
        </div>

        <Calendar habits={habits} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

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
      </div>

      {/* ── SCROLLABLE HABIT LIST ──────────── */}
      <div className={styles.listArea}>
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
                readOnly={!isToday}
                isFuture={isFutureDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button className={styles.fab} onClick={() => navigate('/add')} aria-label="Add habit">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Profile modal */}
      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onUserUpdated={() => forceRender(n => n + 1)}
        />
      )}
    </div>
  )
}
