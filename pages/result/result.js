const app = getApp()

Page({
  data: {
    accuracy: 80,
    xpEarned: 120,
    totalXP: 523,
    streak: 0,
    correctCount: 0,
    wordCount: 0
  },

  onLoad(options) {
    const parse = (key, fallback = 0) => parseInt(options[key]) || fallback
    const xpEarned = parse('xpEarned')
    const totalXP = parseInt(options.totalXP) || ((app.globalData.userInfo?.xp || 0) + xpEarned)

    this.setData({
      accuracy: parse('accuracy'),
      xpEarned,
      totalXP,
      streak: parse('streak'),
      correctCount: parse('correctCount'),
      wordCount: parse('wordCount')
    })

    const user = app.globalData.userInfo
    if (user) {
      user.xp = totalXP
      user.streak = this.data.streak
    }
  },

  onPlayAgain() {
    wx.redirectTo({ url: '/pages/dictation/dictation' })
  },

  onReviewMistakes() {
    wx.showToast({ title: 'Review coming soon', icon: 'none' })
  },

  onClose() {
    wx.switchTab({ url: '/pages/home/home' })
  }
})
