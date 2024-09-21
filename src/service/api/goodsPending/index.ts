/**
 * pendingGoods 模块接口列表
 */

// 引入 axios 封装实例
import request from '@/service/request'

// 查询接口
export function pendingGoodsSearch(data:object){
    return request({
        url: '/search-pendingGoods',
        method: 'POST',
        data
    })
}

// 审核接口
export function pendingGoodsExamine(data:object){
    return request({
        url: '/examine-pendingGoods',
        method: 'POST',
        data
    })
}

