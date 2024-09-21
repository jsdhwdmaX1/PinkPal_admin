/**
 *  axios 请求封装
 */

// 引入 axios
import axios from 'axios'

// 创建 axios 实例
const service  = axios.create({
    // 请求基础路径
    baseURL: '/api',
    // 请求超时时间
    timeout: 3000000,
    // 跨域时候允许携带凭证
    withCredentials: true
})

// 请求拦截器  ==>  在发送请求之前做些什么
// 比如请求头携带 token
service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 响应拦截器  ==>  对响应数据做点什么
// 比如对响应码进行统一处理
service.interceptors.response.use(
    response => {
        if(response.status !== 200){
            // 对响应错误做点什么
            return Promise.reject(response)
        }
        // 对响应数据做点什么
        return response
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

// 导出 axios 实例
export default service