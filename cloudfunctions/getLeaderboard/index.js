const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { limit = 20 } = event

  try {
    // Get all users sorted by XP
    const usersRes = await db.collection('users')
      .orderBy('xp', 'desc')
      .limit(limit + 5)
      .get()

    const allUsers = usersRes.data
    let myRank = 0
    let myScore = 0
    let myName = 'You'
    let myAvatar = ''

    allUsers.forEach((u, idx) => {
      if (u._openid === OPENID) {
        myRank = idx + 1
        myScore = u.xp || 0
        myName = u.nickName || 'You'
        myAvatar = u.avatarUrl || ''
      }
    })

    // If user not in top list, fetch them separately
    if (myRank === 0) {
      const myRes = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
      if (myRes.data.length > 0) {
        const me = myRes.data[0]
        // Count users with higher XP
        const higherRes = await db.collection('users').where({
          xp: db.command.gt(me.xp || 0)
        }).count()
        myRank = higherRes.total + 1
        myScore = me.xp || 0
        myName = me.nickName || 'You'
        myAvatar = me.avatarUrl || ''
      }
    }

    const podium = allUsers.slice(0, 3).map((u, i) => ({
      rank: i + 1,
      name: u.nickName || 'User',
      score: u.xp || 0,
      avatar: u.avatarUrl || '',
      color: i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze',
      isFirst: i === 0
    }))

    // Reorder podium for display: silver(2), gold(1), bronze(3)
    const displayPodium = podium.length >= 3
      ? [podium[1], podium[0], podium[2]]
      : podium

    const list = allUsers.slice(3, limit).map((u, i) => ({
      rank: i + 4,
      name: u.nickName || 'User',
      score: u.xp || 0,
      avatar: u.avatarUrl || '',
      initial: (u.nickName || 'U')[0],
      warning: i >= 6 // Last few in top 10 get warning
    }))

    // Promotion diff: next rank's score minus mine
    let promotionDiff = 0
    if (myRank > 1) {
      const nextUser = allUsers[myRank - 2]
      if (nextUser) promotionDiff = (nextUser.xp || 0) - myScore
    }

    // Get user's streak
    const userRes = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
    const streak = userRes.data.length > 0 ? (userRes.data[0].streak || 0) : 0

    return {
      code: 200,
      data: {
        myRank,
        myScore,
        myName,
        myAvatar,
        promotionDiff,
        streak,
        podium: displayPodium,
        list
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
