import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization

import '@/icons' // icon
import '@/errorLog'// error log
import '@/permission' // permission control
// import '@/mock' // simulation data
import VueQuillEditor from 'vue-quill-editor'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
