import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/login',
            component: resolve => require(['../../src/components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../../src/components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../../src/components/page/403.vue'], resolve)
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/index',
                    component: resolve => require(['../../src/components/page/Index.vue'], resolve)
                },
                {
                    path: '/table/website_table',
                    component: resolve => require(['../components/page/table/WebSiteTable.vue'], resolve)
                },
                {
                    path: '/table/http_table',
                    component: resolve => require(['../components/page/table/HttpTable.vue'], resolve)
                },
                {
                    path: '/table/dns_server_table',
                    component: resolve => require(['../components/page/table/DnsServerTable.vue'], resolve)
                },
                {
                    path: '/monitor/http_monitor',
                    component: resolve => require(['../components/page/monitor/HttpMonitor.vue'], resolve)
                },

                {
                    path: '/monitor/dns_monitor',
                    component: resolve => require(['../components/page/monitor/DnsMonitor.vue'], resolve)
                },
                {
                    path: '/error/http_error',
                    component: resolve => require(['../components/page/error/HttpError.vue'], resolve)
                },
                {
                    path: '/error/dns_error',
                    component: resolve => require(['../components/page/error/DnsError.vue'], resolve)
                },
                {
                    path: '/server/server_table',
                    component: resolve => require(['../components/page/server/ServerTable.vue'], resolve)
                },
                {
                    path: '/server/department_table',
                    component: resolve => require(['../components/page/server/DepartmentTable.vue'], resolve)
                },
                {
                    path: '/server/manager_table',
                    component: resolve => require(['../components/page/server/ManagerTable.vue'], resolve)
                }
            ]
        }
    ]
})
