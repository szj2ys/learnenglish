App({
  globalData: {
    userInfo: {
      name: 'Alex',
      avatar: '',
      streak: 14,
      xp: 4250,
      level: 24,
      rank: 'Emerald'
    },
    dailyQuest: {
      current: 32,
      total: 50
    }
  },
  onLaunch() {
    console.log('App Launch')
  }
})
