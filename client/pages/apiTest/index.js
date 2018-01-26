//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        locationResult: '', // 地理位置
        scanResult: '' // 扫码结果
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

    // 获取用户的地理位置
    switchRequestLocation: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequestLocatio()
    },
    doRequestLocatio: function () {
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
                locationResult: JSON.stringify(location)
            })
          }
        })
    },

    // 调用微信扫一扫能力
    switchDoscan: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doScan()
    },
    doScan: function () {
        util.showBusy('请求中...')
        var that = this
        wx.scanCode({
            success: (res) => {
                console.log(res)
                util.showSuccess('请求成功完成')
                that.setData({
                    scanResult: JSON.stringify(res)
                })
            }
        })
    }
})
