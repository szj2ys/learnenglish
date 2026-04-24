const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { nickName, avatarUrl } = event
  if (!nickName && !avatarUrl) {
    return { code: 400, message: 'No fields to update' }
  }

  try {
    const updateData = { updatedAt: new Date() }
    if (nickName) updateData.nickName = nickName
    if (avatarUrl) updateData.avatarUrl = avatarUrl

    const res = await db.collection('users').where({ _openid: OPENID }).update({ data: updateData })
    return { code: 200, data: { updated: res.stats.updated } }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
