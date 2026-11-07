import { useNavigate } from 'react-router-dom'
import styles from './HabitCard.module.css'

export default function HabitCard({ habit, completedOnDate, onToggle, readOnly, isFuture }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (!readOnly && !isFuture) {
      onToggle(habit.id)
    } else {
      // On past/future dates where toggling is disabled, tap opens edit
      navigate(`/edit/${habit.id}`)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    navigate(`/edit/${habit.id}`)
  }

  return (
    <div
      className={styles.row}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Toggle ${habit.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Radio indicator */}
      <div
        className={[
          styles.radio,
          completedOnDate && !isFuture ? styles.radioDone : '',
          readOnly || isFuture ? styles.radioReadOnly : '',
        ].join(' ')}
      >
        {completedOnDate && !isFuture && <span className={styles.check}>✓</span>}
      </div>

      {/* Card body */}
      <div className={`${styles.card} ${completedOnDate && !isFuture ? styles.cardDone : ''}`}>
        <div className={styles.iconBox} style={{ background: habit.color }}>
          <span className={styles.iconEmoji}>{habit.icon}</span>
        </div>

        <div className={styles.info}>
          <span className={`${styles.name} ${completedOnDate && !isFuture ? styles.strikethrough : ''}`}>
            {habit.name}
          </span>
          {habit.streak > 0 && !isFuture && (
            <span className={styles.streak}>🔥 {habit.streak} day streak</span>
          )}
        </div>

        {/* Past date: Done / Missed pill */}
        {readOnly && !isFuture && (
          <span className={`${styles.pill} ${completedOnDate ? styles.pillDone : styles.pillMissed}`}>
            {completedOnDate ? 'Done' : 'Missed'}
          </span>
        )}

        {/* Dedicated Edit button on the right */}
        <button
          className={styles.editBtn}
          onClick={handleEditClick}
          aria-label={`Edit ${habit.name}`}
          title="Edit habit"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
