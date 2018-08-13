//min.js
const app = getApp();
Page({
  data: {
    startDate: '',
    endDate: '2020-01-01',
    joinDate: '2016-09-01',
    joinTime: '12:01',
    voteDate: '2016-09-01',
    voteTime: '12:01',
    activityVote:{
      content: "",
      electEndTime: null,  // 评选截止时间
      imageUrl: "",
      maxJoin: 0, 
      signEndTime: null, // 报名截止时间
      title: ""
    },
    imageUrl: '',
    uploadUrl: ''
  },
  onLoad: function () {
    let startDate = new Date().getFullYear()+ '-' +((new Date().getMonth() + 1) < 10 ? ("0" + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1))+ '-' + new Date().getDate() + '';
    this.setData({
      startDate: startDate
    });
  },
  // 更新活动投票名称
  bindTitleInput: function(e) {
    var activityVote = this.data.activityVote;
    activityVote.title = e.detail.value;
    this.setData({
      activityVote: activityVote
    });
  },
  // 更新活动投票详情
  bindContentInput: function(e) {
    var activityVote = this.data.activityVote;
    activityVote.content = e.detail.value;
    this.setData({
      activityVote: activityVote
    });
  },
  // 更新活动投票的最大参与人数
  bindNumInput: function (e) {
    var activityVote = this.data.activityVote;
    activityVote.maxJoin = e.detail.value;
    this.setData({
      activityVote: activityVote
    });
  },
  // 提交投票信息
  sumitVote: function() {
    if(!this.data.activityVote.title) {
      wx.showToast({
        title: '活动标题必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.activityVote.content)) {
      wx.showToast({
        title: '活动详情必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!this.data.imageUrl) {
      wx.showToast({
        title: '投票的海报必填奥~',
        icon: "none"
      });
      return false;
    }
    if(+new Date(this.data.joinDate) >= +new Date(this.data.voteDate) && +new Date(this.data.joinDate) < +new Date()) {
      wx.showToast({
        title: '时间选择不合理奥~',
        icon: "none"
      });
      return false;
    }
    let activityVote = this.data.activityVote;
    activityVote.signEndTime = +new Date(this.data.joinDate + ' ' + this.data.joinTime);
    activityVote.electEndTime = +new Date(this.data.voteDate + ' ' + this.data.voteTime);
    activityVote.imageUrl = this.data.uploadUrl;
    wx.request({ 
      url: app.globalData.baseUrl + 'activity', 
      method: 'POST',
      data: activityVote,
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        // console.log(res);
        if(response.data.code == 200) {
          wx.showToast({
            title: '创建成功~',
            icon: "none",
            success: function() {
              wx.redirectTo({
                url: '../../pages/activity/activity'
              });
            }
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
   // 选择图片
   uploadImg: function() {
    let self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res);
        self.setData({
          imageUrl: res.tempFilePaths[0]
        });
        // 上传图片
        this.uploadPicture(res.tempFilePaths[0]);
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    }) 
  },
  // 验证活动投票的名称
  confirmTitle: function(e) {
    this.confirm('title');
  },
  // 验证活动投票的详情
  confirmContent: function (e) {
    this.confirm('content');
  },
  // 验证请求
  confirm: function(content) {
    let activityVote = this.data.activityVote;
    wx.request({ 
      url: app.globalData.textUrl + '&s=' + activityVote[content], 
      method: 'GET',
      header: {
      'content-type': 'application/json',
      'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        // console.log(res);
        if(response.data.code == 200 && response.data.data.hits.length == 0) {
          return true;
        } else {
          wx.showToast({
            title: '所填内容涉及敏感词汇',
            icon: "none"
          });
          activityVote[content] = '';
          this.setData({
            activityVote: activityVote
          });
          return false;
        }
      },
      fail: function(err) {
        console.log(err);
        return false;
      }
    });
  },
  uploadPicture: function (path) {
    wx.uploadFile({
      url: app.globalData.baseUrl + 'image/activity/upload', 
      filePath: path,
      name: 'file',
      success: (res) => {
        let response = res;
        response.data = JSON.parse(response.data);
        if(response.data.code == 200) {
          let imageUrl = response.data.data.url;
          this.setData({
            uploadUrl: imageUrl
          });
        }
      },
    
    })
  },
  // 报名日期改变
  bindDateChange1: function(e) {
    this.setData({
      joinDate: e.detail.value
    })
  },
  // 评选日期改变
  bindDateChange2: function(e) {
    this.setData({
      voteDate: e.detail.value
    })
  },
  // 报名时间改变
  bindTimeChange1: function(e) {
    this.setData({
      joinTime: e.detail.value
    })
  },
  // 评选时间改变
  bindTimeChange2: function(e) {
    this.setData({
      voteTime: e.detail.value
    })
  }
});
