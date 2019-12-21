import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter, { RouterOptions, RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = <Array<RouteConfig>>[
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/oauth_callback',
    name: 'oauth_callback',
    component: () => import('../views/OauthCallback.vue')
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/Messages.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/Logout.vue')
  }
]

const router = new VueRouter(<RouterOptions>{
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
