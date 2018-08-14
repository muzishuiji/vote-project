//min.js
const app = getApp();
Page({
  data: {
    activityVote: {
      activityId: '',
      title: "1", 
      imageUrl: "",
      content: '',
      slogan: ''
    },
    imageUrl: '',
    activityTitle: ''
  },
  onLoad: function (options) {
    // console.log(options);
    let activityVote = this.data.activityVote;
    activityVote.activityId = options.id
    let activityTitle = options.title;
    this.setData({
      activityVote: activityVote,
      activityTitle: activityTitle
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
  // 更新活动投票slogan
  bindSloganInput: function(e) {
    var activityVote = this.data.activityVote;
    activityVote.slogan = e.detail.value;
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
    // 验证活动投票的名称
    confirmTitle: function(e) {
      this.confirm('title');
    },
    // 验证活动slogan
    confirmSlogan: function (e) {
      this.confirm('slogan');
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
  // 提交投票信息
  sumitVote: function() {
    if(!this.data.activityVote.title) {
      wx.showToast({
        title: '参赛作品名称必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.activityVote.slogan)) {
      wx.showToast({
        title: '参赛的一句话描述必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.imageUrl)) {
      wx.showToast({
        title: '参赛海报必须上传奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.activityVote.content)) {
      wx.showToast({
        title: '参赛作品的详情必填奥~',
        icon: "none"
      });
      return false;
    }
    let activityVote = this.data.activityVote;
    activityVote.imageUrl = this.data.imageUrl;
    wx.request({
      url: app.globalData.baseUrl + 'activity/item', 
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
            title: '报名成功~',
            icon: "none",
            success: function() {
              wx.redirectTo({
                url: '../../pages/joinDetail/joinDetail?id=' + activityVote.activityId
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
   // 上传图片
   uploadImg: function() {
    let self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: app.globalData.baseUrl + 'image/activity/upload', 
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: (res) => {
            let response = res;
            response.data = JSON.parse(response.data);
            if(response.data.code == 200) {
              let imageUrl = response.data.data.url;
              self.setData({
                imageUrl: imageUrl
              });
            }
          },
        
        })
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
