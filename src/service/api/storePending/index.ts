/**
 * pendingStore 模块接口列表
 */

// 引入 axios 封装实例
import request from '@/service/request'

// 查询接口
export function pendingStoreSearch(data:object){
    return request({
        url: '/search-pendingStore',
        method: 'POST',
        data
    })
}

// 审核接口
export function pendingStoreExamine(data:object){
    return request({
        url: '/examine-pendingStore',
        method: 'POST',
        data
    })
}

