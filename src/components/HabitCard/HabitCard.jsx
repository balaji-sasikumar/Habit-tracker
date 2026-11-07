import styles from './HabitCard.module.css'

export default function HabitCard({ habit, completedOnDate, onToggle, onDelete, readOnly }) {
  return (
    <div className={styles.row}>
      {/* Radio */}
      <button
        className={`${styles.radio} ${completedOnDate ? styles.radioDone : ''} ${readOnly ? styles.radioReadOnly : ''}`}
        onClick={() => !readOnly && onToggle(habit.id)}
        disabled={readOnly}
        aria-label="Toggle habit"
      >
        {completedOnDate && <span className={styles.check}>✓</span>}
      </button>

      {/* Card body */}
      <div className={`${styles.card} ${completedOnDate ? styles.cardDone : ''}`}>
        <div className={styles.iconBox} style={{ background: habit.color }}>
          <span className={styles.iconEmoji}>{habit.icon}</span>
        </div>

        <div className={styles.info}>
          <span className={`${styles.name} ${completedOnDate ? styles.strikethrough : ''}`}>
            {habit.name}
          </span>
          {habit.streak > 0 && (
            <span className={styles.streak}>🔥 {habit.streak} day streak</span>
          )}
        </div>

        {!readOnly && (
          <button className={styles.deleteBtn} onClick={() => onDelete(habit.id)} aria-label="Delete">
            ×
          </button>
        )}

        {readOnly && (
          <span className={`${styles.pill} ${completedOnDate ? styles.pillDone : styles.pillMissed}`}>
            {completedOnDate ? 'Done' : 'Missed'}
          </span>
        )}
      </div>
    </div>
  )
}
