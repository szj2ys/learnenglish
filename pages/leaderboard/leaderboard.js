Page({
  data: {
    myRank: 42,
    myScore: 12450,
    myName: 'You',
    myAvatar: '',
    promotionDiff: 340,
    streak: 14,
    podium: [
      { rank: 2, name: 'Alex M.', score: 4250, avatar: '', color: 'silver', isFirst: false },
      { rank: 1, name: 'Sarah K.', score: 5120, avatar: '', color: 'gold', isFirst: true },
      { rank: 3, name: 'David L.', score: 3980, avatar: '', color: 'bronze', isFirst: false }
    ],
    list: [
      { rank: 4, name: 'Emma W.', score: 3850, avatar: '' },
      { rank: 5, name: 'James T.', score: 3620, avatar: '' },
      { rank: 6, name: 'Olivia R.', score: 3410, avatar: '' },
      { rank: 7, name: 'Liam S.', score: 3200, avatar: '' },
      { rank: 8, name: 'Chloe B.', score: 3050, avatar: '', initial: 'C' },
      { rank: 9, name: 'Noah M.', score: 2990, avatar: '' },
      { rank: 10, name: 'Mia T.', score: 2850, avatar: '', warning: true }
    ]
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },
  onLoadMore() {
    wx.showToast({ title: 'Loading...', icon: 'none' })
  }
})
