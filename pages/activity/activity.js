//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '2',
    params1: {
      page: 1,
      pageSize: 10,
      statuss: '2,3'
    },
    params2: {
      page: 1,
      pageSize: 10,
      statuss: '1'
    },
    activityList: [],
    voteList:[],
    hasData1: true,
    hasData2: true
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
    // 显示加载图标
    wx.showLoading({
      title: '努力加载中',
    });
    this.getDataList(this.data.params1, '2');
    this.getDataList(this.data.params2, '1');
  },
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  // 切换tab
  changeSwitch: function (e) {
    // console.log(e.target.dataset);
    this.setData({
      tabActive: e.target.dataset.name
    })
  },
  // 切换index
  changeIndex:function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    });
    
  },
  // 获取投票数据列表
  getDataList: function(_params, sign) {
    let flag = sign || this.data.activeIndex;
    wx.request({
      url: app.globalData.baseUrl + 'activity/list', 
      method: 'GET',
      data: _params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        wx.hideLoading();
        // console.log(res);
        if(response.data.code == 200) {
          let dataList = flag == '2' ? [].concat(this.data.activityList, response.data.data.records) : [].concat(this.data.voteList, response.data.data.records);
          dataList.forEach((item) => {
            item.leftTime =flag == '2' ? app.dealTime(item.electEndTime) : app.dealTime(item.signEndTime) ;
            if(item.leftTime!= "投票截止") {
              item.state = "1"
            } else{
              item.state = "2"
            }
          });
          if(response.data.data.records.length < this.data.params1.pageSize) {
            if(flag == '2') {
              this.setData({
                activityList: dataList,
                hasData1: false
              });
            } else {
              this.setData({
                voteList: dataList,
                hasData2: false
              });
            }
            return true;
          } else {
            if(flag == '2') {
              this.setData({
                activityList: dataList,
                hasData1: true
              });
            } else {
              this.setData({
                voteList: dataList,
                hasData2: true
              });
            }
            return false;
          }
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({
          hasData1: true,
          hasData2: true
        })
        // console.log(err);
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
    if(this.data.activeIndex === '2' && this.data.hasData1) {
      wx.showLoading({
        title: '努力加载中',
      });
      let _params = this.data.params1;
      _params.page++;
      this.setData({
        params1: _params
      });
      this.getDataList(_params);
    } else if(this.data.activeIndex === '1' && this.data.hasData2) {
      wx.showLoading({
        title: '努力加载中',
      });
      let _params = this.data.params2;
      _params.page++;
      this.setData({
        params2: _params
      });
      this.getDataList(_params);
    }
  },
  // 下拉刷新事件
  onPullDownRefresh: function () {
    if(this.data.activeIndex === '2') {
      let _params = this.data.params1;
      _params.page = 1;
      this.setData({
        activityList: [],
        params1: _params
      });
      this.getDataList(_params);
    } else {
      let _params = this.data.params2;
      _params.page = 1;
      this.setData({
        voteList: [],
        params2: _params
      });
      this.getDataList(_params);
    }
    
  },   
  // 获取投票详情
  openDetail:function(e) {  
    let index = e.currentTarget.dataset.index, that = this, _id = e.currentTarget.dataset.id;
    app.globalData.voteMess = this.data.voteList[index];
    if(this.data.activeIndex == '2') {
      if(this.data.activityList[index].state == "2") {
        wx.showToast({
          title: '该投票已结束',
          icon: "none"
        });
      } else {
        wx.navigateTo({
          url: '../../pages/voteDetail/voteDetail?id=' + _id
        });
      }
    } else {
      if(this.data.voteList[index].state == "2") {
        wx.showToast({
          title: '该投票已结束',
          icon: "none"
        });
      } else {
        wx.navigateTo({
          url: '../../pages/joinDetail/joinDetail?id=' + _id
        });
      }
    }
  },
  // 打开操作菜单
  openBtns:function() {
    var newState =!this.data.rotateSign;
    this.setData({
      rotateSign: newState
    })
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
  }
})
