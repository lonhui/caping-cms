# CAPING CMS

> Based on [vueAdmin-template](https://github.com/PanJiaChen/vueAdmin-template), you can get more information in [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

## Build Setup

``` bash
# Install dependencies
yarn

# serve with hot reload at localhost:9528
npm start

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report
```

## 注意事项

### 修改左侧菜单（新增、修改或删除）

1. `src/config/menus.js` 维护了 **角色管理** 里的菜单树，修改菜单时需要在此文件中配置一下。
`id`与后台配置保持一致，`label`为国际化使用的*key*，通过`children`嵌套路由来满足需求。

2. `src/router/index.js` 里的 `asyncRouterMap` 是异步路由表，用户成功登录之后将根据 **用户菜单列表** 与 **异步路由表** 进行比较，从而生成用户可访问的所有路由。此文件里的 `constantRouterMap` 是所有人均可访问的路由，例如 **登录界面**。如果是添加所有人都可访问的路由，那么直接在 `constantRouterMap` 里添加即可。如果添加有权限控制的路由，则需要遵守：

    a. **一级菜单** 不需要在 `meta` 中配置 `id`

    b. **子菜单** 根据后台配置的菜单 `id` 配置到 `meta` 中
