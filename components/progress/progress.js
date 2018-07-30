//tab.js
Component({
  properties: {
    percent: {
      type: Number,
      value: '1'
    },
    color: {
      type: String,
      value: '#0186fa'
    },
    backgroundColor: {
      type: String,
      value: '#0186fa'
    }
  },
  data: {
    
  },
  onLoad:function () {
    console.log(this.data.activIndex);
  },
  methods: {
    
  }
})