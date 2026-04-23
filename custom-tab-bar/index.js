Component({
  data: {
    selected: 0,
    color: '#6f7b64',
    selectedColor: '#ffffff',
    list: [
      { pagePath: '/pages/home/home', text: 'Learn', icon: '📚' },
      { pagePath: '/pages/leaderboard/leaderboard', text: 'Ranks', icon: '📊' },
      { pagePath: '/pages/profile/profile', text: 'Profile', icon: '👤' }
    ]
  },
  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset
      if (this.data.selected === index) return
      wx.switchTab({ url })
    }
  }
})
