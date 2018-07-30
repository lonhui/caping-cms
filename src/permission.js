/* eslint-disable */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// function hasPermission(menus, id) {
//   if (!id) return true
//   return menus.some(menu => menu.id === id)
// }

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.allowed_menus.length === 0) {
        try {
          // 拉取用户信息菜单列表
          const routes = await store.dispatch('GetUserMenus')
          // console.info(routes)
          await store.dispatch('GenerateRoutes', { routes }) // 根据用户菜单列表生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        } catch (error) {
          store.dispatch('FedLogOut').then(() => {
            Message.error('Authentication failed, please re-login.')
            next({ path: '/login' })
          })
        }
      } else {
        // FIXME: 401这里没起作用，会直接跳转到404，没找到原因，暂时弃用
        // if (hasPermission(store.getters.allowed_menus, to.meta.id)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true })
        // }
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
