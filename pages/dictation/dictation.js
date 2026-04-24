const app = getApp()

Page({
  data: {
    sessionId: null,
    currentIndex: 0,
    totalWords: 10,
    progressPercent: 0,
    xp: 0,
    wordXP: 10,
    inputValue: '',
    remainingHint: '',
    isPlaying: false,
    word: '',
    wordId: '',
    phonetic: '',
    meaning: '',
    words: [],
    answers: [],
    feedbackType: null, // 'correct' | 'wrong' | null
    feedbackWord: '',
    isSubmitting: false,
    isComplete: false
  },

  onLoad(options) {
    const count = parseInt(options.count) || 10
    const sessionId = options.sessionId || null

    if (sessionId) {
      this.resumeSession(sessionId)
    } else {
      this.setData({ totalWords: count })
      this.loadWords(count)
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: -1 })
    }
    // Auto-play first word when loaded
    if (this.data.words.length > 0 && this.data.currentIndex === 0 && !this.data.inputValue) {
      setTimeout(() => this.playWord(), 500)
    }
  },

  loadWords(count) {
    wx.showLoading({ title: 'Loading...' })
    wx.cloud.callFunction({
      name: 'getDailyWords',
      data: { count },
      success: res => {
        wx.hideLoading()
        const { code, data } = res.result || {}
        if (code === 200 && data && data.words) {
          this.setData({
            words: data.words,
            totalWords: data.count,
            currentIndex: 0
          })
          this.startNewSession(data.words)
        } else {
          wx.showToast({ title: 'Failed to load words', icon: 'none' })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({ title: 'Network error', icon: 'none' })
        console.error('getDailyWords failed:', err)
      }
    })
  },

  startNewSession(words) {
    const wordIds = words.map(w => w._id || w.word)
    wx.cloud.callFunction({
      name: 'startSession',
      data: { wordIds, wordCount: words.length },
      success: res => {
        const { code, data } = res.result || {}
        if (code === 200 && data) {
          this.setData({ sessionId: data.sessionId })
          this.updateCurrentWord()
        }
      },
      fail: err => {
        console.error('startSession failed:', err)
      }
    })
  },

  resumeSession(sessionId) {
    wx.showLoading({ title: 'Resuming...' })
    wx.cloud.callFunction({
      name: 'getResumeSession',
      success: res => {
        wx.hideLoading()
        const { code, data } = res.result || {}
        if (code === 200 && data && data.hasSession && data.sessionId === sessionId) {
          this.setData({
            sessionId: data.sessionId,
            words: data.words || [],
            currentIndex: data.currentIndex,
            totalWords: data.wordCount,
            answers: data.answers || []
          })
          this.updateCurrentWord()
        } else {
          // Session not found, start new
          this.loadWords(10)
        }
      },
      fail: err => {
        wx.hideLoading()
        console.error('resumeSession failed:', err)
        this.loadWords(10)
      }
    })
  },

  updateCurrentWord() {
    const { words, currentIndex, totalWords } = this.data
    if (currentIndex >= words.length) {
      this.finishSession()
      return
    }

    const w = words[currentIndex]
    this.setData({
      word: w.word,
      wordId: w._id || w.word,
      phonetic: w.phonetic || '',
      meaning: w.meaning || '',
      inputValue: '',
      remainingHint: '',
      feedbackType: null,
      progressPercent: Math.round((currentIndex / totalWords) * 100)
    })
    this.playWord()
  },

  playWord() {
    this.setData({ isPlaying: true })
    // Simulate audio play for 1s, then stop
    setTimeout(() => this.setData({ isPlaying: false }), 1000)
    // In real implementation, use wx.getBackgroundAudioManager or TTS
  },

  onCloseTap() {
    wx.navigateBack()
  },

  onReplayTap() {
    this.playWord()
  },

  onDeleteTap() {
    const val = this.data.inputValue
    if (val.length > 0) {
      this.setData({ inputValue: val.slice(0, -1) })
    }
  },

  // Handle input from virtual keyboard or real keyboard
  onInputChange(e) {
    const value = e.detail.value || ''
    this.setData({ inputValue: value })

    // Auto-submit on space or when length matches word length
    if (value.endsWith(' ')) {
      this.submitAnswer(value.trim())
    }
  },

  onKeyTap(e) {
    const key = e.currentTarget.dataset.key
    if (!key) return

    if (key === 'backspace') {
      this.onDeleteTap()
    } else if (key === 'submit') {
      this.submitAnswer(this.data.inputValue)
    } else {
      const newVal = this.data.inputValue + key
      this.setData({ inputValue: newVal })
      // Auto-submit if word length reached
      if (newVal.length >= this.data.word.length) {
        setTimeout(() => this.submitAnswer(newVal), 300)
      }
    }
  },

  submitAnswer(answer) {
    if (this.data.isSubmitting || !this.data.sessionId) return
    if (!answer) return

    this.setData({ isSubmitting: true })

    wx.cloud.callFunction({
      name: 'submitAnswer',
      data: {
        sessionId: this.data.sessionId,
        wordId: this.data.wordId,
        answer,
        word: this.data.word
      },
      success: res => {
        const { code, data } = res.result || {}
        if (code !== 200 || !data) {
          this.setData({ isSubmitting: false })
          return
        }

        this.setData({
          feedbackType: data.isCorrect ? 'correct' : 'wrong',
          feedbackWord: data.correctWord,
          xp: this.data.xp + data.xpEarned,
          currentIndex: data.currentIndex,
          progressPercent: Math.round((data.currentIndex / data.wordCount) * 100)
        })

        setTimeout(() => {
          if (data.isCompleted) {
            this.finishSession()
          } else {
            this.setData({ feedbackType: null })
            this.updateCurrentWord()
          }
          this.setData({ isSubmitting: false })
        }, data.isCorrect ? 800 : 1500)
      },
      fail: err => {
        this.setData({ isSubmitting: false })
        wx.showToast({ title: 'Submit failed', icon: 'none' })
        console.error('submitAnswer failed:', err)
      }
    })
  },

  finishSession() {
    const { sessionId } = this.data
    if (!sessionId) {
      wx.redirectTo({ url: '/pages/result/result' })
      return
    }

    wx.cloud.callFunction({
      name: 'completeSession',
      data: { sessionId },
      success: res => {
        const { code, data } = res.result || {}
        if (code === 200 && data) {
          const totalXP = data.xpEarned + (app.globalData.userInfo?.xp || 0)
          wx.redirectTo({
            url: `/pages/result/result?accuracy=${data.accuracy}&xpEarned=${data.xpEarned}&totalXP=${totalXP}&streak=${data.streak}&correctCount=${data.correctCount}&wordCount=${data.wordCount}`
          })
        } else {
          wx.redirectTo({ url: '/pages/result/result' })
        }
      },
      fail: err => {
        console.error('completeSession failed:', err)
        wx.redirectTo({ url: '/pages/result/result' })
      }
    })
  },

  onUnload() {
    // Session remains active for resume
  }
})
