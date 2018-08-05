//newNormal.js
const app = getApp();
Page({
  data: {
    checkboxItems: [
      { name: '单选', id: '1', checked: true },
      { name: '多选', id: '2' }
    ],
    voteType: '单选',
    startDate: '',
    endDate: '2020-01-01',
    date: '2016-09-01',
    time: '12:01',
    voteMess: {
      anonymous: false,
      endTime: new Date().getTime(),
      items: ['',''],
      publish: true,
      title: '',
      multiple: false
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
    var voteMess = this.data.voteMess;
    voteMess.items[e.target.dataset.id] = e.detail.value;
    this.setData({
      voteMess: voteMess
    });
  },
  bindTitleInput: function (e) {
    var voteMess = this.data.voteMess;
    voteMess.title = e.detail.value;
    this.setData({
      voteMess: voteMess
    });
  },
  // 删除选项
  deleteSelect: function (e) {
    var voteMess = this.data.voteMess;
    voteMess.items.length > 1 ? voteMess.items.splice(e.target.dataset.id, 1) : wx.showToast({
      title: '不能再少了奥~',
      icon: "none"
    });
    this.setData({
      voteMess: voteMess
    });
  },
  // 新增选项
  addSelect: function() {
    let voteMess = this.data.voteMess;
    let flag = true;
    for(let i = 0; i < voteMess.items.length; i++) {
      if(voteMess[i] == '') {
        flag = false;
        wx.showToast({
          title: '还有空白选项奥~',
          icon: "none"
        });
        return false;
      }
    }
    voteMess.items[voteMess.items.length] = '';
    this.setData({
      voteMess: voteMess
    });
  },
  // 提交投票信息
  submitVote: function() {
    var voteMess = this.data.voteMess;
    if(!voteMess.title) {
      wx.showToast({
        title: '投票标题必填奥~',
        icon: "none"
      });
      return false;
    }
    for(let i = 0; i < voteMess.items.length; i++) {
      if(voteMess[i] == '') {
        voteMess.items.splice(i,1);
      }
    }
    if(voteMess.items.length < 2){
      wx.showToast({
        title: '请至少填写两个选项奥~',
        icon: "none"
      });
      return false;
    }
    voteMess.endTime = +new Date(this.data.date + ' ' + this.data.time);
    let nowDate = +new Date();
    if(voteMess.endTime <= nowDate) {
      wx.showToast({
        title: '结束时间需晚于当前时间奥~',
        icon: "none"
      });
      return false;
    }
    voteMess.multiple = this.data.voteType == '单选' ? false : true;
    wx.request({
      url: app.globalData.baseUrl + 'normal', 
      method: 'POST',
      data: voteMess,
      header: {
        'content-type': 'application/json',
        'sessionId': app.globalData.sessionId
      },
      success: (res) => {
        let response = res;
        console.log(res);
        if(response.data.message == '请求成功') {
          if(voteMess.publish) {
            wx.redirectTo({
              url: '../normal/normal'
            })
          } else {
            wx.redirectTo({
              url: '../mine/mine'
            })
          }
        }
        return true;
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: '失败了,请检查网络设置~',
          icon: "none"
        });
        return false;
      }
    });
  },
  // 选择投票类型
  handlevoteType({ detail = {} }) {
    let voteType= detail.value;
    console.log(voteType);
    this.setData({
      voteType:voteType 
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
  },
  // 切换switch开关
  switchChange: function(event){
    let detail = event.detail;
    let voteMess = this.data.voteMess;
    voteMess.anonymous = event.detail.value;
    this.setData({
      voteMess : voteMess
    });
  },
  switchChange1: function(event){
    let detail = event.detail;
    let voteMess = this.data.voteMess;
    voteMess.publish = event.detail.value;
    this.setData({
      voteMess : voteMess
    });
  },
});
