//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    onShow: function() {
        console.log('on show')
    },
    onHide: function() {
       console.log('on hide') 
    }
})