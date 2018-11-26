import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard'
import SvcTomcat from '@/views/services/Tomcat'
import SvcOther from '@/views/services/Other'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter: function(to, from, next) {
                let account = Vue.prototype.store.getApiAccount();
                if(account === undefined || account === null || account === "") {
                    next("/login");
                }
                else {
                    next(true);
                }
            },
            children: [
                {
                    path: "",
                    component: Dashboard
                },
                {
                    path: "/service/tomcat",
                    component: SvcTomcat
                },
                {
                    path: "/service/other",
                    component: SvcOther
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
})
