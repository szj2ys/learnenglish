App({
  globalData: {
    userInfo: null,
    dailyQuest: { current: 0, total: 50 },
    openid: null,
    isLoggedIn: false
  },

  onLaunch() {
    wx.cloud.init({ env: 'cloud1-d3gqoloovbbc16fb8', traceUser: true })
    this.login()
  },

  login() {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        const { code, data } = res.result || {}
        if (code === 200 && data) {
          this.globalData.userInfo = data.userInfo
          this.globalData.openid = data.openid
          this.globalData.isLoggedIn = true
          console.log('Login success:', data.userInfo)
        } else {
          console.error('Login failed:', res.result)
        }
      },
      fail: err => {
        console.error('Login cloud function failed:', err)
      }
    })
  }
})
