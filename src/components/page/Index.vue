<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>预留开发(表暂时未更新)</span></div>
                    <div class="user-info-list">上次登录地点：<span>预留开发(表暂时未更新)</span></div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>系统使用量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-warn grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">248</div>
                                    <div>警告消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-warn grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">116</div>
                                    <div>错误消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options">

                    </schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line1" :data="data1" type="line" :options="options2">

                    </schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                data: [{
                    name: '3.22',
                    value: 70
                },
                    {
                        name: '3.23',
                        value: 45
                    },
                    {
                        name: '3.24',
                        value: 30
                    },
                    {
                        name: '3.25',
                        value: 27
                    },
                    {
                        name: '3.26',
                        value: 49
                    },
                    {
                        name: '3.27',
                        value: 80
                    },
                    {
                        name: '3.28',
                        value: 146
                    }
                ],
                data1: [{
                    name: '3.22',
                    value: 150
                },
                {
                    name: '3.23',
                    value: 126
                },
                {
                    name: '3.24',
                    value: 117
                },
                {
                    name: '3.25',
                    value: 216
                },
                {
                    name: '3.26',
                    value: 114
                },
                {
                    name: '3.27',
                    value: 360
                },
                {
                    name: '3.28',
                    value: 378
                }
                ],
                options: {
                    title: '最近七天响应错误情况',
                    fillColor: 'rgb(242, 94, 67)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '最近七天域名解析错误情况',
                    fillColor: 'rgb(242, 94, 67)',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '管理员';
            }
        },
        created(){
            //this.handleListener();
            this.changeDate();
        },
        activated(){
            //this.handleListener();
        },
        /*deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },*/
        methods: {
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            /*handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },*/
            /*handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },*/
            /*renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }*/
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(255, 255, 70);
    }

    .grid-con-2 .grid-num {
        color: rgb(255, 255, 70);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
