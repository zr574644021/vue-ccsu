<template>
    <div class="table">
        <div class="handle-box">
            <el-button id="monitor" type="primary" @click="buttonMonitor">{{message}}</el-button>
        </div>

        <div class="dns-list">
            <div class="list-header">
                <div class="list-row">
                    <div class="column1">ID</div>
                    <div class="column2">网站名称</div>
                    <div class="column3">网址</div>
                    <div class="column4">IP</div>
                    <div class="column5">解析结果</div>
                </div>
            </div>
            <div class="list-body" v-for="item in tableData.slice((paging.page-1)*paging.pageSize,paging.page*paging.pageSize)">
                <div class="list-row">
                    <div class="column1">{{ item.Id }}</div>
                    <div class="column2">{{ item.WebName }}</div>
                    <div class="column3">{{ item.Url }}</div>
                    <div class="column4">{{ item.Ip }}</div>
                    <div class="column5">
                        <a :id="item.Id" v-bind:class="{ 'pull-right el-icon-arrow-up': is_A, 'pull-right el-icon-arrow-down': !is_A }" @click="showMonitor(item.Id)">
                        </a>
                    </div>
                </div>
                <div class="dns-detail hide" :id="'detail'+item.Id">
                    <!--<div class="list-header">
                        <div class="list-row">
                            <div class="column1">ID</div>
                            <div class="column2">运营商</div>
                            <div class="column3">DNSIP</div>
                            <div class="column4">解析时间</div>
                            <div class="column5">返回信息</div>
                            <div class="column6">解析IP</div>
                            <div class="column7">监测状态</div>
                        </div>
                    </div>-->

                    <!--<el-table v-if="resultData[item.Id-1].length !== 0" :data="resultData[item.Id-1].slice((respaging.page[item.Id-1]-1)*respaging.pageSize,respaging.page[item.Id-1]*respaging.pageSize)" border style="width: 100%">

                    </el-table>-->

                    <el-table :data="resultData[item.Id-1]" >
                        <el-table-column prop="Id" label="ID">
                        </el-table-column>
                        <el-table-column prop="Carrier.Address" label="地址">
                        </el-table-column>
                        <el-table-column prop="Carrier.Carrier" label="运营商">
                        </el-table-column>
                        <el-table-column prop="Carrier.DnsIp" label="DNSIP">
                        </el-table-column>
                        <el-table-column prop="MonitorTime" label="解析时间">
                        </el-table-column>
                        <el-table-column prop="ErrorMsg" label="返回信息">
                        </el-table-column>
                        <el-table-column prop="ResolveIp" label="解析IP">
                        </el-table-column>
                        <el-table-column prop="imgPath" label="状态">
                            <template slot-scope="scope">
                                <img :src="scope.row.imgPath">
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<div class="list-body" v-for="res in resultData[item.Id-1]/*.slice((respaging.page[item.Id-1]-1)*respaging.pageSize,respaging.page[item.Id-1]*respaging.pageSize)*/">
                        <div  class="list-row">
                            <div class="column1">{{ res.Id }}</div>
                            <div class="column2">{{ res.Carrier.Address+res.Carrier.Carrier }}</div>
                            <div class="column3">{{ res.Carrier.DnsIp }}</div>
                            <div class="column4">{{ res.MonitorTime }}</div>
                            <div class="column5">{{ res.ErrorMsg }}</div>
                            <div class="column6">{{ res.flag }}</div>
                            <div class="column7"><img :src="res.imgPath"></div>
                        </div>
                    </div>-->

                </div>
            </div>
        </div>

        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                layout="total, prev, pager, next"
                :total="paging.total"
                :page-size="paging.pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { timestampToTime } from '../../../util/util';

    export default {
        data: function(){
            return {
                tableData: [],
                bufferData: [],
                dnsMonitor: false,
                message: '开始检测',
                is_A:false,
                resBuffData: [],
                resultData: [],

                timerFlag: 0,
                timer: 0,
                //flag: 0,

                first_time: 0,
                last_time: 0,

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                }
            }
        },
        methods: {
            //分页
            handleCurrentChange(val){
                this.paging.page = val;
            },
            //检测
            buttonMonitor(){
                if(this.message === '开始检测'){
                    this.dnsMonitor = true;
                    this.message = '停止检测';
                    document.getElementById("monitor").style.background = "red";
                    this.getData();
                    //console.log(111);
                    this.timer = window.setInterval(this.getData,300000);
                }else {
                    this.dnsMonitor = false;
                    this.message = '开始检测';
                    document.getElementById("monitor").style.background = "#20a0ff";
                }
                //this.handleMonitor();
            },
            /*//定时器
            handleMonitor(){
                if (this.dnsMonitor){
                    this.getData();
                    //console.log(111);
                    this.timer = window.setInterval(this.getData,3000);
                }else {
                    window.clearInterval(this.timer);
                }
            },*/
            //折叠展开监测信息
            showMonitor(id) {
                let oa = document.getElementById(id);
                let ob = document.getElementById('detail'+id);
                oa.is_A = !oa.is_A;
                if (oa.is_A){
                    oa.className = 'el-icon-arrow-up';
                    ob.className = 'dns-detail';
                }else {
                    oa.className = 'el-icon-arrow-down';
                    ob.className = 'dns-detail hide';
                }
            },
            getData(){
                if (this.dnsMonitor){
                    this.$axios.get('/dnsmonitor/getresult').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                        }else {
                            let  { record }  = res.data;
                            this.resBuffData = record;
                            for (var i=0; i<record.length; i++){
                                this.resBuffData[i].flag = 0;
                                switch (record[i].Status){
                                    case 0:
                                        this.resBuffData[i].imgPath = "../../../../static/img/safe.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                    case 1:
                                        this.resBuffData[i].imgPath = "../../../../static/img/threaten.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                    case 2:
                                        this.resBuffData[i].imgPath = "../../../../static/img/warning.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                }
                            }
                            this.resDataSlice(record);
                        }
                    });
                }else {
                    this.$axios.get('/dnsmonitor/getdnsall').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                        }else {
                            let  { record }  = res.data;
                            this.tableData = record;
                            this.paging.total = record.length;
                        }
                    });
                }


            },
            /*getMonitorData() {
                if (this.dnsMonitor){
                    this.$axios.get('/api/dnsmonitor/getresult').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                        }else {
                            let  { record }  = res.data;
                            this.resBuffData = record;
                            for (var i=0; i<record.length; i++){
                                this.resBuffData[i].flag = 0;
                                switch (record[i].Status){
                                    case 0:
                                        this.resBuffData[i].imgPath = "../../../../static/img/safe.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                    case 1:
                                        this.resBuffData[i].imgPath = "../../../../static/img/threaten.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                    case 2:
                                        this.resBuffData[i].imgPath = "../../../../static/img/warning.png";
                                        this.resBuffData[i].flag++;
                                        break;
                                }
                            }
                            this.resDataSlice(record);
                        }
                    });
                }
            },*/
            //二维数组
            resDataSlice (record){
                let first = 0;
                let last = 0;
                for (let i = 0; i < this.paging.total; i++){
                    let a = 0;
                    for (let j=0; j < record.length; j++){
                        if (this.resBuffData[j].Dns.Id === i+1){
                            this.resBuffData[j].Id = a+1;
                            this.resBuffData[j].MonitorTime = timestampToTime(this.resBuffData[j].MonitorTime);
                            a++;
                        }
                    }
                    last += a;
                    this.resultData[i] = this.resBuffData.slice(first,last);
                    first += a;
                }
            }
        },
        created(){
            //this.dnsMonitor = true;
            this.getData();
            //this.getMonitorData();
        }
    }
</script>

<style scoped>
    .list-row {
        height: 29px;
        padding: 12px 3%;
        line-height: 29px;
    }

    .list-body .list-row {
        padding: 12px 2%;
        border-bottom: 2px dotted #f5f5f5;
        color: #666;
    }

    .dns-list {
        background-color: #fff;
        padding-bottom: 20px;
        border: 1px solid #e5e5e5;
    }

    .list-header {
        border: 1px solid #f5f5f5;
        font-weight: 700;
        font-size: 14px;
    }

    .list-body {
        font-size: 14px;
        color: #1f2d3d;
    }

    .list-row div {
        display: inline-block;
        overflow: hidden;
        height: 29px;
        line-height: 29px;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        z-index: 1000;
    }

    .column1, .column2, .column3,
    .column4, .column5 {
        float: left;
    }

    .column1,.column5 {
        width: 15%;
    }

    .column2,.column3 {
        width: 25%;
    }

    .column4 {
        width: 20%;
    }

    .hide {
        display: none;
    }

    .dns-detail .column1, .dns-detail .column2{
        width: 10%;
    }


    .dns-detail .column3,.dns-detail .column4 {
        width: 15%;
    }

    .dns-detail .column5{
        width: 20%;
    }

    .dns-detail {
        border-bottom: 2px dotted #f5f5f5;
        text-align: center;
    }

    .dns-detail .list-row {
        height: 34px;
        line-height: 34px;
    }

    a{
        cursor: pointer;
    }
    a:hover {
        color: #4090ff;
    }
</style>
