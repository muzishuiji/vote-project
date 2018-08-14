//voteDetail.js
const app = getApp();

Page({
  data: {
    activityName: ' 最美亲子照评选活动',
    visible: false,
    code: '',
    paiming: '',
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
      pageSize: 15,
      itemId: null
    },
    callList: [], 
    callContent: '',
    hasPicked: false,
    hasData: true
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
    let title = options.title;
    let _itemId = options.itemId;
    this.setData({
      id: _id,
      itemId:_itemId,
      activityName: title,
      paiming: options.paiming
    });
    app.authJudge(this).then((res) => {
      this.getData(_itemId);
      this.getCallList(_itemId);
    })
    
  },
  onShow: function() {
    var that = this;
  },
  // 获取详情
  getData: function(_id) {
    wx.request({
      url: app.globalData.baseUrl + 'activity/item/' + _id, 
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
        // console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  // 事件转换函数
  formatTime: function(timestamp) {
    let time = new Date(timestamp);
    let month = time.getMonth()+1;
    if(month < 10) {
      month = '0' + month;
    }
    let date = time.getDate();
    if(date < 10) {
      date = '0' + date;
    }
    let hours = time.getHours();
    let minutes = time.getMinutes();
    return month + '-' + date + ' ' + hours + ':' + minutes;
  },
  // 获取打call列表
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
        let callList = this.data.callList;
        if(response.data.code == 200) {
          callList = callList.concat(response.data.data.records);
          callList.forEach(item => {
            let last = item.createdTime - +new Date();
            switch(last) {
              case last <= 600000:
                item.leftTime = '刚刚';
                break;
              case last <= 3600000:
                item.leftTime = Math.ceil(last / 60000) + '分钟前';
                break;
              case last <= 12000000:
                item.leftTime = Math.ceil(last / 3600000) + '小时前';
                break; 
              case last <= 86400000:
                item.leftTime = '今天 ' + parseInt((last % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + parseInt((last % (1000 * 60 * 60)) / (1000 * 60));
                break; 
              case last <= 86400000:
                item.leftTime = '今天 ' + parseInt((last % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + parseInt((last % (1000 * 60 * 60)) / (1000 * 60));
                break; 
              default:
                item.leftTime = this.formatTime(item.createdTime);
                break;   
            }
          });
          if(response.data.data.records.length < this.data.params.pageSize) {
            this.setData({
              callList: callList,
              hasData: false
            });
          } else {
            this.setData({
              callList: callList,
              hasData: true
            });
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
  // 点赞
  pickVote: function() {
    if(this.data.hasPicked) {
      wx.showToast({
        title: '你已经点过赞了',
        icon: "none"
      });
    }
    wx.request({
      url: app.globalData.baseUrl + 'activity/item/' + this.data.itemId + '/up', 
      method: 'POST',
      data: {},
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteMess = this.data.voteMess;
        if(response.data.code == 200) {
          wx.showToast({
            title: '点赞成功',
            icon: "success"
          });
          voteMess.upSum++;
        } else if(response.data.code == 10011) {
          wx.showToast({
            title: '你已经点过赞了',
            icon: "none"
          });
        }
        this.setData({
          hasPicked: true,
          voteMess: voteMess
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
      itemId: this.data.itemId
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
          this.getCallList(this.data.itemId);
        }
        this.setData({
          callList: callList,
          visible: false
        });
      },
      fail: function(err) {
        console.log(err);
        this.setData({
          visible: false
        });
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
    var id = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index,
        callList = this.data.callList;
    if(callList[index].uped) {
      wx.showToast({
        title: '不可重复点赞奥~',
        icon: "none"
      });
      return false;
    }
    wx.request({
      url: app.globalData.baseUrl + 'activity/call/' + id + '/up', 
      method: 'POST',
      data: {},
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        if(response.data.code == 200) {
          callList[index].uped = true;
          callList[index].upSum++;
          this.setData({
            callList: callList
          });
        }
      }, 
      fail: function(err) {
        // console.log(err);
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  }, 
  //预览图片
　callPreviewImage: function(e) {
　  wx.previewImage({
　　　 current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src],
　　　 complete:function(){
　　　　　console.log('complete');
　　　 }
　　});
　},   
  // 分享
  onShareAppMessage: function(res){
    if(res.from === "button") {
      console.log(res.target);
    } 
    return {
      title: this.data.voteMess.title,
      path: '/pages/normalDetail/normalDetail?id=' +  this.data.id + '&title=' + this.data.activityName + '&paiming=' + this.data.paiming + '&itemId=' + this.data.itemId
    }
  }
})
