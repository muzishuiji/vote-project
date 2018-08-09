//voteDetail.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    voteMess: {},
    itemList: [],
    id: '',
    hasData: true,
    params: {
      page: 1,
      pageSize: 10,
      activityId: null
    },
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 加载事件
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中',
    });
    let _id = options.id;
    this.setData({
      id: _id
    });
    app.authJudge(this).then(() => {
      this.getDataList(_id);
      this.getItemList(_id);
    });
  },
  onShow: function () {
    wx.request({
      url: app.globalData.baseUrl + 'activity/item/list', 
      method: 'GET',
      data: this.data.params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let itemList = [];
        wx.hideLoading();
        if(response.data.code == 200) {
          itemList = response.data.data.records;
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
      fail: (err) =>  {
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
  // 获取投票详情
  getDataList: function(_id) {
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
        // console.log(res);
        wx.hideLoading();
        if(response.data.code == 200) {
          voteMess = response.data.data;
          voteMess.leftTime = app.dealTime(voteMess.electEndTime);
          this.setData({
            voteMess: voteMess
          });
        }
        return true;
      },
      fail: function(err) {
        // console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  // 获取投票参与者列表
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
      fail: (err) =>  {
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
  openDetail: function(e) {
    if(this.data.voteMess.leftTime == "投票截止") {
      wx.showToast({
        title: '投票已截止',
        icon: "none"
      });
      return false;
    }
    let _id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../voteItemDetail/voteItemDetail?id=' +  this.data.id + '&title=' + this.data.voteMess.title + '&paiming=' + index + '&itemId=' + _id
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
