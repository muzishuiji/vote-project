//voteDetail.js
const app = getApp();
Page({
  data: {
    isSelected: false,
    voteMess: {
      voteType: "",
      title: "",
      isShared: false,
      deadline: 1,
      selectList:[
        {
          text: "",
          voteNum: 0,
          voteUser: []
        },
        {
          text: "",
          voteNum: 0,
          voteUser: []
        }]
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: true
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
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: false
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: false
        });
      }
      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: false
          });
        }
      })
    }
    // this.getVoteDetail();
    let voteMess = app.globalData.voteMess || this.data.voteMess;
    this.setData({
      voteMess: voteMess
    });
  }, 
  getVoteDetail: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'voteDetail', 
      method: 'GET',
      header: {
      'content-type': 'application/json'
      },
      data: {_id: app.globalData._id},
      success: (res) => {
        var coteMess = res.data.data, nickName = app.globalData.userInfo.nickName;
        coteMess.leftTime = app.dealTime(coteMess.deadline);
        coteMess.isSelected = false;
        
        for(var i = 0; i < coteMess.selectList.length; i++) {
          coteMess.selectList[i].canSelected = true;
          for(var j = 0; j < coteMess.selectList[i].voteUser.length; j++) {
            if(coteMess.selectList[i].voteUser && coteMess.selectList[i].voteUser[j].nickName == nickName) {
              coteMess.isSelected = true;
              coteMess.selectList[i].canSelected = false;
              coteMess.selectList[i].isSelected = true;
              if(coteMess.voteType == "1") { // 某个用户选择了单选则禁用所有选项
                for(var k = 0; k < coteMess.selectList.length; k++){
                  coteMess.selectList[k].canSelected = false;
                }
              }
              that.setData({
                vote: coteMess
              });
              return;
            }
          }
        }
        that.setData({
          vote: coteMess
        });
        return;
      }
    });
  },
  onShow: function() {
    // if(app.globalData.userInfo) {
    //   wx.request({
    //     url: 'http://muzishuiji.com:3000/voteDetail', 
    //     method: 'GET',
    //     header: {
    //     'content-type': 'application/json'
    //     },
    //     data: {_id: app.globalData._id},
    //     success: (res) => {
    //       var coteMess = res.data.data, nickName = app.globalData.userInfo.nickName;
    //       coteMess.leftTime = app.dealTime(coteMess.deadline);
    //       coteMess.isSelected = false;
    //       console.log(coteMess);
    //       for(var i = 0; i < coteMess.selectList.length; i++) {
    //         coteMess.selectList[i].canSelected = true;
    //         for(var j = 0; j < coteMess.selectList[i].voteUser.length; i++) {
    //           if(coteMess.selectList[i].voteUser[j].nickName == nickName) {
    //             coteMess.isSelected = true;
    //             coteMess.selectList[i].canSelected = false;
    //             coteMess.selectList[i].isSelected = true;
    //             if(coteMess.voteType == "1") { // 某个用户选择了单选则禁用所有选项
    //               for(var k = 0; k < coteMess.selectList.length; k++){
    //                 coteMess.selectList[k].canSelected = false;
    //               }
    //             }
    //             that.setData({
    //               vote: coteMess
    //             });
    //             return;
    //           }
    //         }
    //       }
    //       that.setData({
    //         vote: coteMess
    //       });
    //       return;
    //     }
    //   });
    // } else {
    //   wx.showToast({
    //     title: '你还未进行微信授权,请前往我的页面完成微信授权',
    //     icon: "none",
    //     success: function(res) {
    //        wx.navigateTo({
    //         url: '../../pages/mine/mine'
    //       });
    //     }
    //   });
    // }
  },
  // 参与投票
  voteFor: function(e) {
    var index = e.currentTarget.dataset.id, coteMess = this.data.vote;
    console.log(coteMess.selectList[index].canSelected);
    if(!coteMess.selectList[index].canSelected || (coteMess.isSelected && coteMess.voteType == "1")) {
      wx.showToast({
        title: '你已经参与过该投票啦~',
        icon: "none"
      });
      return false;
    } else{
      coteMess.selectList[index].voteUser.push({
        nickName: app.globalData.userInfo.nickName,
        imgSrc: app.globalData.userInfo.avatarUrl
      });
      coteMess.selectList[index].voteNum++;
      coteMess.voteNum++;
      var params = {
        _id: coteMess._id,
        selectList: coteMess.selectList,
        voteNum: coteMess.voteNum
      }
      wx.request({
        url: app.globalData.baseUrl + 'joinVote',
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: (res) =>  {
          var code = res.data.code;
          if(code == 200) {
            wx.showToast({
              title: '投票成功,棒棒哒~',
              icon: "none"
            });
            coteMess.selectList[index].canSelected = false;
            coteMess.selectList[index].isSelected = true;
            if(coteMess.voteType == "1") {
              for(var i= 0; i < coteMess.selectList.length; i++){
                coteMess.selectList[i].canSelected = false;
              }
            }
            coteMess.isSelected = true;
            console.log(coteMess.selectList);
            this.setData({
              vote: coteMess
            });
          }
        },
        fail: function(e) {
          console.log(e);
          return false;
        }
      })
    }
    
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
      console.log(res.target)
    }
    return {
      title: this.data.vote.title,
      path: '/pages/vote/voteDetail'
    }
  }
});
