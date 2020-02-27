// pages/orderDetail/orderDetail.js
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
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var that=this
    var orderId=options.orderId
    console.log(orderId)
    var openId = wx.getStorageSync('OpenId')
    ajax.request({
      url:'order/orderDetail?openid='+openId+"&orderId="+orderId,
      success(res){
        console.log(res.result)
        if(res.result.payStatus==0&&res.result.orderStatus==0&&res.result.orderRefund==0){
          that.setData({
          status:"待付款"
         })
       }
       else if(res.result.orderStatus==0 && res.result.payStatus==1&&res.result.orderRefund==0){
          that.setData({
          status:"待收货"
         })
       }else if(res.result.orderStatus==1&&res.result.orderRefund==0){
          that.setData({
          status:"交易成功"
         })
       }else if(res.result.orderRefund==1&&res.result.orderStatus==0){
          that.setData({
          status:"退款中"
         })
       }else{
          that.setData({
          status:"订单已取消"
         })
       }
        var time=new Date(res.result.createTime)//把时间数字串转成年月日
        var year = time.getFullYear(); //获取年份
        var month = time.getMonth()+1; //获取月份 月份要+1
        var date = time.getDate(); //获取日期
        var hour = time.getHours(); //获取时
        var min= time.getMinutes(); //获取分钟
        if(year<10){
          year="0"+year
        }else{}
        if(month<10){
          month="0"+month
        }else{}
        if(date<10){
          date="0"+date
        }else{}
        if(hour<10){
          hour="0"+hour
        }else{}
        if(min<10){
          min="0"+min
        }else{}
        that.setData({
          orderDetail:res.result,
          createTime:year+"-"+month+"-"+date+"-"+hour+":"+min,
        })
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