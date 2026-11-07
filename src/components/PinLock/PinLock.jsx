import { useState, useCallback } from 'react'
import { getPin } from '../../utils/storage'
import PinPad from '../PinPad/PinPad'
import styles from './PinLock.module.css'

export default function PinLock({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleComplete = useCallback((entered) => {
    const correct = getPin()
    if (entered === correct) {
      onUnlock()
    } else {
      setError(true)
      // Reset after shake animation
      setTimeout(() => {
        setPin('')
        setError(false)
      }, 500)
    }
  }, [onUnlock])

  function handleChange(val) {
    if (!error) setPin(val)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <div className={styles.lockIcon}>🔒</div>
        <h1 className={styles.title}>Habit Tracker</h1>
        <p className={styles.sub}>Enter your PIN to continue</p>
      </div>

      <PinPad
        value={pin}
        onChange={handleChange}
        onComplete={handleComplete}
        error={error}
      />

      {error && <p className={styles.errorMsg}>Incorrect PIN. Try again.</p>}
    </div>
  )
}
