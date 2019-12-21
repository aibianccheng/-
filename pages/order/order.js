var app = getApp();
var totalMoney=5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     adress1:"请选择收获地址",
     myadress:false,
     orderArr:"",
  },
onLoad(opt){
   totalMoney = opt.totalMoney
  console.log(totalMoney)
},
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
        provinceName:"地址："+res.provinceName
      })
      }
    })
  },
  //提交订单
  submitOrder(){
   wx.request({
     method:'POST',
     url: 'https://woaixiang.top/order/create',
     data:{
       name: this.data.adress1,
       phone: this.data.phone,
       address: this.data.provinceName + this.data.cityName + this.data.countyName + this.data.detailInfo,
       product:[ 
         {
           productId:"",
           standard: [
             {
               standardId: "",
               quantity: ""
             }
           ]
         }
       ]
     },
     header: {
       "Content-Type": "application/ x - www - form - urlencoded" //post请求设置
     },
   })
  },
  onShow(){
    var orderArr=app.globalData.orderArr 
    this.setData({
      orderArr: orderArr,
      totalMoney: totalMoney
    })
    console.log(this.data.orderArr)
    console.log(app.globalData.userInfo)
  }
})