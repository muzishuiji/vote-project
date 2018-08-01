//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '1',
    params:{
      page:1,
      pageSize:10
    },
    visible: false,
    voteList: [],
    deleteId: null,
    activityList:[
      {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
        nickName: "认真的雪",
        address: "浙江 温州",
        endTime: 1535155200000,
        joinedUserSum: 223,
        title: "夏季来啦,我们举行一个最美青路泳装大赛如何?",
        voteType: "1",
        picture: "/images/picture.jpg",
        items: []
      }
    ],
    actions: [
      {
          name: '取消'
      },
      {
          name: '删除',
          color: '#ed3f14',
          loading: false
      }
    ]
  },
  // 加载事件
  onLoad: function () {
    this.getDataList();
    var activityList = this.data.activityList;
    activityList.forEach(function(item) {
      item.leftTime = app.dealTime(item.endTime);
      if(item.leftTime!= "投票截止") {
        item.state = "1"
      } else{
        item.state = "2"
      }
    });
    this.setData({
      activityList: activityList
    });
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
  getDataList: function(e) {
    wx.request({
      url: app.globalData.baseUrl + 'normal/my', 
      method: 'GET',
      data: this.data.params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteList = [];
        console.log(res);
        if(response.data.code == 200) {
          if(response.data.data.records.length > 0) {
            voteList = response.data.data.records,response.data.data.records;
            voteList.forEach((item) => {
              item.leftTime = app.dealTime(item.endTime);
              if(item.leftTime!= "投票截止") {
                item.state = "1"
              } else{
                item.state = "2"
              }
            });
            console.log(voteList);
            this.setData({
              voteList: voteList
            });
            return true;
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
