// 引入参数(动态路由、静态路由)
import { asyncRoutes, constantRoutes } from '\router'

// 方法
function hasPermission (roles, route) {
  // 判断是否有roles，roles是否一致,有则需判断用户权限
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role)) // 判断返回true
  } else {
    return true
  }
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes带判定路由
 * @param roles 用户拥有的角色
 */
export function filterAsyncRoutes (routes, roles) { // 过滤器动态路由
  const res = []
  routes.forEach(route => {
    const tmp = { ...route } // 循环数据组成对象
    if (hasPermission(roles, tmp)) { // roles，是否为true
      if (tmp.children) { // 子路由的角色判断
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

// state存储
const state = {
  routes: [],
  addRoutes: []
}

// mutations 方法
const mutations = {
  set_ROUTES: (state, routes) => {
    state.addRoutes = routes // 添加的routes
    state.routes = constantRoutes.concat(routes) // 路由添加后，完整的routes
  }
}

// 活动 存储方法(支持异步执行)
const actions = {
  generateRoutes ({commit}, roles) {
    return new Promise(resolve => { // 异步获取
      let accessedRoutes // 添加的动态路由
      if (roles.includes('admin')) { // 角色判断，动态添加路由
        accessedRoutes = asyncRoutes || [] // 获取动态路由表
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles) // 路由权限判断
      }
      commit('set_ROUTES', accessedRoutes) // 存储路由到state
      resolve(accessedRoutes) // 执行成功返回
    })
  }
}
// 申明引入
export default {
  state,
  mutations,
  actions
}
