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
    }
  },
  onLoad: function () {
    app.authJudge(this);
    // this.getVoteDetail();
    let voteMess = app.globalData.voteMess || this.data.voteMess;
    voteMess.selectList.forEach(function (value,index) {
      value.pickSign = false;
    });
    this.setData({
      voteMess: voteMess
    });
  }, 
 
  onShow: function() {
    
  },
  // 打开操作表
  handleOpen () {
    console.log("所发生的");
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
    let voteMess = this.data.voteMess;
    let index = e.currentTarget.dataset.id;
    voteMess.selectList[index].pickSign = !voteMess.selectList[index].pickSign;
    console.log(index,voteMess.selectList);
    this.setData({
      voteMess: voteMess
    });
    // var index = e.currentTarget.dataset.id, coteMess = this.data.vote;
    // console.log(coteMess.selectList[index].canSelected);
    // if(!coteMess.selectList[index].canSelected || (coteMess.isSelected && coteMess.voteType == "1")) {
    //   wx.showToast({
    //     title: '你已经参与过该投票啦~',
    //     icon: "none"
    //   });
    //   return false;
    // } else{
    //   coteMess.selectList[index].voteUser.push({
    //     nickName: app.globalData.userInfo.nickName,
    //     imgSrc: app.globalData.userInfo.avatarUrl
    //   });
    //   coteMess.selectList[index].voteNum++;
    //   coteMess.voteNum++;
    //   var params = {
    //     _id: coteMess._id,
    //     selectList: coteMess.selectList,
    //     voteNum: coteMess.voteNum
    //   }
    //   wx.request({
    //     url: app.globalData.baseUrl + 'joinVote',
    //     data: params,
    //     method: 'POST',
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: (res) =>  {
    //       var code = res.data.code;
    //       if(code == 200) {
    //         wx.showToast({
    //           title: '投票成功,棒棒哒~',
    //           icon: "none"
    //         });
    //         coteMess.selectList[index].canSelected = false;
    //         coteMess.selectList[index].isSelected = true;
    //         if(coteMess.voteType == "1") {
    //           for(var i= 0; i < coteMess.selectList.length; i++){
    //             coteMess.selectList[i].canSelected = false;
    //           }
    //         }
    //         coteMess.isSelected = true;
    //         console.log(coteMess.selectList);
    //         this.setData({
    //           vote: coteMess
    //         });
    //       }
    //     },
    //     fail: function(e) {
    //       console.log(e);
    //       return false;
    //     }
    //   })
    // }
    
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
      title: this.data.vote.title,
      path: '/pages/normalDetail/normalDetail'
    }
  }
});
