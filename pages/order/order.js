var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     adress1:"请选择收获地址",
     myadress:false
  },
onLoad(opt){
  console.log(opt.adressDetail)
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
  }
})