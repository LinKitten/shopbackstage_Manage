import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '././assets/styles/border.css'
import '././assets/styles/reset.css'

import SvgIcon from '@/icons'
import "@/router/permission.js"


import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.use(store).use(router).use(ElementPlus).use(SvgIcon).mount('#app')
