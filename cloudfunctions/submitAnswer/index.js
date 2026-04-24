const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { sessionId, wordId, answer, word } = event
  if (!sessionId || !wordId || answer === undefined) {
    return { code: 400, message: 'sessionId, wordId, answer required' }
  }

  try {
    const sessionRes = await db.collection('sessions').doc(sessionId).get()
    if (!sessionRes.data) return { code: 404, message: 'Session not found' }
    const session = sessionRes.data
    if (session._openid !== OPENID) return { code: 403, message: 'Forbidden' }
    if (session.status !== 'active') return { code: 400, message: 'Session not active' }

    const correctWord = (word || '').toLowerCase().trim()
    const userAnswer = answer.toLowerCase().trim()
    const isCorrect = userAnswer === correctWord

    const answerRecord = {
      wordId,
      word: correctWord,
      answer: userAnswer,
      isCorrect,
      timestamp: new Date()
    }

    const xpPerWord = isCorrect ? 10 : 0
    const newCorrectCount = session.correctCount + (isCorrect ? 1 : 0)
    const newXp = session.xpEarned + xpPerWord
    const newIndex = session.currentIndex + 1
    const isCompleted = newIndex >= session.wordCount

    // Update session
    await db.collection('sessions').doc(sessionId).update({
      data: {
        answers: _.push(answerRecord),
        currentIndex: newIndex,
        correctCount: newCorrectCount,
        xpEarned: newXp,
        status: isCompleted ? 'completed' : 'active',
        updatedAt: new Date()
      }
    })

    // If incorrect, add/update mistake
    if (!isCorrect) {
      const mistakeRes = await db.collection('mistakes').where({
        _openid: OPENID,
        word: correctWord
      }).limit(1).get()

      if (mistakeRes.data.length === 0) {
        await db.collection('mistakes').add({
          data: {
            _openid: OPENID,
            word: correctWord,
            count: 1,
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
            createdAt: new Date()
          }
        })
      } else {
        await db.collection('mistakes').doc(mistakeRes.data[0]._id).update({
          data: {
            count: _.inc(1),
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          }
        })
      }
    }

    return {
      code: 200,
      data: {
        isCorrect,
        correctWord,
        xpEarned: xpPerWord,
        currentIndex: newIndex,
        wordCount: session.wordCount,
        isCompleted,
        correctCount: newCorrectCount
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
