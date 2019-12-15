// pages/home/home.js
const ajax = require('../../utils/ajax.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载banner轮播
    this.bannerShow();
    //加载menu分类导航菜单
    this.menuShow();
  },
  bannerShow: function (success) {
    ajax.request({
      method: 'GET',
      url: 'home/banners',
      success: data => {
        that.setData({
          banners: data.result
        })
        console.log(data.result)
      }
    })
  },
  menuShow: function (success) {
    ajax.request({
      method: 'GET',
      url: 'home/menus',
      success: data => {
        that.setData({
          menus: data.result
        })
        console.log(data.result)
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