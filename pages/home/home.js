Page({
  data: {
    userName: 'Alex',
    streak: 14,
    xp: 523,
    dailyCurrent: 32,
    dailyTotal: 50,
    dailyPercent: 64,
    rank: 'Gold Tier',
    rankDesc: 'Top 15% this week',
    weakWords: 14
  },
  onLoad() {
    this.setData({ dailyPercent: Math.round(this.data.dailyCurrent / this.data.dailyTotal * 100) })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },
  onMenuTap() {
    wx.showToast({ title: 'Menu coming soon', icon: 'none' })
  },
  onContinueTap() {
    wx.navigateTo({ url: '/pages/dictation/dictation' })
  },
  onQuickStart(e) {
    const count = e.currentTarget.dataset.count
    wx.navigateTo({ url: '/pages/dictation/dictation?count=' + count })
  },
  onReviewTap() {
    wx.showToast({ title: 'Review coming soon', icon: 'none' })
  },
  onRankTap() {
    wx.switchTab({ url: '/pages/leaderboard/leaderboard' })
  }
})
