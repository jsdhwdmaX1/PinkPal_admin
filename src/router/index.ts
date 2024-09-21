import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Root',
            component: () => import('@/views/Root/index.vue'),
            redirect : '/login',
            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: () => import('@/views/Root/Home.vue'),
                    meta: {
                        title: '首页',
                        affix: true
                    }
                },
                {
                    path: '/store',
                    name: 'Store',
                    children: [
                        {
                            path: '/store/storeList',
                            name: 'StoreList',
                            component: () => import('@/views/Root/Store/StoreList.vue'),
                            meta: {
                                title: '商家列表'
                            }
                        },
                        {
                            path: '/store/storeExamine',
                            name: 'StoreExamine',
                            component: () => import('@/views/Root/Store/StoreExamine.vue'),
                            meta: {
                                title: '商家审核'
                            }
                        }
                    ]
                },
                {
                    path: '/goods',
                    name: 'Goods',
                    children: [
                        {
                            path: '/goods/goodsList',
                            name: 'GoodsList',
                            component: () => import('@/views/Root/Goods/GoodsList.vue'),
                            meta: {
                                title: '商品列表'
                            }
                        },
                        {
                            path: '/goods/goodsExamine',
                            name: 'GoodsExamine',
                            component: () => import('@/views/Root/Goods/GoodsExamine.vue'),
                            meta: {
                                title: '商品分类'
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/Login/index.vue'),
        }
    ]
})

export default router;