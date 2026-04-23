Page({
  data: {
    name: 'Alex Johnson',
    username: '@alexj_words',
    email: 'alex.j@example.com',
    password: '••••••••'
  },
  onBackTap() {
    wx.navigateBack()
  },
  onSaveTap() {
    wx.showToast({ title: 'Saved!', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
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
