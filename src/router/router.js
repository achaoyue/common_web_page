import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'Error_404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/ErrorPage/404.vue'),
      meta: {
        showHeader: true,
        title: '404 - 奇文股票'
      }
    },
    {
      path: '/',
      name: 'Home',
      // redirect: { name: 'PerfectList' }
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/IndexPage'),
      meta: {
        showHeader:false,
        showFooter:false,
        requireAuth: false,
        title: '测试 - 奇文股票'
      }
    },
    {
      path: '/perMonitory',
      name: '监控',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/cooperate/PerMonitor'),
      meta: {
        showHeader:false,
        showFooter:false,
        requireAuth: false,
        title: '监控'
      }
    },
  ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

