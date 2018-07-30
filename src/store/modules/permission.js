import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.id判断是否与当前用户的菜单列表匹配
 * @param {Array} routes 用户菜单列表
 * @param {Object} route 异步路由表
 */
function containsRoute(routes, route) {
  if (route.meta && route.meta.id) {
    return routes.some(r => (route.meta.id === r.id || route.meta.id === r.parent_id))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户菜单列表的路由表
 * @param {Array} asyncRouterMap 异步路由表
 * @param {Array} routes 用户菜单列表
 */
function filterAsyncRouter(asyncRouterMap, routes) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (containsRoute(routes, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, routes)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routes } = data
        let accessedRouters = filterAsyncRouter(asyncRouterMap, routes)
        // 一级路由因为没有id因此都会被添加进来，如果没有子路由是没有意义的，在此过滤掉
        // 不要把404也给过滤掉
        accessedRouters = accessedRouters.filter(route => route.path === '*' || route.children && route.children.length)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
