//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '1',
    tabActive: 'new',
    mine: "mine",
    new: "new",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    voteList: [],
    isUpdate: false,
    hasUserInfo: false,
    rotateSign: false,
  },
  hideModal:function(e) {
    if(e.detail) {
      this.setData({
        hasUserInfo: false
      });
      wx.showToast({
        title: '授权成功',
        icon: "success"
      });
    }
  },
  // 加载事件
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: false
      });
      console.log("111");
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        if(res.authSetting) {
          this.setData({
            hasUserInfo: true
          });
          console.log(this.data.hasUserInfo)
        } else {
          this.setData({
            hasUserInfo: false
          });
        }
      }
      console.log("222");
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: false
          });
        }
      })
      console.log("333");
    }
    
  },
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  // 创建投票
  openNew: function (e) {
    var sign = e.currentTarget.dataset.id;
    if(sign == "1") {
      wx.navigateTo({
        url: '../../pages/newNormal/newNormal'
      });
    } else {
      wx.navigateTo({
        url: '../../pages/newActivity/newActivity'
      });
    }
  },
  // 打开投票列表
  openList: function(e) {
    var sign = e.currentTarget.dataset.id;
    if(sign == "1") {
      wx.navigateTo({
        url: '../../pages/normal/normal'
      });
    } else {
      wx.navigateTo({
        url: '../../pages/activity/activity'
      });
    }
  },
  getCode: function () {
     // 登录
     wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // appid: wx4a96dbab66a34495
        // appSecret:00dff3bcddf0896db2f86631ebf2bfde
        console.log(res.code);


      }
    })
  }
})
