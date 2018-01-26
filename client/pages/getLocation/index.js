//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },

    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestLocation: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest1()
    },

    doRequest1: function () {
        util.showBusy('请求中...')
        var that = this
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            var latitude = '经度: ' + res.latitude // 经度
            var longitude ='纬度: ' + res.longitude // 纬度
            console.log(latitude, longitude)
            var location = '当前位置：' + latitude + longitude
            util.showSuccess('请求成功完成')
            that.setData({
                requestResult: JSON.stringify(location)
            })
          }
        })
    }
})
