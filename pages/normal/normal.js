//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    tabActive: 'new',
    mine: "mine",
    new: "new",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    voteList: [],
    isUpdate: false,
    hasUserInfo: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: false
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: false
        });
      }
      
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
    }
    
  },
  onShow: function() {
    var that = this;
      // 请求投票信息的数据
    wx.request({
      url: app.globalData.baseUrl + 'voteList', 
      method: 'GET',
      header: {
      'content-type': 'application/json'
      },
      success: function(res) {
        var voteList = res.data.data || [];
        if(voteList.length != 0) {
          voteList.forEach(function (item, index) {
            item.leftTime = app.dealTime(item.deadline);
          });
        }
        that.setData({
          voteList: voteList
        });
        return true;
      },
      fail: function(err) {
        console.log(err);
        return false;
      }
    });
  },
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  // 获取投票详情
  openDetail:function(e) {
    if (app.globalData.userInfo) {
      let index = e.currentTarget.dataset.index, that = this, _id = e.currentTarget.dataset.id;
      app.globalData.vote = this.data.voteList[index];
      app.globalData._id = _id;
      wx.navigateTo({
        url: '../../pages/vote/voteDetail'
      });
    } else {
      wx.showToast({
        title: '你还未进行微信授权,请前往我的页面完成微信授权',
        icon: "none",
        success: function(res) {
           wx.navigateTo({
            url: '../../pages/mine/mine'
          });
        }
      });
    }
    
  },
  // 切换tab
  changeSwitch: function (e) {
    // console.log(e.target.dataset);
    this.setData({
      tabActive: e.target.dataset.name
    })
  }
})
