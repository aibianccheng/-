// pages/classify/classify.js
const ajax = require('../../utils/ajax.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyItems:"",
    curNav: 1,
    curIndex: 0
  },
  switchRightTab: function (e) {
    console.log(e)
    // 获取item项的id，和数组的下标值  
    let categoryType = e.target.dataset.id
    let index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: categoryType,
      curIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品分类'
    })
    var that = this;
    that.classifyShow();
  },
  classifyShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      url: 'wxShop/classify/getClassify',
      success: data => {
        console.log(data)
        that.setData({
          classifyItems: data.result[0].classifyList
        })
        console.log(that.data.classifyItems)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})