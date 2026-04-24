const app = getApp()

Page({
  data: {
    userName: 'User',
    streak: 0,
    xp: 0,
    dailyCurrent: 0,
    dailyTotal: 50,
    dailyPercent: 0,
    rank: 'Bronze Tier',
    rankDesc: 'Keep going!',
    weakWords: 0,
    hasResumeSession: false,
    resumeSessionId: null,
    resumeCurrent: 0,
    resumeTotal: 50
  },

  onLoad() {
    this.loadUserStats()
    this.checkResumeSession()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    // Refresh data when returning from dictation/profile
    if (app.globalData.isLoggedIn) {
      this.loadUserStats()
      this.checkResumeSession()
    }
  },

  loadUserStats() {
    wx.cloud.callFunction({
      name: 'getUserStats',
      success: res => {
        const { code, data } = res.result || {}
        if (code !== 200 || !data) return

        this.setData({
          userName: app.globalData.userInfo?.nickName || 'User',
          streak: data.streak,
          xp: data.xp,
          dailyCurrent: data.dailyCurrent,
          dailyTotal: data.dailyTotal,
          dailyPercent: data.dailyPercent,
          rank: data.rank,
          rankDesc: data.rankDesc,
          weakWords: data.weakWords
        })

        app.globalData.dailyQuest = { current: data.dailyCurrent, total: data.dailyTotal }
        const user = app.globalData.userInfo
        if (user) {
          Object.assign(user, { streak: data.streak, xp: data.xp, level: data.level, rank: data.league })
        }
      },
      fail: err => {
        console.error('getUserStats failed:', err)
      }
    })
  },

  checkResumeSession() {
    wx.cloud.callFunction({
      name: 'getResumeSession',
      success: res => {
        const { code, data } = res.result || {}
        if (code === 200 && data && data.hasSession) {
          this.setData({
            hasResumeSession: true,
            resumeSessionId: data.sessionId,
            resumeCurrent: data.currentIndex,
            resumeTotal: data.wordCount
          })
        } else {
          this.setData({ hasResumeSession: false })
        }
      },
      fail: err => {
        console.error('getResumeSession failed:', err)
      }
    })
  },

  onMenuTap() {
    wx.showToast({ title: 'Menu coming soon', icon: 'none' })
  },

  onContinueTap() {
    if (this.data.hasResumeSession && this.data.resumeSessionId) {
      wx.navigateTo({
        url: '/pages/dictation/dictation?sessionId=' + this.data.resumeSessionId
      })
    } else {
      wx.navigateTo({ url: '/pages/dictation/dictation' })
    }
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
