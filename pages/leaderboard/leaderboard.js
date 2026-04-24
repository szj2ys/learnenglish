const app = getApp()

Page({
  data: {
    myRank: 42,
    myScore: 0,
    myName: 'You',
    myAvatar: '',
    promotionDiff: 340,
    streak: 0,
    podium: [],
    list: [],
    loading: false
  },

  onLoad() {
    this.loadLeaderboard()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  loadLeaderboard() {
    this.setData({ loading: true })
    wx.cloud.callFunction({
      name: 'getLeaderboard',
      data: { limit: 20 },
      success: res => {
        this.setData({ loading: false })
        const { code, data } = res.result || {}
        if (code === 200 && data) {
          this.setData({
            myRank: data.myRank,
            myScore: data.myScore,
            myName: data.myName,
            myAvatar: data.myAvatar,
            promotionDiff: data.promotionDiff,
            streak: data.streak,
            podium: data.podium || [],
            list: data.list || []
          })
          const user = app.globalData.userInfo
          if (user) user.streak = data.streak
        }
      },
      fail: err => {
        this.setData({ loading: false })
        wx.showToast({ title: 'Failed to load leaderboard', icon: 'none' })
        console.error('getLeaderboard failed:', err)
      }
    })
  },

  onLoadMore() {
    wx.showToast({ title: 'Loading...', icon: 'none' })
  }
})
