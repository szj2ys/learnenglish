Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    current: {
      type: Number,
      value: 12
    },
    total: {
      type: Number,
      value: 50
    }
  },
  methods: {
    onOverlayTap() {
      this.triggerEvent('close')
    },
    preventBubble() {
      // Stop tap from bubbling to overlay
    },
    onContinue() {
      this.triggerEvent('continue')
    },
    onRestart() {
      this.triggerEvent('restart')
    }
  }
})
