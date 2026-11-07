import { useState } from 'react'
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

      {/* Name input */}
      <div className={styles.field}>
        <label className={styles.label}>Name your habit</label>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="text"
          placeholder="e.g. Drink a glass of water"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          maxLength={60}
          autoFocus
        />
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
