const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, message: 'Unauthorized' }

  const { count = 10, level = null } = event

  try {
    // Try to get words from collection, fallback to seed data if empty
    let wordRes = await db.collection('words').limit(200).get()
    let words = wordRes.data

    // Seed data if collection is empty
    if (words.length === 0) {
      words = [
        { word: 'apple', phonetic: '/\u02C8\u00E6p.l/', meaning: '\u82F9\u679C', difficulty: 1, level: 1, audioUrl: '' },
        { word: 'banana', phonetic: '/b\u0259\u02C8n\u00E6n.\u0259/', meaning: '\u9999\u8549', difficulty: 1, level: 1, audioUrl: '' },
        { word: 'cherry', phonetic: '/\u02C8t\u0283er.i/', meaning: '\u6A31\u6843', difficulty: 1, level: 1, audioUrl: '' },
        { word: 'elephant', phonetic: '/\u02C8el.\u026A.f\u0259nt/', meaning: '\u5927\u8C61', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'giraffe', phonetic: '/d\u0292\u026A\u02C8r\u00E6f/', meaning: '\u957F\u9888\u9E7F', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'mountain', phonetic: '/\u02C8ma\u028Ant\u026A\u0259n/', meaning: '\u5C71', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'beautiful', phonetic: '/\u02C8bju\u02D0.t\u026A.f\u028El/', meaning: '\u7F8E\u4E3D\u7684', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'butterfly', phonetic: '/\u02C8b\u028Ct.\u0259.fla\u026A/', meaning: '\u8774\u8776', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'environment', phonetic: '/\u026An\u02C8va\u026A.r\u0259n.m\u0259nt/', meaning: '\u73AF\u5883', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'photograph', phonetic: '/\u02C8f\u0259\u028A.t\u0259.\u0261r\u00E6f/', meaning: '\u7167\u7247', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'adventure', phonetic: '/\u0259d\u02C8ven.t\u0283\u0259/', meaning: '\u5192\u9669', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'chocolate', phonetic: '/\u02C8t\u0283\u0252k.l\u0259t/', meaning: '\u5DE7\u514B\u529B', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'dinosaur', phonetic: '/\u02C8da\u026A.n\u0259.s\u0254\u02D0/', meaning: '\u6050\u9F99', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'universe', phonetic: '/\u02C8ju\u02D0.n\u026A.v\u025C\u02D0s/', meaning: '\u5B87\u5B99', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'watermelon', phonetic: '/\u02C8w\u0254\u02D0.t\u0259\u02CCmel.\u0259n/', meaning: '\u897F\u74DC', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'penguin', phonetic: '/\u02C8pe\u014B.\u0261w\u026An/', meaning: '\u4F01\u9E45', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'volcano', phonetic: '/v\u0252l\u02C8ke\u026A.n\u0259\u028A/', meaning: '\u706B\u5C71', difficulty: 3, level: 3, audioUrl: '' },
        { word: 'bicycle', phonetic: '/\u02C8ba\u026A.s\u026A.k\u0259l/', meaning: '\u81EA\u884C\u8F66', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'rainbow', phonetic: '/\u02C8re\u026An.b\u0259\u028A/', meaning: '\u5F69\u8679', difficulty: 2, level: 2, audioUrl: '' },
        { word: 'umbrella', phonetic: '/\u028Cm\u02C8brel.\u0259/', meaning: '\u96E8\u4F1E', difficulty: 2, level: 2, audioUrl: '' }
      ]
    }

    // Filter by level if provided, then shuffle and pick
    if (level) {
      words = words.filter(w => w.level === level)
    }

    // Shuffle
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]
    }

    const selected = words.slice(0, Math.min(count, words.length))

    return {
      code: 200,
      data: {
        words: selected.map(w => ({
          _id: w._id || w.word,
          word: w.word,
          phonetic: w.phonetic,
          meaning: w.meaning,
          difficulty: w.difficulty,
          level: w.level,
          audioUrl: w.audioUrl
        })),
        count: selected.length
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
