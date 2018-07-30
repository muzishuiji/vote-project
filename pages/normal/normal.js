//index.js
//获取应用实例 
const app = getApp();

Page({
  data: {
    voteList: [],
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
  // 加载事件
  onLoad: function () {
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
      wx.navigateTo({
        url: '../../pages/normalDetail/normalDetail?id=' + _id
      });
    }
    
  }
})
