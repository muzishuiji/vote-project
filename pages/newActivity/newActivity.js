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
    activityVote: {
      title: "1", 
      image: "",
      content: '',
      joinDate: 1,
      voteDate: 1,
      nickName: '',
      avatarUrl:'',
      voteNum: 0,
      maxJoinNum: 50
    },
    imgSrc: ''
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
    activityVote.content = e.detail.content;
    this.setData({
      activityVote: activityVote
    });
  },
  // 更新活动投票的最大参与人数
  bindNumInput: function (e) {
    var activityVote = this.data.activityVote;
    activityVote.maxJoinNum = e.detail.content;
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
    
  },
   // 上传图片
   uploadImg: function() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          imgSrc: tempFilePaths
        })
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
