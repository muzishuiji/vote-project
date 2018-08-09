//app.js
App({
  globalData: {
    userInfo: null,
    vote:{},
    _id: '',
    // baseUrl: 'http://lzx2005.com:3000',
    baseUrl: 'https://api.lzx2005.com/',
    sessionId: null
  },
  onLaunch: function () {
    // appid: wx4a96dbab66a34495
    // appSecret:00dff3bcddf0896db2f86631ebf2bfde
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    const app = getApp();
   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
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
  loginIn: function(info) {
    const app = getApp();
    return new Promise((resolve,reject) => {
      wx.login({
        success: res => {
          let params = {
            code: res.code, 
            avatarUrl: info.avatarUrl,
            city: info.city, 
            country: info.country, 
            language: info.language, 
            nickName: info.nickName, 
            province: info.province
          };
          wx.request({
            url: this.globalData.baseUrl + 'auth/getSession', 
            method: 'GET',
            data: params,
            header: {
            'content-type': 'application/json'
            },
            success: (res) => {
              wx.hideLoading();
              if(res.data.code == 200) {
                app.globalData.sessionId = res.data.data.sessionId;   
              }   
              resolve(res); 
            },
            fail: (err) => {
              wx.hideLoading();
              // console.log(err);
              reject("请求失败,请检查网络设置");
              return false;
            }
          });
        }
      })
    })
  },
  // 用户授权
  authJudge: function(self,cb) {
    const app = getApp();
    return new Promise((resolve,reject) => {
      if (app.globalData.userInfo) {
        self.setData({
          hasUserInfo: false
        });
        resolve(app.loginIn(app.globalData.userInfo));
      } else if (self.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          if(res.authSetting) {
            self.setData({
              hasUserInfo: true
            });
          } else {
            self.setData({
              hasUserInfo: false
            });
            resolve(app.loginIn(app.globalData.userInfo));
          }
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            self.setData({
              hasUserInfo: false
            });
          }
        });
        resolve(app.globalData.userInfo);
      }
    })
  }
  
})