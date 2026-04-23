Page({
  data: {
    accuracy: 80,
    xpEarned: 120,
    totalXP: 523,
    streak: 14
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
