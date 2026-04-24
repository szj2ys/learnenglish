const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  try {
    const userRes = await db.collection('users').where({ _openid: OPENID }).limit(1).get()
    if (userRes.data.length === 0) return { code: 404, message: 'User not found' }
    const user = userRes.data[0]

    const today = getTodayStr()
    const progressRes = await db.collection('dailyProgress').where({
      _openid: OPENID,
      date: today
    }).limit(1).get()

    const dailyCurrent = progressRes.data.length > 0 ? (progressRes.data[0].completed || 0) : 0
    const dailyTotal = 50

    // Calculate rank description
    const rankDesc = user.league === 'Emerald' ? 'Top 5% this week' :
                     user.league === 'Gold' ? 'Top 15% this week' :
                     user.league === 'Silver' ? 'Top 35% this week' :
                     'Keep going!'

    // Count weak words (mistakes)
    const mistakeRes = await db.collection('mistakes').where({ _openid: OPENID }).count()
    const weakWords = mistakeRes.total

    return {
      code: 200,
      data: {
        streak: user.streak,
        xp: user.xp,
        level: user.level,
        league: user.league,
        title: user.title,
        dailyCurrent,
        dailyTotal,
        dailyPercent: Math.round(dailyCurrent / dailyTotal * 100),
        rank: user.league + ' Tier',
        rankDesc,
        weakWords,
        weekActive: user.weekActive,
        totalWords: user.totalWords || 0,
        correctWords: user.correctWords || 0
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
