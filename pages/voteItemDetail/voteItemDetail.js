//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activityName: ' 最美亲子照评选活动',
    visible: false,
    code: '',
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
  
  },
  onShow: function() {
    var that = this;
    // 请求投票信息的数据
    wx.request({
      url: 'https://lzx2005.com/normal/1', 
      method: 'GET',
      header: {
      'content-type': 'application/json'
      },
      success: (res) => {
        alert(res.code);
        return true;
      },
      fail: function(err) {
        console.log(err);
        return false;
      }
    });
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
  pickComment:function (e) {
    var index = e.currentTarget.dataset.id, voteMess = this.data.voteMess;
    voteMess.commentList[index].pick = !voteMess.commentList[index].pick;
    console.log(voteMess.commentList);
    this.setData({
      voteMess: voteMess
    });
  }
})
