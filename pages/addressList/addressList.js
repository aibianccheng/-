// pages/addressList/addressList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr = wx.getStorageSync('addressList') || [];
    console.info("缓存数据：" + arr);
    // 更新数据  
    this.setData({
      addressList: arr
    });
  },
  getdetail(e){
    let that=this
    console.log(e.currentTarget.dataset)
    const adressDetail = [e.currentTarget.dataset.adress, e.currentTarget.dataset.name, e.currentTarget.dataset.phone]
   wx.navigateTo({
     url: '../../pages/order/order?adressDetail=' + adressDetail
   })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },
  addAddress:function(){
    wx.navigateTo({ url: '../address/address' });
  },
  /* 删除item */
  delAddress: function (e) {
    this.data.addressList.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.addressList.length > 0) {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    } else {
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', []);
    }
  }

})