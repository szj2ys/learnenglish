const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getDayIndex() {
  return (new Date().getDay() + 6) % 7 // Monday = 0
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { sessionId } = event
  if (!sessionId) return { code: 400, message: 'sessionId required' }

  try {
    const sessionRes = await db.collection('sessions').doc(sessionId).get()
    if (!sessionRes.data) return { code: 404, message: 'Session not found' }
    const session = sessionRes.data
    if (session._openid !== OPENID) return { code: 403, message: 'Forbidden' }

    const accuracy = session.wordCount > 0
      ? Math.round(session.correctCount / session.wordCount * 100)
      : 0

    // Update user stats
    const userRes = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
    if (userRes.data.length > 0) {
      const user = userRes.data[0]
      const newXp = (user.xp || 0) + session.xpEarned
      const newTotalWords = (user.totalWords || 0) + session.wordCount
      const newCorrectWords = (user.correctWords || 0) + session.correctCount
      const newLevel = Math.floor(newXp / 200) + 1

      // Update streak logic
      const weekActive = user.weekActive || [false,false,false,false,false,false,false]
      const dayIdx = getDayIndex()
      weekActive[dayIdx] = true

      // Check achievements
      const achievements = user.achievements || []
      if (accuracy >= 80 && !achievements[0].unlocked) achievements[0].unlocked = true
      if (session.wordCount >= 10 && !achievements[1].unlocked) achievements[1].unlocked = true
      if (weekActive.every(Boolean) && !achievements[2].unlocked) achievements[2].unlocked = true
      if (newTotalWords >= 100 && !achievements[3].unlocked) achievements[3].unlocked = true

      await db.collection('users').doc(user._id).update({
        data: {
          xp: newXp,
          level: newLevel,
          totalWords: newTotalWords,
          correctWords: newCorrectWords,
          weekActive,
          achievements,
          updatedAt: new Date()
        }
      })
    }

    // Update daily progress
    const today = getTodayStr()
    const progressRes = await db.collection('dailyProgress').where({
      _openid: OPENID,
      date: today
    }).limit(1).get()

    if (progressRes.data.length === 0) {
      await db.collection('dailyProgress').add({
        data: {
          _openid: OPENID,
          date: today,
          completed: session.wordCount,
          correct: session.correctCount,
          createdAt: new Date()
        }
      })
    } else {
      await db.collection('dailyProgress').doc(progressRes.data[0]._id).update({
        data: {
          completed: _.inc(session.wordCount),
          correct: _.inc(session.correctCount),
          updatedAt: new Date()
        }
      })
    }

    // Mark session as completed if not already
    if (session.status !== 'completed') {
      await db.collection('sessions').doc(sessionId).update({
        data: { status: 'completed', updatedAt: new Date() }
      })
    }

    return {
      code: 200,
      data: {
        accuracy,
        xpEarned: session.xpEarned,
        correctCount: session.correctCount,
        wordCount: session.wordCount,
        streak: userRes.data[0].streak || 0
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
