<template>
    <div class="table">
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-autocomplete v-model="select.WebName" placeholder="网站名称" class="inline-input"
                      :fetch-suggestions="query"
                      :trigger-on-focus="false"></el-autocomplete>
            <el-input v-model="select.Url" placeholder="链接" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData.slice((paging.page-1)*paging.pageSize,paging.page*paging.pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="Id" label="ID" width="60">
            </el-table-column>
            <!--<el-table-column prop="Id" label="ID" sortable width="150">
            </el-table-column>-->
            <el-table-column prop="WebName" label="网站名称" width="140">
            </el-table-column>
            <el-table-column prop="Url" label="网址">
            </el-table-column>
            <el-table-column prop="SleepTime" label="监测频率(分钟)">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="FormRules" ref="editForm">
                <el-form-item label="网站名称" prop="WebName">
                    <el-input v-model="editForm.WebName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="监测频率(分钟)">
                    <el-input v-model="editForm.SleepTime" auto-complete="off" :disabled="true"></el-input>
                    <!--<el-radio-group v-model="editForm.SleepTime">
                        <el-radio class="radio" :label="1">5</el-radio>
                        <el-radio class="radio" :label="0">10</el-radio>
                    </el-radio-group>-->
                </el-form-item>
                <el-form-item label="网址" prop="Url">
                    <el-input v-model="editForm.Url" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="FormRules" ref="addForm">
                <el-form-item label="网站名称" prop="WebName">
                    <el-input v-model="addForm.WebName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="监测频率(分钟)">
                    <el-input v-model="addForm.SleepTime" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="网址" prop="Url">
                    <el-input v-model="addForm.Url" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { loadName,createFilter } from "../../../util/util";
    import { getHttpData } from "../../../api/api";

    export default {
        data() {
            return {
                tableData: [],//存储json数据
                multipleSelection: [],

                webName: [],

                select: {
                    WebName: '',
                    Url: '',
                },

                urls: [],//存储删除数据

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                FormRules: {
                    WebName: [
                        { required: true, message: '请输入项目名', trigger: 'blur' }
                    ],
                    Url: [
                        { required: true, message: '请输入链接', trigger: 'blur' }
                    ],
                },

                //编辑界面数据
                editForm: {
                    Id: 0,
                    WebName: '',
                    Url: '',
                    SleepTime: 5
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,

                //新增界面数据
                addForm: {
                    Id: 0,
                    WebName: '',
                    Url: '',
                    SleepTime: 5
                }

            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.paging.page = val;
            },
            //获取数据
            getData(){
                this.$axios.get('/api/ccsu/http_monitor/url_get').then((res) => {
                    switch (res.data.status){
                        case 7000:
                            let { record } = res.data;
                            this.tableData = record;
                            this.paging.total = record.length;
                            if (this.webName.length === 0){
                                loadName(this.webName,this.tableData);
                            }
                            break;
                        case 7001:
                            let { errMessage } = res.data;
                            this.$message.error(errMessage);
                            break;
                        case 7002:
                            this.$message.error('未登录');
                            this.$router.push({ path: '/login' });
                            break;
                        case 7003:
                            this.$message.error('session过期');
                            this.$router.push({ path: '/login' });
                            break;
                    }
                });
            },
            search(){
                if (this.select.WebName === '' && this.select.Url === '') {
                    this.getData();
                }else {
                    this.is_search = true;
                    this.querySearch();
                }
            },
            //查询
            querySearch() {
                if (this.is_search){
                    let para = Object.assign({}, this.select);
                    this.$axios.post('/api/ccsu/http_monitor/url_query', para).then((res) => {
                        switch (res.data.status) {
                            case 7000:
                                this.tableData = res.data.record;
                                this.paging.total = res.data.record.length;
                                break;
                            case 7002:
                                this.$message.error('未登录');
                                this.$router.push({ path: '/login' });
                                break;
                            case 7003:
                                this.$message.error('session过期');
                                this.$router.push({ path: '/login' });
                                break;
                        }
                    });
                }
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm = {
                    WebName: '',
                    SleepTime: 5,
                    Url: '',
                };
            },
            //删除
            handleDelete(index, row) {
                this.editForm = Object.assign({}, row);
                this.urls[0] = this.editForm.Url;
                this.$confirm('是否确认删除？', '提示', {}).then(() => {
                    this.$axios.post('/api/ccsu/http_monitor/url_delete', this.urls).then((res) => {
                        switch (res.data.status) {
                            case 7000:
                                this.$message.success('删除成功!');
                                break;
                            case 7001:
                                let { errMessage } = res.data;
                                this.$message.error(errMessage);
                                break;
                            case 7002:
                                this.$message.error('未登录');
                                this.$router.push({path: '/login'});
                                break;
                            case 7003:
                                this.$message.error('session过期');
                                this.$router.push({path: '/login'});
                                break;
                        }
                        this.getData();
                    });
                }).catch(() => {})

            },
            //编辑
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            this.$axios.post('/api/ccsu/http_monitor/url_update' , para).then((res) => {
                                this.editLoading = false;
                                switch (res.data.status){
                                    case 7000:
                                        this.$message.success('修改成功');
                                        break;
                                    case 7001:
                                        let { errMessage } = res.data;
                                        this.$message.error('修改失败');
                                        break;
                                    case 7002:
                                        this.$message.error('未登录');
                                        this.$router.push({ path: '/login' });
                                        break;
                                    case 7003:
                                        this.$message.error('session过期');
                                        this.$router.push({ path: '/login' });
                                        break;
                                }
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getData();
                            });
                        }).catch(() => {});
                    }
                });
            },
            //新增
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        this.$axios.post('/api/ccsu/http_monitor/url_add',para).then((res) => {
                            this.addLoading = false;
                            let data = res.data;
                            switch (data.status){
                                case 4001 :
                                    this.$message.error('参数不完全');
                                    break;
                                case 7000 :
                                    this.$message.success('添加成功');
                                    break;
                                case 7001 :
                                    this.$message.error('添加失败');
                                    break;
                                case 7002:
                                    this.$message.error('您未登录！');
                                    this.$router.push({ path: '/login' });
                                    break;
                                case 7003:
                                    this.$message.error('session过期');
                                    this.$router.push({ path: '/login' });
                                    break;
                            }
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getData();
                        });
                    }
                });
            },
            //批量删除
            delAll() {
                const self = this;
                length = self.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].WebName + ' ';
                    self.urls[i] = self.multipleSelection[i].Url;
                }
                self.$axios.post('/api/ccsu/http_monitor/url_delete',self.urls).then((res) => {
                    let data = res.data;
                    switch (data.status) {
                        case 4001:
                            self.$message.error('批量删除到'+data.err+'时失败!');
                            break;
                        case 5004:
                            self.$message.success('删除了'+str);
                            break;
                        case 5005:
                            self.$message.success('删除失败');
                            break;
                        case 7002:
                            this.$message({
                                message: '您未登录！',
                                type: 'error'
                            });
                            this.$router.push({ path: '/login' });
                            break;
                    }
                });
                self.multipleSelection = [];
                self.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //返回匹配值
            query(queryString, cb) {
                var webName = this.webName;
                var results = queryString ? webName.filter(createFilter(queryString)) : webName;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
        }
    }
</script>
