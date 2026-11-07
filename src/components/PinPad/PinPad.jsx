import styles from './PinPad.module.css'

const NUMS = ['1','2','3','4','5','6','7','8','9']

export default function PinPad({ value = '', onChange, onComplete, maxLength = 4, error = false, label }) {
  function handleDigit(d) {
    if (value.length >= maxLength) return
    const next = value + d
    onChange(next)
    if (next.length === maxLength) onComplete?.(next)
  }

  function handleDel() {
    onChange(value.slice(0, -1))
  }

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}

      {/* 4 indicator dots */}
      <div className={`${styles.dots} ${error ? styles.shake : ''}`}>
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i < value.length ? (error ? styles.dotError : styles.dotFilled) : ''}`}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className={styles.grid}>
        {NUMS.map(n => (
          <button key={n} className={styles.numBtn} onClick={() => handleDigit(n)}>
            {n}
          </button>
        ))}
        {/* Row 4 */}
        <div />
        <button className={styles.numBtn} onClick={() => handleDigit('0')}>0</button>
        <button className={styles.delBtn} onClick={handleDel}>⌫</button>
      </div>
    </div>
  )
}
