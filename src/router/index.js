import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import echartsList from '@/views/echarts/echartsList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/echartsList',
      name: 'echartsList',
      component: echartsList,
      children: [
        {
          path: '/search',
          name: 'search',
          component: () => import('@/views/echarts/map/search')
        },
        {
          path: '/plane',
          name: 'plane',
          component: () => import('@/views/echarts/map/plane')
        },
        {
          path: '/people',
          name: 'people',
          component: () => import('@/views/echarts/map/people')
        },
        {
          path: '/trail',
          name: 'trail',
          component: () => import('@/views/echarts/map/trail')
        },
        {
          path: '/3Dcity',
          name: '3Dcity',
          component: () => import('@/views/echarts/map/3Dcity')
        }
      ]
    }
  ]
})
