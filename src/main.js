// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import router from './router';

// import ElementUI from 'element-ui';
import App from './App.vue';

// Vue.use(ElementUI);

// 封装ajax调用方法
import ajax from '@/common/tools/ajax.js';
// 全局增加http请求
window.$http = ajax;

// 去除“You are running Vue in development mode”提示
Vue.config.productionTip = false;

/**
 * @description 生成Vue工程
 */
function newVue() {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        data: {
        },
        components: {
            App
        },
        template: '<App/>',
        beforeCreate() {
        },
        watch: {
            '$route': function (to, from, next) {
            }
        },
        created() { },
        mounted() {},
        methods: {}
    })
}


// 初始化工程
newVue();