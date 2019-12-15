// pages/detail/detail.js
const ajax = require('../../utils/ajax.js');
var imgUrls = [];
var detailImg = [];
var goodsId = null;
var goods = null;
var standardinfo=null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: ["详情", "评论"],
    currentTab1: 0  ,
    showDialog: false,
    currentTab:0, 
    count:1,
    standardList: [
      {
        name:"洗发露100ml",
        id:1,
  img:"https://img10.360buyimg.com/cms/jfs/t13222/31/322143641/297295/36ff29ef/5a092e14N31a2fc1d.jpg",
        price:"10",
        },
      {
        name: "洗发露200ml",
        id:2,
        img: "https://img30.360buyimg.com/cms/jfs/t13810/21/341016100/292908/f9f11971/5a092e2bN72b8e545.jpg",
        price: "20",
      },
      {
        name: "洗发露300ml",
        id:3,
        img: "https://img10.360buyimg.com/cms/jfs/t11983/28/1638381672/299150/6137b604/5a092e30N86144004.jpg",
        price: "30",
      },
      {
        name: "洗发露400ml",
        id:4,
        img: "https://img12.360buyimg.com/cms/jfs/t11152/80/1762432924/301645/40cf6a4a/5a092e33N8f261509.jpg",
        price: "40",
      },
        ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    productId = options.productId
    that.productInfo()
  },
  // 详情评论点击切换
  show(even) {
    this.setData({
      currentTab: even.currentTarget.dataset.idx
    })
    const id = even.currentTarget.dataset.id
    console.log(id)
    if (id == "详情") {
      this.setData({
        xiangqing: true,
        pinglun: false
      })
    } else {
      this.setData({
        pinglun: true,
        xiangqing: false
      })
    }
  },
  productInfo(res){
    ajax.request({
      method:'GET',
      url: 'product/productInfo?product_id=' + productId,
      success(res){
        var goodsItem = data.result;
        for (var i = 0; i < goodsItem.productImg.length; i++) {
          imgUrls[i] = goodsItem.productImg[i];
        }
        var details = goodsItem.productDetailsimg.split(";");
        for (var j = 0; j < details.length; j++) {
          detailImg[j] = details[j];
        }
        goods = {
          imgUrls: imgUrls,
          title: goodsItem.productName,
          price: goodsItem.productPrice,
          privilegePrice: goodsItem.productPreprice,
          detailImg: detailImg,
        }
        that.setData({
          goods: goods
        })
        console.log(goods.title)
      }
    })
  },
  standardSelect(e){
      console.log(e)
      this.setData({
        currentTab1: e.currentTarget.dataset.index,
        id: e.currentTarget.dataset.id,
        imgUrls: e.currentTarget.dataset.img,
        name: e.currentTarget.dataset.name,
        price: e.currentTarget.dataset.price,
        totalMoney: e.currentTarget.dataset.price
      })
    standardinfo = {
      id: this.data.id,
      imgUrls: this.data.imgUrls,
      name: this.data.name,
      price: this.data.price,
      count: 1,
      totalMoney: this.data.totalMoney
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
  /**
   * sku 关闭
   */
  closeDialog: function () {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },
  /* 减数 */
  delCount(even) {
    console.log(even)
    if (this.data.count > 1) {
      this.setData({
        count: this.data.count - 1
      })
    } else {
      wx.showToast({
        title: '亲不能再少啦',
      })
    }

  },
  addCount(even) {
    console.log(even)
    if (this.data.count < 10) {
      this.setData({
        count: this.data.count + 1
      })
    } else {
      wx.showToast({
        title: '只能限购10件哦',
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

    var name = this.data.name;
    if (name.length > 13) {
      standardinfo.name = name.substring(0, 13) + '...';
    }

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.log("arr,{}", arr);
    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].id == this.data.id) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          //关闭窗口
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
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
        icon: 'success',
        duration: 2000
      });
      this.closeDialog();
      return;
    } catch (e) {
      console.log(e)
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