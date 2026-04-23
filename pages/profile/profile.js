Page({
  data: {
    name: 'Alex',
    surname: 'Rivera',
    level: 24,
    title: 'Scholar',
    streak: 14,
    totalXP: 4250,
    league: 'Emerald',
    weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    weekActive: [true, true, true, true, false, false, false],
    weekCurrent: 3,
    achievements: [
      { name: 'Grammar Master', icon: '🎓', bg: 'primary', unlocked: true },
      { name: 'Speed Demon', icon: '⏱️', bg: 'secondary', unlocked: true },
      { name: 'Perfect Week', icon: '✅', bg: 'tertiary', unlocked: true },
      { name: 'Vocab King', icon: '🔒', bg: 'default', unlocked: false }
    ]
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
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
