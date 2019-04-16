<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete v-model="select.WebName" placeholder="网站名称" class="inline-input"
                             :fetch-suggestions="querySearch"
                             :trigger-on-focus="false"></el-autocomplete>
            <el-date-picker
                v-model="select.MonitorTime"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '24:00:00']">
            </el-date-picker>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>

        <el-table :data="tableData.slice((paging.page-1)*paging.pageSize,paging.page*paging.pageSize)" border style="width: 100%">
            <el-table-column prop="Id" label="ID">
            </el-table-column>
            <el-table-column prop="Url.WebName" label="网站名称">
            </el-table-column>
            <el-table-column prop="Url.Url" label="网址">
            </el-table-column>
            <el-table-column prop="Time" label="时间">
            </el-table-column>
            <el-table-column prop="ErrorStatus" label="异常信息">
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
    import { timestampToTime,createFilter,errorSearch } from '../../../util/util';


    export default {
        data: function(){
            return {
                tableData: [],
                bufferData: [],
                httpMonitor: false,
                message: '开始检测',
                timer: 0,
                is_search: false,

                first_time: 0,
                last_time: 0,

                webName: [],

                select: {
                    WebName: '',
                    MonitorTime: ''
                },

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 25,//每页的数据数量
                    page: 1,//默认开始页面
                },
            }
        },
        methods: {
            //分页
            handleCurrentChange(val){
                this.paging.page = val;
            },
            getData(){
                if (this.is_search) {
                    this.bufferData = [];
                    errorSearch(this.bufferData,this.tableData,this.paging.total,this.first_time,this.last_time);
                    this.paging.total = this.bufferData.length;
                    this.tableData = this.bufferData;
                }else {
                    this.$axios.get('/api/ccsu/http_monitor/url_error_get').then((res) => {
                        if (res.data.status === 7002) {
                            this.$message.error('未登录');
                            this.$router.push({ path: '/login' });
                        }else {
                            let { urlerror } = res.data;
                            this.tableData = urlerror;
                            this.paging.total = urlerror.length;
                            for (let i = 0; i < urlerror.length; i++){
                                this.tableData[i].Id = i+1;
                                this.tableData[i].Time = timestampToTime(this.tableData[i].Time);
                            }
                            if (this.webName.length === 0){
                                this.loadName(this.webName,this.tableData);
                            }
                        }
                    });
                }
            },
            search() {
                let para = Object.assign({}, this.select);
                if ((para.WebName === '' && para.MonitorTime === '') || (para.MonitorTime === null && para.WebName === '')) {
                    this.is_search = false;
                    this.getData();
                }else {
                    this.is_search = true;
                    this.first_time = para.MonitorTime[0];
                    this.last_time = para.MonitorTime[1];
                    this.getData();
                }
            },
            //返回匹配值
            querySearch(queryString, cb) {
                var webName = this.webName;
                var results = queryString ? webName.filter(createFilter(queryString)) : webName;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            loadName() {
                for (let i = 0; i < this.tableData.length; i++) {
                    let a = 0;
                    for (let n = 0; n < this.webName.length; n++){
                        if (this.webName[n].value === this.tableData[i].Url.WebName) {
                            a = 1;
                            break;
                        }
                    }
                    if (a === 0){
                        this.webName.push({"value" : this.tableData[i].Url.WebName});
                    }
                }
            }
        },
        created(){
            this.getData();
        },
    }
</script>

