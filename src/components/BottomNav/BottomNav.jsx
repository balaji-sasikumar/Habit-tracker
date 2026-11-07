import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.link}>
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Home</span>
      </NavLink>
      <NavLink to="/add" className={({ isActive }) => isActive ? `${styles.addBtn} ${styles.addBtnActive}` : styles.addBtn}>
        <span className={styles.plus}>+</span>
      </NavLink>
      <div className={styles.link} style={{ opacity: 0.3, pointerEvents: 'none' }}>
        <span className={styles.icon}>📊</span>
        <span className={styles.label}>Stats</span>
      </div>
    </nav>
  )
}

