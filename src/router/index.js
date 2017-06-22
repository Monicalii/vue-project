import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import shoppingCart from '@/components/shoppingCart'
import address from '@/components/address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/shoppingCart',
      name: 'shoppingCart',
      component: shoppingCart
    },
    {
      path: '/address',
      name: 'address',
      component: address
    }
  ]
})
