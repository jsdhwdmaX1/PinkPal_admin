/**
 * store 模块接口列表
 */

// 引入 axios 封装实例
import request from '@/service/request'

// 查询接口
export function storeSearch(data:object){
    return request({
        url: '/search-store',
        method: 'POST',
        data
    })
}

// 更新状态接口
export function storeUpdateStateBySid(data:object){
    return request({
        url: '/update-store-state',
        method: 'POST',
        data
    })
}

// 删除接口
export function storeDeleteBySid(data:object){
    return request({
        url: '/delete-store',
        method: 'POST',
        data
    })
}

