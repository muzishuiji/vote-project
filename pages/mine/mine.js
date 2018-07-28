//min.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    activeIndex: "1",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    createList: [],
    joinList: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 打开投票详情页
  openDetail:function(e) {
      let index = e.currentTarget.dataset.index, 
          that = this, 
          _id = e.currentTarget.dataset.id,
          sign = e.currentTarget.dataset.name;
      app.globalData.vote = sign == "1" ? this.data.createList[index] : this.data.joinList[index];
      app.globalData._id = _id;
      wx.navigateTo({
        url: '../../pages/vote/voteDetail'
      });    
  },
  // 切换tab
  changeTab(e) {
    // console.log(e.target.dataset)
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo
    });
    
    this.getDataList();
    
  },
  getDataList: function() {
    var nickName = this.data.userInfo.nickName;
    // 获取我参与的投票列表
    wx.request({
      url: app.globalData.baseUrl + 'joinVote', 
      method: 'GET',
      header: {
      'content-type': 'application/json'
      },
      data: {nickName: nickName},
      success: (res) => {
        var joinList = res.data.data || [];
        joinList.forEach(function (item, index) {
          item.leftTime = app.dealTime(item.deadline);
        }); 
        this.setData({
          joinList: joinList
        });
        return true;
      },
      fail: function(err) {
        console.log(err);
        return false;
      }
    });
    // 获取我发起的投票列表
    wx.request({
      url: app.globalData.baseUrl + 'myVote', 
      method: 'GET',
      header: {
      'content-type': 'application/json'
      },
      data: {nickName: nickName},
      success: (res) => {
        var createList = res.data.data || [];
        createList.forEach(function (item, index) {
          item.leftTime = app.dealTime(item.deadline);
        });    
        this.setData({
          createList: createList
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
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    this.getDataList();
  }
})
