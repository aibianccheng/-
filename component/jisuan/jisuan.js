// component/jisuan/jisuan.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
   count:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delCount(even) {
      console.log(even)
      if (this.data.count > 1) {
        this.setData({
          count: this.data.count - 1
        })
      } else {
        wx.showToast({
          title: '亲不能再少啦',
        })
      }

    },
    addCount(even) {
      console.log(even)
      if (this.data.count < 10) {
        this.setData({
          count: this.data.count + 1
        })
      } else {
        wx.showToast({
          title: '只能限购10件哦',
        })
      }
    },
  }
})
