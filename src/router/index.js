// import Vue from 'vue';
// import Router from 'vue-router';

const Bill = r => require.ensure([], () => r(require('@/components/bill.vue')), 'Bill');

// Vue.use(Router);
const routes = [
  { path: '/', redirect: '/bill' },
  { path: '/bill', name: 'Bill', component: Bill }
];

export default new VueRouter({
  mode: 'history',
  base: '',
  routes: routes
})