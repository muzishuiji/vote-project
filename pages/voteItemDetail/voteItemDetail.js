//voteDetail.js
const app = getApp();

Page({
  data: {
    activityName: ' 最美亲子照评选活动',
    visible: false,
    code: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    sheetVisible: false,
    actions: [
        {
            name: '邀请朋友一起pick',
            icon: 'share',
            openType: 'share'
        }
    ],
    voteMess: {},
    activityName: '',
    voteMess: {},
    id: '',
    paiming: 1,
    params: {
      page: 1,
      pageSize: 10,
      itemId: null
    },
    callList: [],
    callContent: ''
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
      id: _id,
      activityName: title
    })
    this.getData(_id);
    this.getCallList(_id);
  },
  onShow: function() {
    var that = this;
  },
  getData: function(_id) {
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
        console.log(res);
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
  getCallList: function(_id) {
    let _params = this.data.params;
    _params.itemId = _id;
    wx.request({
      url: app.globalData.baseUrl + 'activity/call/list', 
      method: 'GET',
      data: _params,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        console.log(res);
        let callList = [];
        if(response.data.code == 200) {
          callList = response.data.data.records;
        }
        this.setData({
          callList: callList
        });
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
  // 打开操作表
  handleOpen1 () { 
      this.setData({
        sheetVisible: true
      });
  },
  setCallContent: function(e) {
    let callContent = e.detail.value;
    this.setData({
      callContent: callContent
    });
  },
  // 为参与者打call
  callFor: function () {
    let _param = {
      content: this.data.callContent,
      itemId: this.data.id
    }
    wx.request({
      url: app.globalData.baseUrl + 'activity/call', 
      method: 'POST',
      data: _param,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        console.log(res);
        let callList = [];
        if(response.data.code == 200) {
          wx.showToast({
            title: '打call成功~',
            icon: "success"
          });
        }
        this.setData({
          callList: callList
        });
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
  // 关闭操作表
  handleCancel1 () {
      this.setData({
        sheetVisible: false
      });
  },
  // 处理选择
  handleClickItem1 ({ detail }) {
    const index = detail.index + 1;
    if(index == 1) {
      this.handleCancel1();
      this.onShareAppMessage();
    } else {
      $Message({
          content: '您点击了取消'
      });
    }
      
  },
  openDetail: function() {
    wx.navigateTo({
      url: '../joinActivity/joinActivity'
    })
  },
  // 显示操作表
  handleOpen () {
    this.setData({
        visible: true
    });
  },
  // 关闭操作表
  handleCancel () {
    this.setData({
        visible: false
    });
  },
  // 给评论点赞
  pickComment:function (e) {
    var index = e.currentTarget.dataset.id, voteMess = this.data.voteMess;
    voteMess.commentList[index].pick = !voteMess.commentList[index].pick;
    console.log(voteMess.commentList);
    this.setData({
      voteMess: voteMess
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
