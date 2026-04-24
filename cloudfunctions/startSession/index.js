const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { wordIds, wordCount } = event
  if (!wordIds || !wordIds.length) {
    return { code: 400, message: 'wordIds required' }
  }

  try {
    // Close any existing active session
    await db.collection('sessions').where({
      _openid: OPENID,
      status: 'active'
    }).update({ data: { status: 'abandoned', updatedAt: new Date() } })

    const now = new Date()
    const session = {
      _openid: OPENID,
      wordIds,
      wordCount: wordCount || wordIds.length,
      currentIndex: 0,
      answers: [],
      correctCount: 0,
      xpEarned: 0,
      status: 'active',
      createdAt: now,
      updatedAt: now
    }

    const addRes = await db.collection('sessions').add({ data: session })

    return {
      code: 200,
      data: {
        sessionId: addRes._id,
        wordCount: session.wordCount,
        currentIndex: 0
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
