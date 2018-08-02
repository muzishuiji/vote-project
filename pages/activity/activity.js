//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '1',
    params: {
      page: 1,
      pageSize: 10
    },
    activityList: [
      {
        imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
        nickName: "认真的雪",
        address: "浙江 温州",
        deadline: 1535155200000,
        voteNum: 223,
        title: "异性时间投票",
        voteType: "1",
      }
    ],
    voteList:[
      {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
        nickName: "认真的雪",
        electEndTime: 1535155200000,
        signEndTime: 1535155200000,
        maxJoin: 223,
        title: "夏季来啦,我们举行一个最美青路泳装大赛如何?",
        voteType: "1",
        picture: "/images/picture.jpg",
        selectList: [
         
        ]
      }
    ]
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
    this.getDataList();
    var voteList = this.data.voteList || [];
    voteList.forEach(function (item, index) {
      item.leftTime = app.dealTime(item.deadline);
      if(item.leftTime!= "活动截止") {
        item.state = "1"
      } else{
        item.state = "2"
      }
    });
    var activityList = this.data.voteList || [];
    activityList.forEach(function (item, index) {
      item.leftTime = app.dealTime(item.deadline);
      if(item.leftTime!= "活动截止") {
        item.state = "1"
      } else{
        item.state = "2"
      }
    });
    this.setData({
      voteList: voteList
    });
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
    console.log(e.currentTarget.dataset);
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    });
    
  },
  // 获取投票数据列表
  getDataList: function(e) {
    wx.request({
      url: app.globalData.baseUrl + 'activity/list', 
      method: 'GET',
      data: this.data.params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteList = this.data.voteList;
        let activityList = this.data.activityList;
        // console.log(res);
        if(response.data.code == 200) {
          if(response.data.data.records.length > 0) {
            voteList = response.data.data.records;
            activityList = response.data.data.records;
            voteList.forEach((item) => {
              item.leftTime = app.dealTime(item.electEndTime);
              if(item.leftTime!= "投票截止") {
                item.state = "1"
              } else{
                item.state = "2"
              }
            });
            activityList.forEach((item) => {
              item.leftTime = app.dealTime(item.signEndTime);
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
  // 获取投票详情
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
          url: '../../pages/joinDetail/joinDetail?id=' + _id
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
