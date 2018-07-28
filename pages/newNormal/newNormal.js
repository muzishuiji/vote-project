//min.js
const app = getApp();
Page({
  data: {
    checkboxItems: [
      { name: '单选', id: '1', checked: true },
      { name: '多选', id: '2' }
    ],
    startDate: '',
    endDate: '2020-01-01',
    date: '2016-09-01',
    time: '12:01',
    vote: {
      voteType: "1",
      title: "",
      isShared: false,
      deadline: 1,
      nickName: '',
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
        }
      ],
      voteNum: 0
    } 
  }, 
  onLoad: function () {
    let startDate = new Date().getFullYear()+ '-' +((new Date().getMonth() + 1) < 10 ? ("0" + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1))+ '-' + new Date().getDate() + '';
    this.setData({
      startDate: startDate
    });
  },
  // 更新输入
  bindKeyInput: function(e) {
    var voteMess = this.data.vote;
    voteMess.selectList[e.target.dataset.id].text = e.detail.value;
    this.setData({
      vote: voteMess
    });
  },
  bindTitleInput: function (e) {
    var voteMess = this.data.vote;
    voteMess.title = e.detail.value;
    this.setData({
      vote: voteMess
    });
  },
  // 删除选项
  deleteSelect: function (e) {
    var voteMess = this.data.vote;
    voteMess.selectList.length > 1 ? voteMess.selectList.splice(e.target.dataset.id, 1) : wx.showToast({
      title: '不能再少了奥~',
      icon: "none"
    });
    this.setData({
      vote: voteMess
    });
  },
  // 新增选项
  addSelect: function() {
    var voteMess = this.data.vote;
    var flag = true;
    voteMess.selectList.forEach(element => {
      if(!element.text) {
        flag = false;
      }
    });
    if(flag) {
      voteMess.selectList[voteMess.selectList.length] = {
        text: "",
        voteNum: 0,
        voteUser: []
      }
      this.setData({
        vote: voteMess
      });
    } else {
      wx.showToast({
        title: '还有空白选项奥~',
        icon: "none"
      });
    }
  },
  // 提交投票信息
  sumitVote: function() {
    if(!this.data.vote.title) {
      wx.showToast({
        title: '投票标题必填奥~',
        icon: "none"
      });
      return false;
    }
    if(!(this.data.vote.selectList[0].text && this.data.vote.selectList[1].text)) {
      wx.showToast({
        title: '请至少填写两个选项奥~',
        icon: "none"
      });
      return false;
    }
    var voteMess = this.data.vote;
    voteMess.deadline = +new Date(this.data.date + ' ' + this.data.time);
    voteMess.nickName  = app.globalData.userInfo.nickName;
    voteMess.imgSrc  = app.globalData.userInfo.avatarUrl;
    wx.request({
      url: app.globalData.baseUrl + 'addVote',
      data: voteMess,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var code = res.data.code;
        if(code == 200) {
          wx.showToast({
            title: '添加成功~',
            icon: "none"
          });
          wx.navigateTo({
            url: '../index/index'
          })
          return true;
        } else {
          wx.showToast({
            title: '添加失败,请重试~',
            icon: "none"
          });
          return false;
        }
      },
      fail: function(e) {
        console.log(e);
      }
    });
  },
  // 选择投票类型
  handleVoteType({ detail = {} }) {
    var voteMess = this.data.vote;
    voteMess.voteType = detail.value;
      this.setData({
          vote: voteMess
      });
  },
  // 日期改变
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 时间改变
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  }
});
