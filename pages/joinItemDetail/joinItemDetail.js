//index.js
//获取应用实例 
const app = getApp();

Page({ 
  data: {
    activityName: '',
    voteMess: {},
    id: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 
  // 加载事件
  onLoad: function (options) {
    app.authJudge(this);
    let _id = options.id;
    let title = options.title;
    this.setData({
      activityName: title,
      id: _id
    })
    this.getData(_id);
  }, 
  getData: function(_id) {
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
        // console.log(res);
        wx.hideLoading();
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
  onShow: function() {
    var that = this;
  }
})
