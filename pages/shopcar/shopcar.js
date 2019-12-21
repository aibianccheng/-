// pages/shopcar/shopcar.js
var app = getApp();
var orderArr=[];
var orderGoods=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //数据 
    iscart: false,
    hidden: null,
    orderArr:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.info("缓存数据：" + arr);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        isSelect:false,
        carts: arr,
        iscart: true,
        hidden: false,
        isAllSelect: false,
        totalMoney: 0,
      });
      console.info("缓存数据：" + this.data.carts);
    } else {
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
    app.globalData.orderArr=null;
    orderArr = []; 
    console.log(app.globalData.orderArr)
  },

  //勾选事件处理函数  33
  switchSelect: function (e) {
    console.log(e)
    // 获取item项的id，和数组的下标值  
    var allPrice=0, i=0;
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
    //价钱统计
    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
       orderGoods = {
        totalMoney: this.data.carts[index].totalMoney,
        count: this.data.carts[index].count,
        productName: this.data.carts[index].productName,
         productId: this.data.carts[index].productId,
         standardId: this.data.carts[index].id,
        name: this.data.carts[index].name,
        img: this.data.carts[index].imgUrls
      }
      orderArr.push(orderGoods)
      app.globalData.orderArr = orderArr
      // console.log(orderArr)
    }
    else {
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
      for (var i in orderArr){
        if (orderArr[i].name ==this.data.carts[index].name){
          orderArr.splice(i,1)
        }else{
        }
      }
      wx.setStorageSync('orderArr', orderArr)
      app.globalData.orderArr = orderArr
    }
    console.log(app.globalData.orderArr)
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      allPrice = allPrice + (this.data.carts[i].price * this.data.carts[i].count);
    }
    if (allPrice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }
    else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },
  // //全选
  // allSelect: function (e) {
  //   let i = 0;
  //   if (!this.data.isAllSelect) {
  //     this.data.totalMoney = 0;
  //     for (i = 0; i < this.data.carts.length; i++) {
  //       this.data.carts[i].isSelect = true;
  //       this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
  //     }
  //   }
  //   else {
  //     for (i = 0; i < this.data.carts.length; i++) {
  //       this.data.carts[i].isSelect = false;
  //     }
  //     this.data.totalMoney = 0;
  //   }
  //   this.setData({
  //     carts: this.data.carts,
  //     isAllSelect: !this.data.isAllSelect,
  //     totalMoney: this.data.totalMoney,
  //   })
  // }, 
  // 去结算
  notBuy(){
    wx.showToast({
      title: '请选择商品',
    })
  },
  toBuy() {
     wx.navigateTo({
       url: '../../pages/order/order?totalMoney=' + this.data.totalMoney,
     })
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //数量变化处理
  handleQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;
    this.data.carts[componentId].count.quantity = quantity;
    this.setData({
      carts: this.data.carts,
    });
  },
  /* 减数 */
  delCount: function (e) {

    var index = e.target.dataset.index;
    console.log(e);
    var count = this.data.carts[index].count;
    // 商品总数量-1
    if (count > 1) {
      this.data.carts[index].count--;
    } 
    for (let i in orderArr) {
      if (orderArr[i].name == this.data.carts[index].name) {
        orderArr[i].count = this.data.carts[index].count
      }
    }
    console.log(orderArr)
    app.globalData.orderArr = orderArr

    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts,
    });
    console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  /* 加数 */
  addCount: function (e) {
    var index = e.target.dataset.index;
    console.log("刚刚您点击了加+");
    var count = this.data.carts[index].count;
    // 商品总数量+1  
    if (count < 10) {
      this.data.carts[index].count++;
    }
    for(let i in orderArr){
      if (orderArr[i].name == this.data.carts[index].name){
        orderArr[i].count = this.data.carts[index].count
      }
    }
    console.log(orderArr)
    app.globalData.orderArr = orderArr
    // this.setData({
    //   orderArr: this.data.orderArr
    // })
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts,
    });
    this.priceCount();
  },
  priceCount: function (e) {
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  /* 删除item */
  delGoods: function (e) {
    this.data.carts.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();
    } else {
      this.setData({
        cart: this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  }
})