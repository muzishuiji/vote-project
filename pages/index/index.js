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
    app.authJudge(this).then(()=> {
      wx.hideLoading();
    });
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
