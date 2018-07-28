//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        } else {
          this.userInfoReadyCallback(res);
        }
      }
    })
  },
  // 时间处理函数
  dealTime: function(date) {
    var str = '';
    var day = Math.floor((date - new Date().getTime()) / (24*3600*1000));
    var hour = Math.floor((date - new Date().getTime() - day * 24 * 3600 * 1000) / (3600 * 1000));
    if(day < 0) {
      str = '投票截止';
      return str;
    } else {
      str += day + "天" + hour + "时";
      return str;
    }
  },
  // 封装的请求函数
  requestData: function(url, method, data) {
    return async() => {
      wx.request({
        url: url, 
        method: method,
        header: {
        'content-type': 'application/json'
        },
        data: data,
        success: function(res) {
          var response = res.data.data;
          console.log(response);
          return response;
        },
        fail: function(err) {
          console.log(err);
          return [];
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    vote:{},
    _id: '',
    // baseUrl: 'http://lzx2005.com:3000',
    baseUrl: 'http://lzx2005.com/',
  }
})