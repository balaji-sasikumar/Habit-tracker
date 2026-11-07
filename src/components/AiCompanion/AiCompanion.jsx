import { useState, useEffect } from 'react'
import { getAiCompanionMessage } from '../../utils/aiCompanion'
import styles from './AiCompanion.module.css'

export default function AiCompanion({ habits = null, compact = false }) {
  const [insight, setInsight] = useState(() => getAiCompanionMessage(habits))
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update whenever habits change or on periodic interval
  useEffect(() => {
    setInsight(getAiCompanionMessage(habits))
  }, [habits])

  const refreshInsight = (e) => {
    if (e) e.stopPropagation()
    setIsRefreshing(true)
    setTimeout(() => {
      setInsight(getAiCompanionMessage(habits))
      setIsRefreshing(false)
    }, 200)
  }

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.aura} />

      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <span className={styles.aiLabel}>✨ Habit AI</span>
        </div>
        {insight.tag && (
          <span className={styles.tag}>
            <span className={styles.tagEmoji}>{insight.emoji}</span>
            <span>{insight.tag}</span>
          </span>
        )}
      </div>

      <p className={`${styles.text} ${isRefreshing ? styles.fading : ''}`}>
        "{insight.text}"
      </p>
    </div>
  )
}
