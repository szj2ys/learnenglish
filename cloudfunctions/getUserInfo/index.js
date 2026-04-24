const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  try {
    const res = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
    if (res.data.length === 0) return { code: 404, message: 'User not found' }
    const user = res.data[0]
    return {
      code: 200,
      data: {
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
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
