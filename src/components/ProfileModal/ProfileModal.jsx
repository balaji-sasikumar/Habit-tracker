import { useState } from 'react'
import { getUser, saveUser, getPin, savePin } from '../../utils/storage'
import PinPad from '../PinPad/PinPad'
import styles from './ProfileModal.module.css'

export default function ProfileModal({ onClose, onUserUpdated }) {
  const user = getUser()
  const [view, setView] = useState('main')   // main | name | pin-verify | pin-new | pin-confirm
  const [nameInput, setNameInput] = useState(user.name)
  const [pinInput, setPinInput] = useState('')
  const [newPin, setNewPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  /* ── Name ──────────────────────────────── */
  function saveName() {
    if (!nameInput.trim()) return
    saveUser({ name: nameInput.trim() })
    onUserUpdated?.()
    setSuccessMsg('Name updated!')
    setTimeout(() => { setSuccessMsg(''); setView('main') }, 1000)
  }

  /* ── PIN ───────────────────────────────── */
  function handleVerifyPin(entered) {
    if (entered === getPin()) {
      setPinInput('')
      setView('pin-new')
    } else {
      setPinError(true)
      setTimeout(() => { setPinInput(''); setPinError(false) }, 500)
    }
  }

  function handleNewPin(entered) {
    setNewPin(entered)
    setPinInput('')
    setView('pin-confirm')
  }

  function handleConfirmPin(entered) {
    if (entered === newPin) {
      savePin(newPin)
      setSuccessMsg('PIN updated!')
      setTimeout(() => { setSuccessMsg(''); setView('main') }, 1000)
    } else {
      setPinError(true)
      setTimeout(() => { setPinInput(''); setPinError(false) }, 500)
    }
  }

  function handlePinChange(val) {
    if (!pinError) setPinInput(val)
  }

  function goBack() {
    setPinInput(''); setPinError(false); setView('main')
  }

  /* ── Render ────────────────────────────── */
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />

        {/* Success banner */}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        {/* ── MAIN VIEW ── */}
        {view === 'main' && (
          <>
            <div className={styles.avatarBig}>
              <span className={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <p className={styles.userName}>{user.name}</p>

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => setView('name')}>
                <span className={styles.actionIcon}>✏️</span>
                <span>Change Name</span>
                <span className={styles.actionChevron}>›</span>
              </button>
              <div className={styles.divider} />
              <button className={styles.actionBtn} onClick={() => setView('pin-verify')}>
                <span className={styles.actionIcon}>🔐</span>
                <span>Change PIN</span>
                <span className={styles.actionChevron}>›</span>
              </button>
            </div>

            <button className={styles.closeBtn} onClick={onClose}>Close</button>
          </>
        )}

        {/* ── CHANGE NAME ── */}
        {view === 'name' && (
          <>
            <p className={styles.sheetTitle}>Change Name</p>
            <input
              className={styles.input}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              maxLength={30}
              placeholder="Your name"
            />
            <button className={styles.saveBtn} onClick={saveName}>Save</button>
            <button className={styles.backLink} onClick={goBack}>← Back</button>
          </>
        )}

        {/* ── VERIFY CURRENT PIN ── */}
        {view === 'pin-verify' && (
          <>
            <p className={styles.sheetTitle}>Enter current PIN</p>
            <PinPad
              value={pinInput}
              onChange={handlePinChange}
              onComplete={handleVerifyPin}
              error={pinError}
              label={pinError ? 'Incorrect PIN' : 'Verify identity'}
            />
            <button className={styles.backLink} onClick={goBack}>← Back</button>
          </>
        )}

        {/* ── NEW PIN ── */}
        {view === 'pin-new' && (
          <>
            <p className={styles.sheetTitle}>Enter new PIN</p>
            <PinPad
              value={pinInput}
              onChange={val => setPinInput(val)}
              onComplete={handleNewPin}
              label="Choose a 4-digit PIN"
            />
            <button className={styles.backLink} onClick={goBack}>← Back</button>
          </>
        )}

        {/* ── CONFIRM NEW PIN ── */}
        {view === 'pin-confirm' && (
          <>
            <p className={styles.sheetTitle}>Confirm new PIN</p>
            <PinPad
              value={pinInput}
              onChange={handlePinChange}
              onComplete={handleConfirmPin}
              error={pinError}
              label={pinError ? "PINs don't match" : 'Re-enter new PIN'}
            />
            <button className={styles.backLink} onClick={() => { setPinInput(''); setView('pin-new') }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
