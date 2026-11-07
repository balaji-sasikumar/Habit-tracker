import { useState, useEffect } from 'react'
import { getAiCompanionMessage } from '../../utils/aiCompanion'
import styles from './AiCompanion.module.css'

export default function AiCompanion({ habits = null }) {
  const [insight, setInsight] = useState(() => getAiCompanionMessage(habits))

  useEffect(() => {
    setInsight(getAiCompanionMessage(habits))
  }, [habits])

  return (
    <div className={styles.bubbleContainer}>
      <div className={styles.chatBubble}>
        <span className={styles.emoji}>{insight.emoji || '💬'}</span>
        <div className={styles.content}>
          <span className={styles.text}>{insight.text}</span>
        </div>
        <span className={styles.tail} />
      </div>
    </div>
  )
}
