//auth.js
const app = getApp();

Component({
  properties: {
  },
  data: {
    
  },
  methods: {
    onLoad:function () {
      
    },
    // 获取用户信息
    getUserInfo: function(e) {
      if(e.detail.userInfo) {
        this.triggerEvent("hideModal", true);
        app.globalData.userInfo = e.detail.userInfo;
        app.loginIn(e.detail.userInfo).then((res) => {
          wx.hideLoading();
        });
      } 
    }
  }
})