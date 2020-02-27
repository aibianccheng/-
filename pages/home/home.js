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
    // 加载每日推荐商品
    this.recommendShow();
  },
  bannerShow: function (success) {
    ajax.request({
      method: 'GET',
      url: 'wxShop/home/banners',
      success: res => {
        this.setData({
          banners: res.result
        })
        console.log(res)  
      }
    })
  },
  menuShow: function (success) {
    let that=this;
    ajax.request({
      method: 'GET',
      url: 'wxShop/home/menus',
      success: data => {
        that.setData({
          menus: data.result
        })
        console.log(data.result)
      }
    })
  },
  getMenus(event){
    var index=event.currentTarget.dataset.index
    if(index==0){
      wx.navigateTo({
        url: '../../pages/classify/classify',
      })
    }else{
      wx.showToast({
        title: '该功能尚未开放！',
      })
    }
  },
  recommendShow: function (success) {
    var that=this
    ajax.request({
      url:'product/productIsHot',
      success(res){
         console.log(res)
         that.setData({
          recommend:res.result 
         }) 
      }
    })
  },
  //每日推荐跳转详情页
  goDetail(event){
    var productId=event.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../../pages/detail/detail?productId='+productId,
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