//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    voteList: [],
    voteList:[],
    hasRefesh:false,
    hasData: true,
    params:{
      page: 1,
      pageSize: 5
    }
  },
  // 加载事件
  onLoad: function () {
    // 显示加载图标
    wx.showLoading({
      title: '努力加载中',
    });
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
        wx.hideLoading();
        // console.log(res);
        if(response.data.code == 200) {
          voteList = voteList.concat(response.data.data.records);
          voteList.forEach((item) => {
            item.leftTime = app.dealTime(item.endTime);
            if(item.leftTime!= "投票截止") {
              item.state = "1"
            } else{
              item.state = "2"
            }
          });
          if(response.data.data.records.length < this.data.params.pageSize) {
            this.setData({
              voteList: voteList,
              hasData: false
            });
          } else {
            this.setData({
              voteList: voteList,
              hasData: true
            });
          } 
        }
        return true;
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({
          voteList: voteList,
          hasData: true
        });
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      },
      complete: () => {
        // complete
        wx.stopPullDownRefresh() //停止下拉刷新
        return true;
      } 
    });
  },
  // 上拉触底加载
  onReachBottom: function () {  
    if(this.data.hasData){
      // 显示加载图标
      wx.showLoading({
        title: '努力加载中',
      });
      let params = this.data.params;
      params.page++;
      this.setData({
        params: params
      });
      this.getDataList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh: function () {
    let _params = this.data.params;
    _params.page = 1;
    this.setData({
      voteList: [],
      params: _params
    });
    this.getDataList();
  },  
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
