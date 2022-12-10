import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Test' }
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "login" */ '@/views/component/Test'),
      meta: {
        showHeader:true,
        showFooter:true,
        requireAuth: false,
        title: '测试 - 奇文股票'
      }
    },
    {
      path: '*',
      name: 'Error_404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/ErrorPage/404.vue'),
      meta: {
        showHeader: true,
        title: '404 - 奇文股票'
      }
    }
  ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

