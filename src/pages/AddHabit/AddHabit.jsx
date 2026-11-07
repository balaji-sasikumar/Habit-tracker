import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './AddHabit.module.css'

const ICONS = [
  { emoji: '💧', label: 'Water',    color: '#D0EEFF' },
  { emoji: '🏃', label: 'Run',      color: '#D0FFE8' },
  { emoji: '🧘', label: 'Meditate', color: '#E8D0FF' },
  { emoji: '📚', label: 'Read',     color: '#FFE8D0' },
  { emoji: '🥗', label: 'Eat',      color: '#D6FFD0' },
  { emoji: '😴', label: 'Sleep',    color: '#D0D8FF' },
  { emoji: '🏋️', label: 'Workout',  color: '#FFD0D0' },
  { emoji: '✍️', label: 'Journal',  color: '#FFF5D0' },
  { emoji: '🎸', label: 'Practice', color: '#FFD0F0' },
  { emoji: '🧹', label: 'Clean',    color: '#D0FFF5' },
  { emoji: '🌿', label: 'Nature',   color: '#D6FFD0' },
  { emoji: '☕', label: 'Morning',  color: '#FFE5D0' },
  { emoji: '🚴', label: 'Cycle',    color: '#D0FFEE' },
  { emoji: '🎯', label: 'Focus',    color: '#FFD0D0' },
  { emoji: '🧠', label: 'Learn',    color: '#D0E8FF' },
  { emoji: '💪', label: 'Strength', color: '#FFE5D0' },
  { emoji: '🫁', label: 'Breathe',  color: '#D0F0FF' },
  { emoji: '🌅', label: 'Early',    color: '#FFF0D0' },
  { emoji: '📵', label: 'No phone', color: '#F5D0FF' },
  { emoji: '💊', label: 'Medicine', color: '#D0FFE0' },
]

const DEFAULT_ICON = { emoji: '⭐', color: '#FFE5D0' }

function autoMatchIcon(text) {
  const lower = text.toLowerCase()
  for (const item of ICONS) {
    if (lower.includes(item.label.toLowerCase())) return item
  }
  if (lower.includes('water') || lower.includes('drink') || lower.includes('hydrate')) return ICONS[0]
  if (lower.includes('run') || lower.includes('jog') || lower.includes('walk') || lower.includes('step')) return ICONS[1]
  if (lower.includes('meditat') || lower.includes('yoga') || lower.includes('calm')) return ICONS[2]
  if (lower.includes('book') || lower.includes('read') || lower.includes('study')) return ICONS[3]
  if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('salad')) return ICONS[4]
  if (lower.includes('sleep') || lower.includes('bed') || lower.includes('nap')) return ICONS[5]
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('lift') || lower.includes('pushup')) return ICONS[6]
  return null
}

export default function AddHabit({ habitStore }) {
  const { id } = useParams()
  const { addHabit, updateHabit, deleteHabit, habits } = habitStore
  const navigate = useNavigate()

  const existing = id ? habits.find(h => h.id === id) : null
  const isEdit = !!existing

  const [name, setName] = useState(existing?.name || '')
  const [selected, setSelected] = useState(() => {
    if (!existing) return null
    return ICONS.find(i => i.emoji === existing.icon) || null
  })
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef(null)
  const speechSupported = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  function toggleListening() {
    if (!speechSupported) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError('')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (transcript) {
        const clean = transcript.trim()
        const formatted = clean.charAt(0).toUpperCase() + clean.slice(1)
        setName(formatted)
        setError('')

        // Auto-match icon if not already picked
        const matched = autoMatchIcon(clean)
        if (matched) {
          setSelected(matched)
        }
      }
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  function handleSave() {
    if (!name.trim()) { setError('Please enter a habit name'); return }
    const icon  = selected ? selected.emoji : DEFAULT_ICON.emoji
    const color = selected ? selected.color : DEFAULT_ICON.color
    if (isEdit) {
      updateHabit(id, { name: name.trim(), icon, color })
    } else {
      addHabit(name.trim(), icon, color)
    }
    navigate('/')
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    deleteHabit(id)
    navigate('/')
  }

  const previewEmoji = selected ? selected.emoji : (existing?.icon || '📋')

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
            <path d="M8 1.5L2 7.5L8 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>{isEdit ? 'Edit Habit' : 'New Habit'}</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Hero emoji preview */}
      <div className={styles.hero}>
        <span className={styles.heroEmoji}>{previewEmoji}</span>
      </div>

      {/* Name input with integrated Speech-to-Text Mic */}
      <div className={styles.field}>
        <label className={styles.label}>Name your habit</label>
        <div className={styles.inputWrapper}>
          <input
            className={`${styles.input} ${error ? styles.inputError : ''} ${isListening ? styles.inputListening : ''}`}
            type="text"
            placeholder={isListening ? '🎙️ Listening... Speak now' : 'e.g. Drink a glass of water'}
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            maxLength={60}
            autoFocus
          />
          {speechSupported && (
            <button
              type="button"
              className={`${styles.micBtn} ${isListening ? styles.micBtnListening : ''}`}
              onClick={toggleListening}
              aria-label={isListening ? 'Stop listening' : 'Voice input'}
              title={isListening ? 'Listening...' : 'Voice typing'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>

      {/* Icon picker */}
      <div className={styles.field}>
        <label className={styles.label}>
          Pick an icon
          <span className={styles.labelHint}> — defaults to ⭐</span>
        </label>
        <div className={styles.iconGrid}>
          {ICONS.map(item => (
            <button
              key={item.emoji}
              className={`${styles.iconBtn} ${selected?.emoji === item.emoji ? styles.iconBtnActive : ''}`}
              style={{ background: item.color }}
              onClick={() => setSelected(selected?.emoji === item.emoji ? null : item)}
              title={item.label}
            >
              <span className={styles.iconEmoji}>{item.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button className={styles.saveBtn} onClick={handleSave}>
        {isEdit ? 'Save Changes' : 'Save Habit'}
      </button>

      {/* Delete — only on edit mode */}
      {isEdit && (
        <button
          className={`${styles.deleteBtn} ${confirmDelete ? styles.deleteBtnConfirm : ''}`}
          onClick={handleDelete}
        >
          {confirmDelete ? '⚠️ Tap again to confirm delete' : '🗑  Delete Habit'}
        </button>
      )}
    </div>
  )
}
