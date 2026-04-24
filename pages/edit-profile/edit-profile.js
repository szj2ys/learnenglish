const app = getApp()

Page({
  data: {
    name: 'User',
    username: '@user',
    email: '',
    password: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
    avatarUrl: '',
    originalName: ''
  },

  onLoad() {
    const userInfo = app.globalData.userInfo
    if (!userInfo) return

    const nick = userInfo.nickName || 'User'
    this.setData({
      name: nick,
      username: '@' + nick.toLowerCase().replace(/\s+/g, ''),
      avatarUrl: userInfo.avatarUrl || '',
      originalName: nick
    })
  },

  onBackTap() {
    wx.navigateBack()
  },

  onSaveTap() {
    const { name, originalName } = this.data
    if (name === originalName) {
      wx.showToast({ title: 'No changes', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }

    wx.showLoading({ title: 'Saving...' })
    wx.cloud.callFunction({
      name: 'updateProfile',
      data: { nickName: name },
      success: res => {
        wx.hideLoading()
        const { code } = res.result || {}
        if (code === 200) {
          // Update global data
          if (app.globalData.userInfo) {
            app.globalData.userInfo.nickName = name
          }
          wx.showToast({ title: 'Saved!', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 800)
        } else {
          wx.showToast({ title: 'Save failed', icon: 'none' })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({ title: 'Network error', icon: 'none' })
        console.error('updateProfile failed:', err)
      }
    })
  },

  onAvatarTap() {
    wx.showToast({ title: 'Change avatar', icon: 'none' })
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },

  onEmailTap() {
    wx.showToast({ title: 'Email settings', icon: 'none' })
  },

  onPasswordTap() {
    wx.showToast({ title: 'Password settings', icon: 'none' })
  }
})
