const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) {
    return { code: 401, message: 'Unauthorized' }
  }

  try {
    let userRes = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
    let user = null
    let isNewUser = false

    if (userRes.data.length === 0) {
      isNewUser = true
      const now = new Date()
      const newUser = {
        _openid: OPENID,
        nickName: 'Newbie',
        avatarUrl: '',
        streak: 0,
        xp: 0,
        level: 1,
        title: 'Beginner',
        league: 'Bronze',
        totalWords: 0,
        correctWords: 0,
        weekActive: [false, false, false, false, false, false, false],
        achievements: [
          { name: 'Grammar Master', icon: '\uD83C\uDF93', bg: 'primary', unlocked: false },
          { name: 'Speed Demon', icon: '\u23F1\uFE0F', bg: 'secondary', unlocked: false },
          { name: 'Perfect Week', icon: '\u2705', bg: 'tertiary', unlocked: false },
          { name: 'Vocab King', icon: '\uD83D\uDD12', bg: 'default', unlocked: false }
        ],
        createdAt: now,
        updatedAt: now
      }
      const addRes = await db.collection('users').add({ data: newUser })
      user = { _id: addRes._id, ...newUser }
    } else {
      user = userRes.data[0]
    }

    return {
      code: 200,
      data: {
        openid: OPENID,
        isNewUser,
        userInfo: {
          _id: user._id,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          streak: user.streak,
          xp: user.xp,
          level: user.level,
          title: user.title,
          league: user.league,
          totalWords: user.totalWords || 0,
          correctWords: user.correctWords || 0,
          weekActive: user.weekActive,
          achievements: user.achievements
        }
      }
    }
  } catch (err) {
    console.error('login error:', err)
    return { code: 500, message: err.message || 'Server error' }
  }
}
