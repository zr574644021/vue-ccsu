<template>
    <div class="table">
        <div class="handle-box">
            <el-button id="monitor" type="primary" @click="handleMonitor">{{message}}</el-button>
        </div>

        <el-table :data="tableData.slice((paging.page-1)*paging.pageSize,paging.page*paging.pageSize)" border style="width: 100%">
            <el-table-column prop="Id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="WebName" label="网站名称" width="140">
            </el-table-column>
            <el-table-column prop="Url" label="网址">
            </el-table-column>
            <el-table-column prop="ResponseTime" label="响应时间(ms)">
            </el-table-column>
            <el-table-column prop="Status" label="返回信息">
            </el-table-column>
            <el-table-column prop="imgPath" label="状态">
                <template slot-scope="scope">
                <img :src="scope.row.imgPath">
                </template>
            </el-table-column>
        </el-table>

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
    export default {
        data: function(){
            return {
                tableData: [],
                bufferData: [],
                httpMonitor: false,
                message: '开始检测',
                timer: 0,
                first_time:0,
                last_time:0,
                //imgPath: [],//图片路径

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },
            }
        },
        methods: {
            //分页
            handleCurrentChange(val){
                this.paging.page = val;
            },
            //检测
            handleMonitor(){
                if(this.message === '开始检测'){
                    this.httpMonitor = true;
                    this.message = '停止检测';
                    document.getElementById("monitor").style.background = "red";
                    this.getData();
                    this.timer = window.setInterval(this.getData,180000);
                }else {
                    this.httpMonitor = false;
                    document.getElementById("monitor").style.background = "#20a0ff";
                    this.message = '开始检测';
                    window.clearInterval(this.timer);
                }
            },
            getData(){
                if (this.httpMonitor){
                    this.$axios.get('/httpmonitor/now').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                        }else {
                            let  { record }  = res.data;
                            this.tableData = record;
                            this.bufferData = record;
                            this.paging.total = record.length;
                            for (var i=0; i<record.length; i++){
                                switch (record[i].Status){
                                    case "200 OK":
                                        this.tableData[i].imgPath = "../../../../static/img/safe.png";
                                        break;
                                    case "403 Forbidden":
                                        this.tableData[i].imgPath = "../../../../static/img/threaten.png";
                                        break;
                                    case "OutTime":
                                        this.tableData[i].imgPath = "../../../../static/img/warning.png";
                                        break;
                                    default :
                                        this.tableData[i].imgPath = "../../../../static/img/threaten.png";
                                        break;
                                }
                            }
                        }
                    });
                }else {
                    this.$axios.get('/httpmonitor/geturlall').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                        }else {
                            if (this.bufferData.length === 0){
                                let  { record }  = res.data;
                                this.tableData = record;
                                this.paging.total = record.length;
                            }else {
                               this.tableData = this.bufferData;
                            }
                        }
                    });
                }
            }
        },
        created(){
            this.getData();
        },
    }
</script>
