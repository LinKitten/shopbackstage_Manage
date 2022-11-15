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
