// const ajax = require('../../utils/ajax.js');
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
     orderArr:"",
     switch:"",
     switch1:"",
  },
onLoad(opt){
  var that = this;  
   totalMoney = opt.totalMoney
  console.log(totalMoney)
},
switch(){
  if(this.data.switch=="展开更多"){
    this.setData({
      switch:"点击收起"
    })
  }else{
    this.setData({
      switch:"展开更多"
    })
  }
  this.setData({
    switch2:!this.data.switch2
  })
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
    var orderArr=app.globalData.orderArr 
    console.log(orderArr)
    var orderArr1=wx.getStorageSync('cart')
    for(let i in orderArr){
      for(let o in orderArr1){
        if(orderArr1[o].id==orderArr[i].standardId){
          orderArr1.splice(o,1)
        }
      }
    }
    wx.setStorageSync('cart', orderArr1)
    let data={
      name: this.data.adress1,
      phone: this.data.phone,
      address: this.data.provinceName + this.data.cityName + this.data.countyName + this.data.detailInfo,
      openid: this.data.openId,
      orderRemark:this.data.value,
      items:JSON.stringify(product)
 }
  console.log(data)
  if(data.name=="请选择收货地址"|| data.phone=="undefined"||data.address=="NaN"){
    wx.showToast({
      title: '请选择收货电话地址',
      icon:"none",
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
         url:'https://woaixiang.top/payTest/createPay?orderId='+orderId+'&returnUrl=woaixiang.top',
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
    var orderArr=app.globalData.orderArr 
    var openId = wx.getStorageSync('OpenId')
    console.log(openId)
    this.setData({
      orderArr: orderArr,
      totalMoney: totalMoney,
      openId: openId,
    })
    console.log(this.data.orderArr)
    console.log(app.globalData.userInfo)
    product=[];
    for (let i in this.data.orderArr){
      var productList={
            standardId:this.data.orderArr[i].standardId,
            productQuantity:this.data.orderArr[i].count
      }
      product.push(productList)
    }
    if(orderArr.length>1){
      this.setData({
        switch:"展开更多",
        switch1:true,
        switch2:false,
        orderArr1:orderArr[0]
      })
      console.log(this.data.orderArr1)
    }else{
      this.setData({
        switch1:false,
        switch2:true,
      })
    }
    // console.log(product)
  }
})