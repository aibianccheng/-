// pages/detail/detail.js
var app=getApp();
const ajax = require('../../utils/ajax.js');
var imgUrls = [];
var detailImg = [];
var goodsId = null;
var goods = null;
var standardinfo={};
var productId=null;
var standardList=null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: ["商品详情", "评价"],
    xiangqing: true,
    currentTab1: null,
    showDialog: false,
    showDialog1:false,
    currentTab:0, 
    count:1,
    standardList:"",
    switch:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
     productId = opt.productId;
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
  },
  // 详情评论点击切换
  show(even) {
    this.setData({
      currentTab: even.currentTarget.dataset.idx
    })
    const id = even.currentTarget.dataset.id
    console.log(id)
    if (id == "商品详情") {
      this.setData({
        xiangqing: true,
        pinglun: false,
        switch:true,
      })
    } else {
      this.setData({
        pinglun: true,
        xiangqing: false
      })
    }
  },
  // 获取商品详情页
  productInfo(res){
    let that=this;
    ajax.request({
      method:'GET',
      url: 'product/productInfo?productId=' + productId ,
      success(res){
        console.log(res)
        var goodsItem = res.result;
        standardList = goodsItem.standardList;
        var productImg=goodsItem.productImg.split(";");//把一个字符串以分号分割成数组
        for (var i = 0; i < productImg.length; i++) {
          imgUrls[i] = productImg[i];
        }
        var details = goodsItem.productImg.split(";");//把一个字符串以分号分割成数组
        for (var j = 0; j < details.length; j++) {
          detailImg[j] = details[j]; 
        }
        goods = {
          imgUrls: imgUrls,
          title: goodsItem.productName,
          price: goodsItem.productPrice,
          privilegePrice: goodsItem.productPreprice,
          sellAmount: goodsItem.sellAmount,
          detailImg: detailImg,
        }
        that.setData({
          goods: goods,
          imgUrls: imgUrls,
          detailImg: detailImg,
          productName: goodsItem.productName,
          productId: goodsItem.productId,
          standardList: standardList,
        })
        console.log(goods.title)
        console.log(that.data.standardList)
      }
    })
  },
  //js乘法运算精确函数
  mul(arg1, arg2) {  
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
    try {  
        m += s1.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        m += s2.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
},
  //放大预览图片
  preview(event){
     console.log(event.currentTarget.dataset.src)
     var previewImage=event.currentTarget.dataset.src
     wx.previewImage({
       urls: [event.currentTarget.dataset.src],
       current:event.currentTarget.dataset.src,
       success(res){
         console.log(res)
       }
     })
  },
  // 规格选择
  standardSelect(e){
      console.log(e)
      this.setData({
        stock: e.currentTarget.dataset.stock,
        currentTab1: e.currentTarget.dataset.index,
        id: e.currentTarget.dataset.id,
        image: e.currentTarget.dataset.img,
        name: e.currentTarget.dataset.name,
        price: e.currentTarget.dataset.price,
        totalMoney: e.currentTarget.dataset.price 
      })
    standardinfo = {
      id: this.data.id,
      imgUrls: this.data.image,
      productName: this.data.productName,
      productId: this.data.productId,
      name: this.data.name,
      price: this.data.price,
      stock: this.data.stock,
      totalMoney:this.data.totalMoney, 
      count: this.data.count,
    }
  },
  // 跳到首页
  tohome(){
    wx.switchTab({
      url: '../../pages/home/home',
    })
  },
  // 跳到我的购物车
  tocar(){
    wx.switchTab({
      url: '../../pages/shopcar/shopcar',
    })
  },
  /**
   * sku 弹出
   */
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  toggleDialog1: function () {
    this.setData({
      showDialog1: !this.data.showDialog1
    });
  },
  /**
   * sku 关闭
   */
  closeDialog: function () {
    console.info("关闭");
    this.setData({
      showDialog: false,
      showDialog1:false
    });
  },
  /* 减数 */
  delCount(even) {
    console.log(even)
    if (this.data.count > 1) {
      this.setData({
        count: this.data.count - 1,
      })
      standardinfo.count = this.data.count
    } else {
      wx.showToast({
        title: '亲不能再少啦',
      })
    }

  },
  // 加数
  addCount(even) {
    console.log(even)
    if (this.data.count <this.data.stock ) {
      this.setData({
        count: this.data.count + 1,
      })
      standardinfo.count=this.data.count
    } else {
      wx.showToast({
        title: '库存不足啦',
      })
    }
  },
  //价格计算
  priceCount: function (e) {
    this.data.standardinfo.totalMoney = this.data.standardinfo.price * this.data.standardinfo.count;
    // this.setData({
    //   goods: this.data.goods
    // })
  },
  /**
   * 加入购物车
   */
  addCar: function (e) {
    var standardList = this.data.standardList;
    var count = this.data.count;

    // var name = this.data.name;
    // if (name.length > 13) {
    //   standardinfo.name = name.substring(0, 13) + '...';
    // }

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    if (standardinfo.productId == this.data.productId){
      var arr = wx.getStorageSync('cart') || [];
      console.log("arr,{}", arr);
      if (arr.length > 0) {
        // 遍历购物车数组  
        for (var j in arr) {
          // 判断购物车内的item的id，和事件传递过来的id，是否相等  
          if (arr[j].id == this.data.id) {
            // 相等的话，给count+1（即再次添加入购物车，数量增加）  
            arr[j].count = arr[j].count + this.data.count;
            // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
            try {
              wx.setStorageSync('cart', arr)
            } catch (e) {
              console.log(e)
            }
            //关闭窗口
            wx.showToast({
              title: '加入购物车成功！',
              icon: 'none',
              duration: 2000
            });
            this.closeDialog();
            // 返回（在if内使用return，跳出循环节约运算，节约性能） 
            return;
          }
        }
        // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
        arr.push(standardinfo);
      } else {
        arr.push(standardinfo);
      }
      // 最后，把购物车数据，存放入缓存  
      try {
        wx.setStorageSync('cart', arr)
        // 返回（在if内使用return，跳出循环节约运算，节约性能） 
        //关闭窗口
        wx.showToast({
          title: '加入购物车成功！',
          icon: 'none',
          duration: 2000
        });
        this.closeDialog();
        return;
      } catch (e) {
        console.log(e)
      }
    }else{
      wx.showToast({
        title: '请选择商品规格',
      })
    }
  },
  // 立即购买
  toBuy(){
    if (standardinfo.productId==this.data.productId){
      app.globalData.orderArr1 = standardinfo
      wx.navigateTo({
        url: '../../pages/order1/order1',
      })
    }else{
      wx.showToast({
        title: '请选择商品规格',
      })
    }
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
    let that = this;
    that.productInfo()
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