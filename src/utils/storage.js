// Thin storage wrapper — swap localStorage calls here when API is ready
const HABITS_KEY = 'habit_tracker_habits'
const USER_KEY = 'habit_tracker_user'
const PIN_KEY = 'habit_tracker_pin'

export function getHabits() {
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY)) || []
  } catch {
    return []
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || { name: 'You' }
  } catch {
    return { name: 'You' }
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getPin() {
  return localStorage.getItem(PIN_KEY) || null
}

export function savePin(pin) {
  localStorage.setItem(PIN_KEY, pin)
}

export function hasPin() {
  return !!localStorage.getItem(PIN_KEY)
}
