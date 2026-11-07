import { getHabits, getUser } from './storage'
import { isCompletedOnDate } from './date'

let lastMessageIndex = -1

export function getAiCompanionMessage(passedHabits = null) {
  const user = getUser()
  const name = user?.name && user.name !== 'You' ? user.name : 'friend'
  const habits = passedHabits || getHabits()

  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat

  const today = new Date()
  const total = habits.length
  const completed = habits.filter(h => isCompletedOnDate(h, today)).length
  const allDone = total > 0 && completed === total
  const noneDone = total > 0 && completed === 0

  let maxStreak = 0
  for (const h of habits) {
    if (h.streak && h.streak > maxStreak) maxStreak = h.streak
  }

  const pool = []

  // 1. Time-specific buckets
  if (hour >= 0 && hour < 5) {
    // 12:00 AM - 4:59 AM (Late Night)
    pool.push(
      { tag: 'Night Owl', emoji: '🌙', text: `Still up, ${name}? Habits can wait, your brain needs sleep.` },
      { tag: 'Sleep Mode', emoji: '😴', text: `Go to sleep! Tomorrow's streak is counting on you resting up.` },
      { tag: 'Late Night', emoji: '🦉', text: `Midnight hustle or scrolling? Drink some water and get to bed.` },
      { tag: 'Rest Check', emoji: '🛌', text: `The best habit right now is sleeping. Close your eyes, ${name}!` }
    )
  } else if (hour >= 5 && hour < 9) {
    // 5:00 AM - 8:59 AM (Early Morning)
    pool.push(
      { tag: 'Morning Kickoff', emoji: '🌅', text: `Rise and shine, ${name}! First order of business: a glass of water.` },
      { tag: 'Hydration', emoji: '💧', text: `Morning light is here. Drink some water to kickstart your brain.` },
      { tag: 'Fresh Start', emoji: '☕', text: `The world is quiet right now. Perfect time to set up a winning day.` },
      { tag: 'Daybreak', emoji: '🌱', text: `Every morning is a clean slate. Let's make today count!` }
    )
  } else if (hour >= 9 && hour < 14) {
    // 9:00 AM - 1:59 PM (Mid-day Focus)
    pool.push(
      { tag: 'Focus Zone', emoji: '🎯', text: `Deep work hours! Drop your shoulders, breathe, and keep the focus.` },
      { tag: 'Fuel Check', emoji: '🥗', text: `Had lunch or a healthy snack yet, ${name}? Fuel your engine.` },
      { tag: 'Posture Check', emoji: '🧘', text: `Straighten your back, unclench your jaw, and take a sip of water.` },
      { tag: 'Momentum', emoji: '⚡', text: `Mid-day check-in: small consistent steps lead to massive gains.` }
    )
  } else if (hour >= 14 && hour < 18) {
    // 2:00 PM - 5:59 PM (Afternoon Recharge)
    pool.push(
      { tag: 'Recharge', emoji: '🚶', text: `Afternoon energy dip? Step away from your screen for a 2-minute walk.` },
      { tag: 'Hydrate', emoji: '💧', text: `Caffeine won't solve everything! Have a tall glass of cool water.` },
      { tag: 'Power Hour', emoji: '⚡', text: `Pushing through the afternoon slump — you're closer than you think!` },
      { tag: 'Breathe', emoji: '🫁', text: `Take 3 deep breaths, ${name}. Reset your mind and conquer the rest of the day.` }
    )
  } else {
    // 6:00 PM - 11:59 PM (Evening Wind-down)
    pool.push(
      { tag: 'Dinner & Unwind', emoji: '🍲', text: `Evening time! Eat well, hydrate, and prepare to wind down.` },
      { tag: 'Daily Review', emoji: '✍️', text: `Check off whatever you accomplished today before heading to sleep.` },
      { tag: 'Screen Detox', emoji: '📵', text: `Dim your lights and put the screens away soon for deeper recovery.` },
      { tag: 'Rest Well', emoji: '✨', text: `Proud of your efforts today, ${name}. Great habits start with great rest.` }
    )
  }

  // 2. Performance / Progress context
  if (allDone) {
    pool.push(
      { tag: 'Crushed It!', emoji: '🏆', text: `100% complete today! You're on absolute god mode, ${name}.` },
      { tag: 'All Clear', emoji: '🎉', text: `Every habit checked off today! Relax and savor the victory.` }
    )
  } else if (noneDone && hour >= 18) {
    pool.push(
      { tag: 'Quick Win', emoji: '🌱', text: `Even knocking out just 1 habit tonight keeps your mindset sharp!` },
      { tag: 'Not Too Late', emoji: '⏱️', text: `A 5-minute win before bed is 100x better than doing nothing.` }
    )
  } else if (completed > 0 && completed < total) {
    const remaining = total - completed
    pool.push(
      { tag: 'Halfway', emoji: '🔥', text: `Nice progress! Just ${remaining} more habit${remaining > 1 ? 's' : ''} to reach 100% today.` }
    )
  }

  // 3. Streak context
  if (maxStreak >= 3) {
    pool.push(
      { tag: 'Streak Guard', emoji: '🔥', text: `You've got a ${maxStreak}-day streak alive! Keep the fire burning, ${name}.` }
    )
  }

  // 4. Day of the week flavor
  if (dayOfWeek === 1) { // Monday
    pool.push({ tag: 'Monday Energy', emoji: '🚀', text: `New week, new standard. Let's start the week strong, ${name}!` })
  } else if (dayOfWeek === 5) { // Friday
    pool.push({ tag: 'Friday Power', emoji: '🎉', text: `Friday momentum! Finish strong so your weekend feels truly earned.` })
  } else if (dayOfWeek === 0) { // Sunday
    pool.push({ tag: 'Sunday Prep', emoji: '🗓️', text: `Sunday recharge: clear head, light habits, ready to win the new week.` })
  }

  // Pick an item that isn't identical to the last one if possible
  if (pool.length === 1) return pool[0]

  let chosenIndex = Math.floor(Math.random() * pool.length)
  if (chosenIndex === lastMessageIndex && pool.length > 1) {
    chosenIndex = (chosenIndex + 1) % pool.length
  }
  lastMessageIndex = chosenIndex

  return pool[chosenIndex]
}
