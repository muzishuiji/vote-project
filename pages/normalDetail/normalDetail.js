//voteDetail.js
const app = getApp();
Page({
  data: {
    isSelected: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    visible: false,
    actions: [
        {
            name: '邀请朋友参与投票',
            icon: 'share',
            openType: 'share'
        }
    ],
    voteMess: {}
  },
  onLoad: function (options) {
    app.authJudge(this).then(() => {
      this.getVoteDetail(options.id);
    });
  }, 
 
  onShow: function() {
    
  },
  getVoteDetail: function (id) {
    wx.showLoading({
      title: '努力加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + 'normal/' + id, 
      method: 'GET',
      data: this.data.params,
      header: {
        'content-type': 'application/json',
        'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        let voteMess = {};
        let sign = false;
        // console.log(res);
        wx.hideLoading();
        if(response.data.code == 200) {
          voteMess = response.data.data;
          voteMess.leftTime = app.dealTime(voteMess.endTime);
          voteMess.items.forEach(element => {
            element.percent = Math.round((element.voteSum / voteMess.joinedUserSum).toFixed(2) * 100);
            element.canVote = true;
            if(!voteMess.multiple) {
              if(element.voted) {
                sign = true;
              }
            }
          });
          if(sign){
            voteMess.items.forEach((value) => {
              value.canVote = false;
            })
          }
          this.setData({
            voteMess: voteMess
          });
          return true;
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
  // 打开操作表
  handleOpen () {
    // console.log("所发生的");
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
  // 处理选择
  handleClickItem ({ detail }) {
    const index = detail.index + 1;
    if(index == 1) {
      this.onShareAppMessage();
    } else {
      $Message({
          content: '您点击了取消'
      });
    }
      
  },
  // 参与投票
  voteFor: function(e) {
    if(this.data.voteMess.leftTime == "投票截止") {
      wx.showToast({
        title: '投票已截止',
        icon: "none"
      });
      return false;
    }
    let voteMess = this.data.voteMess;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    console.log(voteMess.items[index].canVote);
    if(voteMess.items[index].voted || !voteMess.items[index].canVote) {
      wx.showToast({
        title: '你已经参与过该投票了~',
        icon: "none"
      });
      return false;
    }
    wx.request({
      url: app.globalData.baseUrl + 'normal/item/' + id +'/vote', 
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json',
        'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        // console.log(res);
        if(response.data.code == 200) {
          wx.showToast({
            title: '投票成功',
            icon: "success"
          });
          voteMess.items[index].voted = !voteMess.items[index].voted;
          voteMess.joinedUserSum++;
          voteMess.items[index].voteSum++;
          voteMess.items.forEach(element => {
            element.percent = Math.round((element.voteSum / voteMess.joinedUserSum).toFixed(2) * 100);
          });
          this.setData({
            voteMess: voteMess
          });
          return true;
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
  // 时间处理函数
  dealTime: function(date) {
    var str = '';
    var day = Math.floor((date - new Date().getTime()) / (24*3600*1000));
    var hour = Math.floor((date - new Date().getTime() - day * 24 * 3600 * 1000) / (3600 * 1000));
    str += day + "天" + hour + "时";
    return str;
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
});
