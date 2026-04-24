const app = getApp()

Page({
  data: {
    name: 'User',
    surname: '',
    level: 1,
    title: 'Beginner',
    streak: 0,
    totalXP: 0,
    league: 'Bronze',
    weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    weekActive: [false, false, false, false, false, false, false],
    weekCurrent: 3,
    achievements: [
      { name: 'Grammar Master', icon: '\uD83C\uDF93', bg: 'primary', unlocked: false },
      { name: 'Speed Demon', icon: '\u23F1\uFE0F', bg: 'secondary', unlocked: false },
      { name: 'Perfect Week', icon: '\u2705', bg: 'tertiary', unlocked: false },
      { name: 'Vocab King', icon: '\uD83D\uDD12', bg: 'default', unlocked: false }
    ]
  },

  onLoad() {
    this.loadUserProfile()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    // Refresh profile data when returning from edit-profile
    if (app.globalData.isLoggedIn) {
      this.loadUserProfile()
    }
  },

  loadUserProfile() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      success: res => {
        const { code, data } = res.result || {}
        if (code !== 200 || !data) return

        const [firstName, ...rest] = (data.nickName || 'User').split(' ')
        this.setData({
          name: firstName,
          surname: rest.join(' '),
          level: data.level,
          title: data.title,
          streak: data.streak,
          totalXP: data.xp,
          league: data.league,
          weekActive: data.weekActive || Array(7).fill(false),
          achievements: data.achievements || this.data.achievements
        })

        const global = app.globalData.userInfo
        if (global) {
          Object.assign(global, {
            nickName: data.nickName,
            avatar: data.avatarUrl,
            streak: data.streak,
            xp: data.xp,
            level: data.level,
            rank: data.league
          })
        }
      },
      fail: err => {
        console.error('getUserInfo failed:', err)
      }
    })
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' })
  },

  onContinueLearning() {
    wx.switchTab({ url: '/pages/home/home' })
  },

  onViewAllAchievements() {
    wx.showToast({ title: 'All achievements coming soon', icon: 'none' })
  }
})
