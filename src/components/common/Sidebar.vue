<!--<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes"
                 class="el-menu-vertical-demo"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>-->
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: '/index',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '1',
                        title: '网站管理',
                        subs: [
                            {
                                index: '/table/website_table',
                                title: '网站信息表'
                            },
                            {
                                index: '/table/dns_server_table',
                                title: 'DNS服务器表'
                            },

                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '监控管理',
                        subs: [
                            {
                                index: '/monitor/http_monitor',
                                title: '响应检测'
                            },
                            {
                                index: '/monitor/dns_monitor',
                                title: '域名解析'
                            },
                            {
                                index: '/monitor/dns_table',
                                title: '服务器监控'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '3',
                        title: '服务器管理',
                        subs: [
                            {
                                index: '/server/server_table',
                                title: '服务器信息表'
                            },
                            {
                                index: '/server/manager_table',
                                title: '管理员信息表'
                            },
                            {
                                index: '/server/department_table',
                                title: '责任部门信息表'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '4',
                        title: '错误警告处理',
                        subs: [
                            {
                                index: '/error/dns_error',
                                title: '响应错误历史'
                            },
                            {
                                index: '/error/http_error',
                                title: '解析错误历史'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
