//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    activeIndex: '1',
    tabActive: 'new',
    mine: "mine",
    new: "new",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    voteList: [],
    isUpdate: false,
    hasUserInfo: false,
    rotateSign: false,
    activityList: [
      {
        imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
        nickName: "认真的雪",
        address: "浙江 温州",
        deadline: 1535155200000,
        voteNum: 223,
        title: "异性时间投票",
        voteType: "1",
      }
    ],
    voteList:[
      {
        imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132",
        nickName: "认真的雪",
        address: "浙江 温州",
        deadline: 1535155200000,
        voteNum: 223,
        title: "夏季来啦,我们举行一个最美青路泳装大赛如何?",
        voteType: "1",
        picture: "/images/picture.jpg",
        selectList: [
          {
            text: "8:00",
            voteNum: 60,
            voteUser: [{
              nickName: '功成名就',
              imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
            },
            {
              nickName: '中华',
              imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
            },
            {
              nickName: '小明',
              imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
            }
            ]
          },
          {
            text: "8:20",
            voteNum: 23,
            voteUser: [
              {
                nickName: '功成名就',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '中华',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '小明',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              }
            ]
          },
          {
            text: "9:00",
            voteNum: 40,
            voteUser: [
              {
                nickName: '功成名就',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '中华',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '小明',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              }
            ]
          },
          {
            text: "都可以",
            voteNum: 100,
            voteUser: [
              {
                nickName: '功成名就',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '中华',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              },
              {
                nickName: '小明',
                imgSrc: "https://wx.qlogo.cn/mmopen/vi_32/4HiaHHeHoricmKu7aXK3X0Z93wevSEicOt9HVbm0yp3L9GkyicPmNkc7KBuvN5d1rrWWxrEcHRzbsL7KzDslrTJeJg/132"
              }
            ]
          }
        ]
      }
    ]
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
  // 加载事件
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: false
      });
      console.log("111");
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        if(res.authSetting === {}) {
          this.setData({
            hasUserInfo: true
          });
        } else {
          this.setData({
            hasUserInfo: true
          });
        }
      }
      console.log("222");
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
      console.log("333");
    }
    var voteList = this.data.voteList || [];
    voteList.forEach(function (item, index) {
      item.leftTime = app.dealTime(item.deadline);
      if(item.leftTime!= "活动截止") {
        item.state = "1"
      } else{
        item.state = "2"
      }
    });
    this.setData({
      voteList: voteList
    });
  },
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  // 切换tab
  changeSwitch: function (e) {
    // console.log(e.target.dataset);
    this.setData({
      tabActive: e.target.dataset.name
    })
  },
  // 切换index
  changeIndex:function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    })
    
  },
  // 获取投票详情
  openDetail:function(e) {
    
    let index = e.currentTarget.dataset.index, that = this, _id = e.currentTarget.dataset.id;
    app.globalData.voteMess = this.data.voteList[index];
    if(this.data.voteList[index].item == "2") {
      wx.showToast({
        title: '该投票已结束',
        icon: "none"
      });
    } else {
      if(this.data.activeIndex == '2') {
        wx.navigateTo({
          url: '../../pages/normalDetail/normalDetail?id=' + _id
        });
      } else {
         wx.navigateTo({
          url: '../../pages/voteDetail/voteDetail?id=' + _id
        });
      }
     
    }
    
  },
  // 打开操作菜单
  openBtns:function() {
    var newState =!this.data.rotateSign;
    this.setData({
      rotateSign: newState
    })
  },
  // 创建投票
  openNew: function (e) {
    var sign = e.currentTarget.dataset.id;
    if(sign == "1") {
      wx.navigateTo({
        url: '../../pages/newNormal/newNormal'
      });
    } else {
      wx.navigateTo({
        url: '../../pages/newActivity/newActivity'
      });
    }
  }
})
