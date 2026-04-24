const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  try {
    const res = await db.collection('sessions').where({
      _openid: OPENID,
      status: 'active'
    }).orderBy('updatedAt', 'desc').limit(1).get()

    if (res.data.length === 0) {
      return { code: 200, data: { hasSession: false } }
    }

    const session = res.data[0]
    if (session.currentIndex >= session.wordCount) {
      return { code: 200, data: { hasSession: false } }
    }

    // Fetch word details
    const wordPromises = session.wordIds.map(id =>
      db.collection('words').doc(id).get().catch(() => null)
    )
    const wordDocs = await Promise.all(wordPromises)
    const words = wordDocs.filter(Boolean).map(doc => doc.data)

    return {
      code: 200,
      data: {
        hasSession: true,
        sessionId: session._id,
        currentIndex: session.currentIndex,
        wordCount: session.wordCount,
        words: words.length > 0 ? words : session.wordIds.map((id, i) => ({ _id: id, word: id })),
        answers: session.answers || []
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
