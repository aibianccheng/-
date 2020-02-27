// pages/orderlist/orderlist.js
var app=getApp()
const ajax = require('../../utils/ajax.js');
var orderDetailList=[];
Page({
  /**
   * 页面的初始数据
   */
  data: {
   orderSort:["待付款","待完成","已完成","售后","已取消"],
  },
  //顶部订单状态栏切换
  switch(e){
     this.setData({
       current: e.currentTarget.dataset.index,
       name: e.currentTarget.dataset.name
     })
     if(this.data.name=="待付款"){
       this.setData({
         noPay:true,
         noFinish:false,
         finish:false,
         afterService:false,
         cancelOrder:false
       })
     } else if (this.data.name =="待完成"){
       this.setData({
         noPay: false,
         noFinish: true,
         finish: false,
         afterService: false,
         cancelOrder:false
       })
     } else if (this.data.name =="已完成"){
       this.setData({
         noPay: false,
         noFinish: false,
         finish: true,
         afterService: false,
         cancelOrder:false,
       })
     } else if(this.data.name=="售后"){
       this.setData({
         noPay: false,
         noFinish: false,
         finish: false,
         afterService: true,
         cancelOrder:false,
       })
     }else{
      this.setData({
        noPay: false,
        noFinish: false,
        finish: false,
        afterService: false,
        cancelOrder:true,
      })
     }
  },
  
  // 查看详情
  lookDetail(event){
    console.log(event.currentTarget.dataset.orderid)
    var orderId=event.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../../pages/orderDetail/orderDetail?orderId='+orderId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的订单'
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
    var that=this;
    var openId = wx.getStorageSync('OpenId')
    console.log(openId)
    //订单列表的请求
   ajax.request({
     url:'order/orderList?openid='+openId+'&page&size=10000',
     success(res){
      console.log(res.result)
      that.setData({
        orderList:res.result
      })
      var orderDetailList=[]
      for(let i = that.data.orderList.length - 1; i >= 0; i--){
        orderDetailList[orderDetailList.length]=that.data.orderList[i]
      }
      console.log(orderDetailList)
      //循环遍历订单列表orderId，作为参数请求订单详情数组对象，把对象全部扔进orderDetailList数组以便页面显示
      var nopayArr=[]
      var payArr=[]
      var finishArr=[]
      var serviceArr=[]
      var cancelArr=[]
      for(let i in orderDetailList){
        ajax.request({
          url:'order/orderDetail?openid='+openId+"&orderId="+orderDetailList[i].orderId,
          success(res){
            // console.log(res.result)
            if(res.result.payStatus==0&&res.result.orderStatus==0&&res.result.orderRefund==0){
              nopayArr.push(res.result)
           }
           else if(res.result.orderStatus==0 && res.result.payStatus==1&&res.result.orderRefund==0){
              payArr.push(res.result)
           }else if(res.result.orderStatus==1&&res.result.orderRefund==0){
              finishArr.push(res.result)
           }else if(res.result.orderRefund==1&&res.result.orderStatus==0){
            serviceArr.push(res.result)
           }else{
            cancelArr.push(res.result)
           }
          //  var finishArr1=[]
          //  var serviceArr1=[]
          //  var cancelArr1=[]
          //  for(let i = finishArr.length - 1; i >= 0; i--){
          //   finishArr1[finishArr1.length]=finishArr[i]
          //   }
          //   for(let i = serviceArr.length - 1; i >= 0; i--){
          //     serviceArr1[serviceArr1.length]=serviceArr[i]
          //       }
          //  for(let i = cancelArr.length - 1; i >= 0; i--){
          //   cancelArr1[cancelArr1.length]=cancelArr[i]
          //     }
           that.setData({
            nopayArr,
            payArr,
            finishArr:finishArr,
            serviceArr:serviceArr,
            cancelArr:cancelArr,
           })
          //  console.log(that.data.nopayArr,that.data.payArr)
           if(orderDetailList[0].payStatus==0&&orderDetailList[0].orderRefund==0){
            that.setData({
              current:0,
              noPay:true,
              noFinish:false,
              finish: false,
              afterService: false,
              cancelOrder:false,
            })
          }else if(orderDetailList[0].payStatus==1&&orderDetailList[0].orderRefund==0){
            that.setData({
              current:1,
              noPay:false,
              noFinish:true,
              finish: false,
              afterService: false,
              cancelOrder:false,
            })
          }else{
            that.setData({
              current:2,
              noPay:false,
              noFinish:false,
              finish: true,
              afterService: false,
              cancelOrder:false,
            })
          }
          }
        })
      }
    }
   })
  },
  // 订单未付款的去付款
  goPay(event){
    var that=this
    var orderId=event.currentTarget.dataset.orderid
    console.log(orderId)
    var nopayArr1=wx.getStorageSync('nopayArr')
    for(var i in nopayArr1){
      if(nopayArr1[i].orderId==orderId){
        wx.requestPayment({
          timeStamp: nopayArr1[i].timeStamp,
          nonceStr: nopayArr1[i].nonceStr,
          package: nopayArr1[i].package,
          signType: 'MD5',
          paySign: nopayArr1[i].paySign,
          // timeStamp: '',
          // nonceStr: '',
          // package: '',
          // signType: 'MD5',
          // paySign: '',
          success (res) {
            // console.log(res)
              wx.request({
                method:'POST',
                url: 'https://woaixiang.top/payTest/notifyPay?orderId='+orderId,
                header:{
                  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
                },success(res){
                  //  console.log(res) 
                   that.show()
                }
              })
           },
          fail (err) {
            console.log(err)
           }
        })
      }
    }
    this.onShow()
  },
  // 确认收货
  shouhuo(event){
    var orderId=event.currentTarget.dataset.orderid
    var openId=wx.getStorageSync('OpenId')
    wx.request({
      method:'POST',
      url: 'https://woaixiang.top/order/finish?openid='+openId+'&orderId='+orderId,
      header:{
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
      },success(res){
        console.log(res)
      },
      fail(err){}
    })
    this.onShow()
  },
  // 取消订单
  cancelOrder(event){
    var that=this
    var orderId=event.currentTarget.dataset.orderid
    var openId=wx.getStorageSync('OpenId')
    wx.showModal({
      title: '提示',
      content: '您确认取消订单吗',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
              wx.request({
                 method:'POST',
                 url: 'https://woaixiang.top/order/cancel?openid='+openId+'&orderId='+orderId,
                 header:{
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
                    },success(res){
                         console.log(res)
                         that.onShow()
                   },fail(err){}
                    })
                  }
                }
              })
  },
  // 退款
  refund(event){
    var that=this
    var orderId=event.currentTarget.dataset.orderid
    var openId=wx.getStorageSync('OpenId')
    wx.showModal({
      title: '提示',
      content: '您确认退款吗',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              method:'POST',
              url: 'https://woaixiang.top/order/refund?openid='+openId+'&orderId='+orderId,
              header:{
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
              },success(res){
                console.log(res)
                that.onShow()
              },
              fail(err){}
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
      }
    })
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