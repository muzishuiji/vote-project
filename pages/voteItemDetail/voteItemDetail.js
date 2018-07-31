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
    voteMess: {
      imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
      nickName: "认真的雪",
      address: "浙江 温州",
      deadline: 1535155200000,
      voteNum: 223,
      title: "异性时间投票",
      voteType: "1",
      commentList:[
        {
          avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
          nickName: "选项名称",
          time: '刚刚',
          pick: false,
          content: '如果你无法简洁的表达你的想法，那只说明你还不够了解它。-- 阿尔伯特·爱因斯坦',
        },
        {
          avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
          nickName: "选项名称",
          time: '刚刚',
          pick: false,
          content: '如果你无法简洁的表达你的想法，那只说明你还不够了解它。-- 阿尔伯特·爱因斯坦',
        }
      ]
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
    app.authJudge(this);
  },
  onShow: function() {
    var that = this;
    // 请求投票信息的数据
    // wx.request({
    //   url: 'https://lzx2005.com/normal/1', 
    //   method: 'GET',
    //   header: {
    //   'content-type': 'application/json'
    //   },
    //   success: (res) => {
    //     alert(res.code);
    //     return true;
    //   },
    //   fail: function(err) {
    //     console.log(err);
    //     return false;
    //   }
    // });
  },
  // 打开操作表
  handleOpen1 () {
      this.setData({
        sheetVisible: true
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
