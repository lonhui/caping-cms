import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },

  // 首页
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /**
   * 数据中心
   *    用户活跃
   *    用户留存
   */
  {
    path: '/data-center',
    component: Layout,
    redirect: 'noredirect',
    name: 'dataCenter',
    meta: { title: 'dataCenter', icon: 'chart', id: 17 },
    children: [
      {
        path: 'active',
        name: 'userActive',
        component: () => import('@/views/statistic/active'),
        meta: { title: 'userActive', id: 19 }
      },
      {
        path: 'retention',
        name: 'userRetention',
        component: () => import('@/views/statistic/retention'),
        meta: { title: 'userRetention', id: 18 }
      }
    ]
  },

  /**
   * 我的新闻
   *    等待审核
   *    已上线
   *    被拒绝的
   *    删除的新闻
   *    上传新闻
   *    草稿箱
   *    等待发布的新闻
   *    编辑新闻
   */
  {
    path: '/news',
    component: Layout,
    redirect: 'noredirect',
    name: 'myNews',
    meta: { title: 'myNews', icon: 'documentation', id: 9 },
    children: [
      {
        path: 'verify',
        name: 'waitVerify',
        component: () => import('@/views/news/waitVerify'),
        meta: { title: 'waitVerify', id: 12 }
      },
      {
        path: 'online',
        name: 'online',
        component: () => import('@/views/news/online'),
        meta: { title: 'online', id: 13 }
      },
      {
        path: 'denied',
        name: 'denied',
        component: () => import('@/views/news/denied'),
        meta: { title: 'denied', id: 14 }
      },
      {
        path: 'deleted',
        name: 'deleted',
        component: () => import('@/views/news/deleted'),
        meta: { title: 'deleted', id: 15 }
      },
      {
        path: 'upload',
        name: 'uploadNew',
        component: () => import('@/views/news/addNews'),
        meta: { title: 'uploadNew', id: 11 }
      },
      {
        path: 'draft',
        name: 'draft',
        component: () => import('@/views/news/drafts'),
        meta: { title: 'draft', id: 10 }
      },
      {
        path: 'pending',
        name: 'pending',
        component: () => import('@/views/news/pending'),
        meta: { title: 'pending', id: 16 }
      },
      {
        hidden: true,
        path: 'editNews',
        name: 'editNews',
        component: () => import('@/views/news/editNews'),
        meta: { title: 'editNews' }
      },
      {
        hidden: true,
        path: 'editDraftNews',
        name: 'editDraftNews',
        component: () => import('@/views/news/editDraftNews'),
        meta: { title: 'editDraftNews' }
      }
    ]
  },

  /**
   * 广告管理
   *    新增广告
   *    广告列表
   *    编辑广告
   */
  {
    path: '/adv',
    component: Layout,
    redirect: 'noredirect',
    name: 'adManage',
    meta: { title: 'adManage', icon: 'international', id: 6 },
    children: [
      {
        path: 'list',
        name: 'adList',
        component: () => import('@/views/adv/list'),
        meta: { title: 'adList', id: 7 }
      },
      {
        path: 'add',
        name: 'addAd',
        component: () => import('@/views/adv/add'),
        meta: { title: 'addAd', id: 8 }
      },
      {
        hidden: true,
        path: 'editAdv',
        name: 'editAdv',
        component: () => import('@/views/adv/edit'),
        // 动态添加的路由好像不会过滤掉hidden为true的路由，因此在这里把不显示路由的id设为了-1
        meta: { title: 'editAdv' }
      }
    ]
  },

  /**
   * 系统管理
   *    用户管理
   *    角色管理
   *    系统配置
   *    应用管理
   *    应用属性配置
   */
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    name: 'systemManage',
    meta: { title: 'systemManage', icon: 'setting', id: 1 },
    children: [
      {
        path: 'user',
        name: 'userManage',
        component: () => import('@/views/setting/user'),
        meta: { title: 'userManage', id: 2 }
      },
      {
        path: 'role',
        name: 'roleManage',
        component: () => import('@/views/setting/role'),
        meta: { title: 'roleManage', id: 3 }
      },
      {
        path: 'system',
        name: 'systemConfig',
        component: () => import('@/views/setting/system'),
        meta: { title: 'systemConfig', id: 4 }
      },
      {
        path: 'app',
        name: 'appManage',
        component: () => import('@/views/setting/app'),
        meta: { title: 'appManage', id: 5 }
      },
      {
        path: 'topicModule',
        name: 'topicModule',
        component: () => import('@/views/setting/topicModule'),
        meta: { title: 'topicModule', id: 6 }
      },
      {
        hidden: true,
        path: 'app-config',
        name: 'appConfig',
        component: () => import('@/views/setting/appConfig'),
        meta: { title: 'appConfig' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
