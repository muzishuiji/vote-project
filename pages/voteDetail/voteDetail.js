//voteDetail.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    voteMess: {},
    itemList: [],
    id: '',
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
    let _id = options.id;
    this.setData({
      id: _id
    });
    this.getDataList(_id);
    this.getItemList(_id);
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
        if(response.data.code == 200) {
          voteMess = response.data.data;
          voteMess.leftTime = app.dealTime(voteMess.signEndTime);
          this.setData({
            voteMess: voteMess
          });
        }
      },
      fail: function(err) {
        console.log(err);
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
        let itemList = [];
        console.log(res);
        if(response.data.code == 200) {
          itemList = response.data.data.records;
          this.setData({
            itemList: itemList
          });
        }
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  onShow: function() {
    var that = this;
  },
  openDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../voteItemDetail/voteItemDetail?id=' +  this.data.id + '&title=' + this.data.voteMess.title + '&paiming=' + index
    });
  }
})
