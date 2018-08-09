//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    itemList: [],
    voteMess: {},
    params: {
      page: 1,
      pageSize: 10,
      activityId: null
    },
    id: '',
    hasData: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 加载事件
  onLoad: function (options) {
    let _id = options.id;
    this.setData({
      id: _id
    });
    app.authJudge(this).then(() => {
      this.getDataList(_id);
      this.getItemList(_id);
    }); 
  },
  getDataList: function(_id) {
    wx.showLoading({
      title: '努力加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + 'activity/' + _id, 
      method: 'GET',
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteMess = {};
        wx.hideLoading();
        // console.log(res);
        if(response.data.code == 200) {
          voteMess = response.data.data;
          voteMess.leftTime = app.dealTime(voteMess.signEndTime);
          this.setData({
            voteMess: voteMess
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.log(err);
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  
  getItemList: function (_id) {
    let _param = this.data.params;
    _param.activityId = _id;
    wx.request({
      url: app.globalData.baseUrl + 'activity/item/list', 
      method: 'GET',
      data: _param,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let itemList = this.data.itemList;
        console.log(res);
        wx.hideLoading();
        if(response.data.code == 200) {
          itemList = itemList.concat(response.data.data.records);
          if(itemList.length < this.data.params.pageSize) {
            this.setData({
              itemList: itemList,
              hasData: false
            });
          } else {
            this.setData({
              itemList: itemList,
              hasData: true
            });
          }
          return true;
        }
      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  // 上拉触底加载
  onReachBottom: function () {
    if(this.data.hasData) {
      wx.showLoading({
        title: '努力加载中',
      });
      let _params = this.data.params;
      _params.page++;
      this.setData({
        params: _params
      });
      this.getItemList(this.data.id);
    }
  },
  onShow: function() {
    var that = this;
  },
  openDetail: function() {
    wx.navigateTo({
      url: '../joinItemDetail/joinItemDetail?id=' +  this.data.id + '&title=' + this.data.voteMess.title
    })
  },
  openJoin: function() {
    wx.navigateTo({
      url: '../joinActivity/joinActivity?id=' +  this.data.id + '&title=' + this.data.voteMess.title
    });
  },
  // 报名参加某个投票
  joinInVote: function() {
    wx.navigateTo({
      url: '../joinActivity/joinActivity'
    });
  },
  // 分享
  onShareAppMessage: function(res){
    if(res.from === "button") {
      console.log(res.target);
    } 
    return {
      title: this.data.voteMess.title,
      path: '/pages/normalDetail/normalDetail'
    }
  }
})
