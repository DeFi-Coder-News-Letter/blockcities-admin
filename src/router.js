import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/specials',
            name: 'specials',
            component: () => import(/* webpackChunkName: "specials" */ './views/Specials.vue')
        },
        {
            path: '/config',
            name: 'config',
            component: () => import(/* webpackChunkName: "config" */ './views/Config.vue')
        }
    ]
});
