//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    voteList: [],
    voteList:[],
    hasRefesh:false,
    toView: 'red',
    scrollTop: 0,
    params:{
      page: 1,
      pageSize: 10
    }
  },
  // 加载事件
  onLoad: function () {
    this.getDataList();
  },
  // 获取投票数据列表
  getDataList: function(e) {
    wx.request({
      url: app.globalData.baseUrl + 'normal/list', 
      method: 'GET',
      data: this.data.params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteList = this.data.voteList;
        console.log(res);
        if(response.data.code == 200) {
          if(response.data.data.records.length > 0) {
            voteList = voteList.concat(response.data.data.records,response.data.data.records);
            voteList.forEach((item) => {
              item.leftTime = app.dealTime(item.endTime);
              if(item.leftTime!= "投票截止") {
                item.state = "1"
              } else{
                item.state = "2"
              }
            });
            this.setData({
              voteList: voteList,
              hasRefesh: false
            });
            return true;
          } else {
            wx.showToast({
              title: '没有更多了',
              icon: "none"
            });
            return false;
          }
          
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
  // 触底加载
  bindDownLoad: function() {
    let params = this.data.params;
    params.page++;
    this.setData({
      params: params
    });
    console.log(this.data.scrollTop);
    if(this.data.scrollTop!== 0){
      this.getDataList();    
    }
    
  },
  throttle : function (event, cb,delay) {
    let startTime = Date.now();
    return function () {
      let currTime = Date.now();
      if(currTime - startTime >= delay) {
        cb();
        console.log(event.detail.scrollTop);
        startTime = currTime;
      }
    }
  },
  // 使用节流函数来限制触发调用setData的次数
  scroll:function(event){
    this.throttle(event,function () { 
      self.setData({
      scrollTop : event.detail.scrollTop
    });}, 200);
  },
  // 刷新
  topLoad:function(event){
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    let params = this.data.params;
    params.page = 1;
    this.setData({
      scrollTop : 0,
      voteList: [],
      params: params,
      hasRefesh: true
    });
    this.getDataList();
  },
  // 下拉刷新事件
  // onPullDownRefresh: function () {
  //   this.getDataList();
  //   wx.stopPullDownRefresh();
  // },  
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  // 获取投票详情
  openDetail:function(e) { 
    let index = e.currentTarget.dataset.index, that = this, _id = e.currentTarget.dataset.id;
    app.globalData.voteMess = this.data.voteList[index];
    if(this.data.voteList[index].state == "2") {
      wx.showToast({
        title: '该投票已结束',
        icon: "none"
      });
    } else {
      wx.navigateTo({
        url: '../../pages/normalDetail/normalDetail?id=' + _id
      });
    }
    
  }
})
