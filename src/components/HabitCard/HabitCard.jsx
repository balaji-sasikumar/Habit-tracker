import { useNavigate } from 'react-router-dom'
import styles from './HabitCard.module.css'

export default function HabitCard({ habit, completedOnDate, onToggle, readOnly, isFuture }) {
  const navigate = useNavigate()

  return (
    <div className={styles.row} onClick={() => navigate(`/edit/${habit.id}`)}>
      {/* Radio — stop propagation so card click doesn't fire when toggling */}
      <button
        className={[
          styles.radio,
          completedOnDate && !isFuture ? styles.radioDone : '',
          readOnly || isFuture ? styles.radioReadOnly : '',
        ].join(' ')}
        onClick={e => {
          e.stopPropagation()
          if (!readOnly && !isFuture) onToggle(habit.id)
        }}
        disabled={readOnly || isFuture}
        aria-label="Toggle habit"
      >
        {completedOnDate && !isFuture && <span className={styles.check}>✓</span>}
      </button>

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

        {/* Past date: Done / Missed pill — not for future */}
        {readOnly && !isFuture && (
          <span className={`${styles.pill} ${completedOnDate ? styles.pillDone : styles.pillMissed}`}>
            {completedOnDate ? 'Done' : 'Missed'}
          </span>
        )}

        {/* Chevron — always show to hint tap-to-edit */}
        <span className={styles.chevron}>›</span>
      </div>
    </div>
  )
}
