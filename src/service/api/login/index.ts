/**
 * login模块接口列表
 */

// 引入 axios 封装实例
import request from '@/service/request'

// 登录接口
export function loginApi (data:object){
    return request({
        url: '/login-admin',
        method: 'post',
        data
    })
}