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
      redirect: { name: 'Test' }
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "login" */ '@/views/components/Test'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '测试 - 奇文股票'
      }
    },{
      path: '/perfectList',
      name: 'PerfectList',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/PerfectList'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '推荐列表'
      }
    }, {
      path: '/stockBoard',
      name: 'StockBoard',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/StockBoard'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '股票概览'
      }
    },

  ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

