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
    wx.setNavigationBarTitle({
      title: '我的购物车'
    })
  },
  onShow: function () {
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr= wx.getStorageSync('cart') || [];
    var arr1=[]
    for(let i =arr.length - 1; i >= 0; i--){
      arr[i].totalMoney1=this.mul(arr[i].price,arr[i].count)
      arr1[arr1.length]=arr[i]
      // arr1[arr1.length].totalMoney=arr1[arr1.length].price*arr1[arr1.length].count
    }
    console.log(arr1);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        isSelect:false,
        carts: arr1,
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
  //  去抢购跳转到首页
  goHome(){
    wx.switchTab({
      url: '../../pages/home/home',
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
      this.data.totalMoney =(this.data.totalMoney*100000000 + (this.data.carts[index].price *100000000* this.data.carts[index].count))/100000000;       //原代码------
      // this.data.totalMoney += this.data.carts[index].totalMoney1
      console.log(this.data.totalMoney)
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
      // this.data.totalMoney =(this.data.totalMoney*100000000 - (this.data.carts[index].price*100000000 * this.data.carts[index].count))/100000000;    //原代码----
      this.data.totalMoney =this.data.totalMoney -this.data.carts[index].totalMoney1
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
      // allPrice =(allPrice*100000000+(this.data.carts[i].price *100000000* this.data.carts[i].count))/100000000;  //原代码
      allPrice =allPrice+this.data.carts[i].totalMoney1;
    }
    if (allPrice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }
    else {
      // this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: Number(this.data.totalMoney).toFixed(2),
      isAllSelect: this.data.isAllSelect,
    })
  },
  //全选
  allSelect: function (e) {
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      if (orderArr.length>0){
        orderArr=[]
        for (i = 0; i < this.data.carts.length; i++) {
          this.data.carts[i].isSelect = true;
          // this.data.totalMoney =(this.data.totalMoney*100000000 + (this.data.carts[i].price *100000000* this.data.carts[i].count))/100000000;      //原代码------
          this.data.totalMoney =this.data.totalMoney +this.data.carts[i].totalMoney1;
          orderGoods = {
            totalMoney: this.data.carts[i].totalMoney,
            count: this.data.carts[i].count,
            productName: this.data.carts[i].productName,
            productId: this.data.carts[i].productId,
            standardId: this.data.carts[i].id,
            name: this.data.carts[i].name,
            img: this.data.carts[i].imgUrls
          }
          orderArr.push(orderGoods)
        }
      }else{
        for (i = 0; i < this.data.carts.length; i++) {
          this.data.carts[i].isSelect = true;
          // this.data.totalMoney =(this.data.totalMoney*100000000 + (this.data.carts[i].price *100000000* this.data.carts[i].count))/100000000;         //原代码
          this.data.totalMoney =this.data.totalMoney +this.data.carts[i].totalMoney1;
          orderGoods = {
            totalMoney: this.data.carts[i].totalMoney,
            count: this.data.carts[i].count,
            productName: this.data.carts[i].productName,
            productId: this.data.carts[i].productId,
            standardId: this.data.carts[i].id,
            name: this.data.carts[i].name,
            img: this.data.carts[i].imgUrls
          }
          orderArr.push(orderGoods)
        }
      }
      app.globalData.orderArr = orderArr
      console.log(orderArr)
    }
    else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
      orderArr=[];
      console.log(orderArr)
      app.globalData.orderArr=[];
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: Number(this.data.totalMoney).toFixed(2),
    })
  }, 
  // 去结算
  toBuy() {
      if(orderArr.length>0){
        wx.navigateTo({
       url: '../../pages/order/order?totalMoney=' + this.data.totalMoney,
     })
      }else{
        wx.showToast({
          title: '您还没有选择商品哦！',
          icon: 'none',
        })
      }
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
      this.data.carts[index].totalMoney1=this.mul(this.data.carts[index].price,this.data.carts[index].count)
    } else{
      wx.showToast({
        title: '亲不能再少了',
        icon: 'none',
      })
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
    if (count < this.data.carts[index].stock) {
      this.data.carts[index].count++;
      this.data.carts[index].totalMoney1=this.mul(this.data.carts[index].price,this.data.carts[index].count)
    }else{
      wx.showToast({
        title: '库存不足啦',
      })
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
        this.data.totalMoney =( this.data.totalMoney*100000000 + (this.data.carts[i].price * this.data.carts[i].count)*100000000)/100000000;
      }

    }
    this.setData({
      totalMoney:  Number(this.data.totalMoney).toFixed(2),
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
      var Arr2=[]
      for(let i = this.data.carts.length - 1; i >= 0; i--){
        Arr2[Arr2.length]=this.data.carts[i]
      }
      wx.setStorageSync('cart', Arr2);
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