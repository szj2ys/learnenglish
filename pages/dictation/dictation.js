Page({
  data: {
    currentIndex: 12,
    totalWords: 50,
    progressPercent: 24,
    xp: 523,
    wordXP: 10,
    inputValue: 'ap',
    remainingHint: 'ple',
    isPlaying: false,
    word: 'apple'
  },
  onLoad(options) {
    const count = options.count || 50
    this.setData({ totalWords: count })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: -1 })
    }
  },
  onCloseTap() {
    wx.navigateBack()
  },
  onReplayTap() {
    this.setData({ isPlaying: true })
    setTimeout(() => this.setData({ isPlaying: false }), 1000)
  },
  onDeleteTap() {
    const val = this.data.inputValue
    if (val.length > 0) {
      this.setData({ inputValue: val.slice(0, -1) })
    }
  }
})
