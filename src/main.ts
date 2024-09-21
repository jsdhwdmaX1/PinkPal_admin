import { createApp } from 'vue'
import App from './App.vue'
//获取应用实例对象
const app = createApp(App)

//引入全局样式
import '@/assets/css/style.css'
import '@/assets/css/font.css'

//路由
import router from '@/router'
app.use(router)  //挂载路由

//仓库
import pinia from '@/store'
app.use(pinia)  //挂载仓库

//element-plus
import ElementPlus from 'element-plus'; //引入element-plus
import 'element-plus/dist/index.css'; //引入element-plus样式
import zhCn from 'element-plus/es/locale/lang/zh-cn' //引入element-plus国际化
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //引入element-plus图标
app.use( ElementPlus,{ locale:zhCn } ) //挂载element-plus ,配置element-plus国际化

//svg-icon配置
for (const [key, value] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, value)  //挂载element-plus图标
}


//挂载实例
app.mount('#app')


