import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import( '../views/layout/index.vue'),
    redirect:"/home",
    children:[
      {
        path: '/home',
        name: '首页',
        component: () => import( '../views/home/index.vue')
      },
      {
        path: '/bigType',
        name: '商品大类',
        component: () => import( '../views/bigType/index.vue')
      },
      
      {
        path: '/smallType',
        name: '商品小类',
        component: () => import( '../views/smallType/index.vue')
      },
      
      {
        path: '/product',
        name: '商品管理',
        component: () => import( '../views/product/index.vue')
      },
      {
        path: '/user',
        name: '用户管理',
        component: () => import( '../views/user/index.vue')
      },
      {
        path: '/modifyPassword',
        name: '修改密码',
        component: () => import( '../views/modifyPassword/index.vue')
      }
      ,
      {
        path: '/order',
        name: '订单管理',
        component: () => import( '../views/order/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
