// pages/mine/mine.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '已完成',
        url: 'bill',
        imageurl: '../../images/person/personal_comment.png'
      },
      {
        typeId: 3,
        name: '退换/售后',
        url: 'bill',
        imageurl: '../../images/person/personal_service.png'
      }
    ],
  },
  lianxi(){
    wx.makePhoneCall({
      phoneNumber: '13124971318',
    })
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../orderlist/orderlist'
    })
  },
  onLoad: function () {
   
  },
  onShow(){
    var openId=wx.getStorageSync('OpenId')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo)
      wx.request({
        method:'POST',
        url: 'https://woaixiang.top/user/message?userName='+this.data.userInfo.nickName+'&userOpenid='+openId+'&userImg='+this.data.userInfo.avatarUrl,
        header:{
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
        },
        success(res){
          console.log(res)
        }
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          const app = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  myAddress: function (e) {
    wx.navigateTo({ url: '../addressList/addressList' });
  },
  moregn(){
    wx.showToast({
      title: '敬请关注',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})