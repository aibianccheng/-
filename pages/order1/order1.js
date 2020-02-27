// pages/order1/order1.js
var app = getApp();
var totalMoney=5;
let product=[];
var nopayArr = wx.getStorageSync('nopayArr') || []
Page({

  /**
   * 页面的初始数据
   */
  data: {
     adress1:"请选择收货地址",
     myadress:false,
     orderArr1:"",
  },
onLoad(opt){
  var that = this;  
   totalMoney = opt.totalMoney
  console.log(totalMoney)
},
  //收货地址
  addadress(){
    let that=this
    wx.chooseAddress({
      success(res){
      console.log(res)
      that.setData({
        myadress:true,
        adress1:"收货人："+ res.userName,
        phone:"电话："+ res.telNumber,
        detailInfo: res.detailInfo,
        cityName: res.cityName,
        countyName: res.countyName,
        provinceName:res.provinceName
      })
      }
    })
  },
   //用户留言内容
   getValue(event){
    console.log(event.detail.value)
    var value=event.detail.value
    this.setData({
      value:value,
    })
 },
  //提交订单
  submitOrder(){
    let data={
      name: this.data.adress1,
      phone: this.data.phone,
      address: this.data.provinceName + this.data.cityName + this.data.countyName + this.data.detailInfo,
      openid: this.data.openId,
      orderRemark:this.data.value,
      items:JSON.stringify(product)
 }
  console.log(data)
  if(data.name=="请选择收货地址"||data.phone=="undefined"||data.address=="NaN"){
    wx.showToast({
      title: '请选择电话收货地址',
      icon:"none"
    })
  }else{
    wx.request({
      method:'POST',
      url: 'https://woaixiang.top/order/create',
      data:data,
     //  data:{
     //    name: this.data.adress1,
     //    phone: this.data.phone,
     //    address: this.data.provinceName + this.data.cityName + this.data.countyName + this.data.detailInfo,
     //    openid: this.data.openId,
     //    items: JSON.stringify(product)
     //     product
     //  },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
      },
      success(res) {
       console.log(res.data)
       var orderId=res.data.result.orderID
       // var data1={
       //   orderId:orderId,
       //   returnUrl:'woaixiang.top', 
       // }
       wx.request({
         method:'GET',
         url:'https://woaixiang.top/payTest/createPay?orderId='+orderId,
         header:{
           'content-type':"application/json",
         }, 
         success(res){
          console.log(res)
          console.log(res.data)
            wx.requestPayment({
              timeStamp: res.data.result.timeStamp,
              nonceStr: res.data.result.nonceStr,
              package: res.data.result.package,
              signType: 'MD5',
              paySign: res.data.result.paySign,
              // timeStamp: '',
              // nonceStr: '',
              // package: '',
              // signType: 'MD5',
              // paySign: '',
              success (res) {
                console.log(res)
                  wx.request({
                    method:'POST',
                    url: 'https://woaixiang.top/payTest/notifyPay?orderId='+orderId,
                    header:{
                      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" //post请求设置
                    },success(res){
                       console.log(res) 
                       wx.navigateTo({
                        url: '../../pages/orderlist/orderlist',
                      })
                    }
                  })
               },
              fail (err) {
                console.log(err)
                var objnoPay={
                orderId:orderId,
                timeStamp: res.data.result.timeStamp,
                nonceStr: res.data.result.nonceStr,
                package: res.data.result.package,
                signType: 'MD5',
                paySign: res.data.result.paySign,
                }
                nopayArr.push(objnoPay)
                console.log(nopayArr)
                wx.setStorageSync('nopayArr', nopayArr)
                wx.navigateTo({
                  url: '../../pages/orderlist/orderlist',
                })
               }
            })
         }
       })
     }
    })
  }
  },
  onShow(){
    var orderArr1=app.globalData.orderArr1 
    var openId = wx.getStorageSync('OpenId')
    console.log(orderArr1)
    this.setData({
      orderArr1: orderArr1,
      totalMoney: totalMoney,
      openId: openId,
    })
    console.log(this.data.orderArr1)
    console.log(app.globalData.userInfo)
    product=[];
      var productList={
            standardId:this.data.orderArr1.id,
            productQuantity:this.data.orderArr1.count
      }
      product.push(productList)
    console.log(product)
  }
})