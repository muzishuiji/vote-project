//index.js
//获取应用实例 
const app = getApp();

Page({ 
  data: {
    activityName: ' 最美亲子照评选活动',
    voteMess: {
      imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
      nickName: "认真的雪",
      address: "浙江 温州",
      deadline: 1535155200000,
      voteNum: 223,
      title: "异性时间投票",
      voteType: "1"
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 
  // 加载事件
  onLoad: function (options) {
    let voteList = this.data.voteList;
    let _id = options.id;
  
  }, 
  onShow: function() {
    var that = this;
    // 请求投票信息的数据
    // wx.request({
    //   url: app.globalData.baseUrl + 'voteList', 
    //   method: 'GET',
    //   header: {
    //   'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     var voteList = res.data.data || [];
    //     if(voteList.length != 0) {
    //       voteList.forEach(function (item, index) {
    //         item.leftTime = app.dealTime(item.deadline);
    //       });
    //     }
    //     that.setData({
    //       voteList: voteList
    //     });
    //     return true;
    //   },
    //   fail: function(err) {
    //     console.log(err);
    //     return false;
    //   }
    // });
  }
})