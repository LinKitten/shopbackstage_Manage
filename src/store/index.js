import { createStore } from 'vuex'
import router from '@/router'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    // 安全退出
    logout(){
      // 清理缓存
      window.sessionStorage.clear()
      window.localStorage.clear() 
      // 回到登录页面
      router.replace("/login")

    }

  },
  modules: {
  }
})
