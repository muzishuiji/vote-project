//tab.js
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
      console.log(e);
      if(e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo;
        console.log(app.globalData.userInfo);
        this.triggerEvent("hideModal", true);
      } 
    }
  }
})