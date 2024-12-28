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
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/Test'),
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
    {
      path: '/noticeHistory',
      name: 'NoticeHistory',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/NoticeHistory'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '异动通知历史'
      }
    },
    {
      path: '/viewPanel',
      name: 'ViewPanel',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/StockViewPanel'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '查看面板'
      }
    },{
      path: '/historySold',
      name: 'HistorySold',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/HistorySold'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '历史清空代码'
      }
    },
    {
      path: '/stockSelect',
      name: 'stockSelect',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/StockSelectPanel'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '逻辑选股'
      }
    },
    {
      path: '/lineView',
      name: 'LineViewPanel',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/LineViewPanel'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '图表查询'
      }
    },
    {
      path: '/monitor',
      name: '监控',
      component: () => import(/* webpackChunkName: "login" */ '@/views/page/StockMonitor'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '监控'
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

