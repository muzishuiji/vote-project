//tab.js
Component({
  properties: {
    activIndex: {
      type: String,
      value: '1'
    }
  },
  data: {
    
  },
  onLoad:function () {
    console.log(this.data.activIndex);
  },
  methods: {
    openPage: function (e) {
      var id = e.currentTarget.dataset.id;
      console.log(id);
      if(id == '1' && this.data.activIndex != '1') {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      } else if(id == '2' && this.data.activIndex != '2') {
         wx.redirectTo({
          url: '/pages/mine/mine'
        })
      }
    }
  }
})