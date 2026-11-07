import { useState } from 'react'
import { saveUser, savePin } from '../../utils/storage'
import PinPad from '../PinPad/PinPad'
import styles from './Onboarding.module.css'

// Step 1 — enter name
function StepName({ onNext }) {
  const [name, setName] = useState('')

  return (
    <div className={styles.step}>
      <div className={styles.hero}>
        <span className={styles.emoji}>🌱</span>
        <h1 className={styles.title}>Welcome to<br />Habit Tracker</h1>
        <p className={styles.sub}>Build streaks. Stay consistent.<br />One habit at a time.</p>
      </div>

      <div className={styles.form}>
        <label className={styles.label}>What should we call you?</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onNext(name.trim())}
          maxLength={30}
          autoFocus
        />
        <button
          className={`${styles.btn} ${!name.trim() ? styles.btnDisabled : ''}`}
          onClick={() => name.trim() && onNext(name.trim())}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// Step 2 — create PIN
function StepCreatePin({ onNext }) {
  const [pin, setPin] = useState('')

  return (
    <div className={styles.step}>
      <div className={styles.hero}>
        <span className={styles.emoji}>🔐</span>
        <h1 className={styles.title}>Create a PIN</h1>
        <p className={styles.sub}>Choose a 4-digit PIN to protect<br />your habit data.</p>
      </div>

      <PinPad
        value={pin}
        onChange={setPin}
        onComplete={onNext}
        label="Enter 4 digits"
      />
    </div>
  )
}

// Step 3 — confirm PIN
function StepConfirmPin({ firstPin, onConfirmed, onBack }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function handleComplete(entered) {
    if (entered === firstPin) {
      onConfirmed()
    } else {
      setError(true)
      setTimeout(() => { setPin(''); setError(false) }, 500)
    }
  }

  function handleChange(val) {
    if (!error) setPin(val)
  }

  return (
    <div className={styles.step}>
      <div className={styles.hero}>
        <span className={styles.emoji}>✅</span>
        <h1 className={styles.title}>Confirm PIN</h1>
        <p className={styles.sub}>Re-enter your PIN to confirm.</p>
      </div>

      <PinPad
        value={pin}
        onChange={handleChange}
        onComplete={handleComplete}
        error={error}
        label={error ? 'PINs don\'t match — try again' : 'Confirm your PIN'}
      />

      <button className={styles.backLink} onClick={onBack}>← Change PIN</button>
    </div>
  )
}

// Orchestrator
export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(1) // 1=name, 2=create pin, 3=confirm pin
  const [name, setName] = useState('')
  const [firstPin, setFirstPin] = useState('')

  function handleName(n) {
    setName(n)
    setStep(2)
  }

  function handleFirstPin(p) {
    setFirstPin(p)
    setStep(3)
  }

  function handleConfirmed() {
    saveUser({ name })
    savePin(firstPin)
    onDone()
  }

  return (
    <div className={styles.page}>
      {/* Step indicator */}
      <div className={styles.stepIndicator}>
        {[1, 2, 3].map(s => (
          <div key={s} className={`${styles.stepDot} ${s <= step ? styles.stepDotActive : ''}`} />
        ))}
      </div>

      {step === 1 && <StepName onNext={handleName} />}
      {step === 2 && <StepCreatePin onNext={handleFirstPin} />}
      {step === 3 && (
        <StepConfirmPin
          firstPin={firstPin}
          onConfirmed={handleConfirmed}
          onBack={() => { setFirstPin(''); setStep(2) }}
        />
      )}
    </div>
  )
}
