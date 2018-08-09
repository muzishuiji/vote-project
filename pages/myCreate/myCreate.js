//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '1',
    params1:{
      page:1,
      pageSize: 10
    },
    params2:{
      page:1,
      pageSize: 10
    },
    visible: false,
    voteList: [],
    deleteId: null,
    activityList:[],
    actions: [
      {
          name: '取消'
      },
      {
          name: '删除',
          color: '#ed3f14',
          loading: false
      }
    ],
    hasData1: true,
    hasData2: true
  },
  // 加载事件
  onLoad: function () {
    this.getDataList(this.data.params1, 'activity/list/my', '1');
    this.getDataList(this.data.params2, 'normal/my', '2');
  },
  // 显示弹窗
  handleOpen (e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
        visible: true,
        id: id
    });
  },
  handleOpen1 (e) {
    let id = e.currentTarget.dataset.name;
    this.setData({
        visible: true,
        id: id
    });
  },
  // 处理弹窗
  handleClick ({ detail }) {
    if (detail.index === 0) {
        this.setData({
            visible5: false
        });
    } else {
      wx.request({
        url: app.globalData.baseUrl + 'normal/' + this.data.id, 
        method: 'DELETE',
        header: {
        'content-type': 'application/json',
        'sessionId': app.globalData.sessionId
        },
        success: (res) => {
          let response = res;
          let voteList = [];
          console.log(res);
          if(response.data.code == 200) {
            $Message({
                content: '删除成功！',
                type: 'success'
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
      
    }
  },
  // 获取我创建的投票列表
  getDataList: function(_params, partUrl, sign) {
    let flag = sign || this.data.activeIndex;
    wx.request({
      url: app.globalData.baseUrl +  partUrl, 
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
          let dataList = flag == '1' ? [].concat(this.data.activityList, response.data.data.records) : [].concat(this.data.voteList, response.data.data.records);
          dataList.forEach((item) => {
            item.leftTime = flag == '1' ? app.dealTime(item.electEndTime) : app.dealTime(item.endTime);
            if(item.leftTime!= "投票截止") {
              item.state = "1"
            } else{
              item.state = "2"
            }
          });
          if(dataList.length < this.data.params1.pageSize) {
            if(flag == '1') {
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
            if(flag == '1') {
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
          console.log(this.data.hasData1);
        }
      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        this.setData({
          hasData1: true,
          hasData2: true
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
    if(this.data.activeIndex === '1' && this.data.hasData1) {
      wx.showLoading({
        title: '努力加载中',
      });
      let _params = this.data.params1;
      _params.page++;
      this.setData({
        params1: _params
      });
      this.getDataList(this.data.params1, 'activity/my', '1');
    } else if(this.data.activeIndex === '2' && this.data.hasData2) {
      wx.showLoading({
        title: '努力加载中',
      });
      let _params = this.data.params2;
      _params.page++;
      this.setData({
        params2: _params
      });
      this.getDataList(this.data.params2, 'normal/my', '2');
    }
  },
  // 下拉刷新事件
  onPullDownRefresh: function () {
    if(this.data.activeIndex === '1') {
      let _params = this.data.params1;
      _params.page = 1;
      this.setData({
        activityList: [],
        params1: _params
      });
      this.getDataList(this.data.params1, 'activity/my', '1');
    } else {
      let _params = this.data.params2;
      _params.page = 1;
      this.setData({
        voteList: [],
        params2: _params
      });
      this.getDataList(this.data.params2, 'normal/my', '2');
    }
    
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
  // 打开投票详情
  openDetail:function(e) {
    let index = e.currentTarget.dataset.index, that = this, _id = e.currentTarget.dataset.id;
    app.globalData.voteMess = this.data.voteList[index];
    if(this.data.voteList[index].item == "2") {
      wx.showToast({
        title: '该投票已结束',
        icon: "none"
      });
    } else {
      if(this.data.activeIndex == '2') {
        wx.navigateTo({
          url: '../../pages/normalDetail/normalDetail?id=' + _id
        });
      } else {
         wx.navigateTo({
          url: '../../pages/voteDetail/voteDetail?id=' + _id
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
  }
})
