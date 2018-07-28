//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    joinMess: {
      title: '',
      slogon: '',
      imgSrc: '',
      detail: ''
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 加载事件
  onLoad: function (options) {
    let voteList = this.data.voteList;
    let _id = options.id;
    
  },
  onShow: function() {
    var that = this;
    // 请求投票信息的数据
    // wx.request({
    //   url: app.globalData.baseUrl + 'voteList', 
    //   method: 'GET',
    //   header: {
    //   'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     var voteList = res.data.data || [];
    //     if(voteList.length != 0) {
    //       voteList.forEach(function (item, index) {
    //         item.leftTime = app.dealTime(item.deadline);
    //       });
    //     }
    //     that.setData({
    //       voteList: voteList
    //     });
    //     return true;
    //   },
    //   fail: function(err) {
    //     console.log(err);
    //     return false;
    //   }
    // });
  },
  // 更新参与投票的相关数据
  bindTitleInput: function(e) {
    let joinMess = this.data.joinMess,
        name = e.currentTarget.dataset.name;
    joinMess[name]= e.detail.value;
    this.setData({
      joinMess: joinMess
    });
  },

  // 提交投票信息
  sumitVote: function() {
    if(!this.data.joinMess.title) {
      wx.showToast({
        title: '参赛称号必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.joinMess.slogon)) {
      wx.showToast({
        title: '参赛slogon必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.joinMess.detail)) {
      wx.showToast({
        title: '参赛详情必填奥~',
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
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
      }
    })
  },
})
