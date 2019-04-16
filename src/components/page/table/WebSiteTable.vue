<template>
    <div class="table">
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-autocomplete v-model="select.WebName" placeholder="网站名称" class="inline-input"
                             :fetch-suggestions="query"
                             :trigger-on-focus="false"></el-autocomplete>
            <!--<el-input v-model="select.Url" placeholder="链接" class="handle-input mr10"></el-input>-->
            <el-button type="primary" icon="search" @click="handelSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="WebName" label="网站名称">
            </el-table-column>
            <el-table-column prop="Url" label="网址">
            </el-table-column>
            <el-table-column prop="Ip" label="IP">
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

        <!--表单界面-->
        <el-dialog :title="formTitle" :visible.sync="editFormVisible">
            <el-form :model="websiteForm" label-width="80px" :rules="formRules">
                <el-form-item label="网站名称" prop="WebName">
                    <el-input v-model="websiteForm.WebName" auto-complete="off" width="60" ></el-input>
                </el-form-item>
                <el-form-item label="网址" prop="Url">
                    <el-input v-model="websiteForm.Url" auto-complete="off" width="60" ></el-input>
                </el-form-item>
                <el-form-item label="IP" prop="Ip">
                    <el-input v-model="websiteForm.Ip" auto-complete="off" width="60" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { loadName,createFilter } from "../../../util/util";
    import { GetWebSiteList,AddWebSite,DeleteWebSite,UpdateWebSite } from "../../../api/api";

    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],

                webName: [],

                select: {
                    WebName: '',
                    Url: '',
                    Page: {
                        pageSize: 15,
                        page: 1
                    }
                },

                del_list: [],
                urls: [],

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                formTitle: '',
                formMethod: '',
                formVisible: false,//表单界面是否显示
                formLoading: false,

                formRules: {
                    WebName: [
                        { required: true, message: '请输入项目名', trigger: 'blur' }
                    ],
                    Url: [
                        { required: true, message: '请输入链接', trigger: 'blur' }
                    ],
                    Ip: [
                        { required: true, message: '请输入IP', trigger: 'blur' }
                    ]
                },
                //表单数据
                websiteForm: {
                    Id: 0,
                    WebName: '',
                    Url: '',
                    Ip: ''
                },
            }
        },
        statusSwitch(res){
            switch (res.status) {
                case 6000:
                    this.tableData = res.departments;
                    this.paging.total = res.count;
                    break;
                case 7000:
                    this.$message.success(res.message);
                    break;
                case 7001:
                    this.$message.error(res.message);
                    break;
                case 7002:
                    this.$message.error(res.message);
                    this.$router.push({ path: '/login' });
                    break;
                case 7003:
                    this.$message.error(res.message);
                    this.$router.push({ path: '/login' });
                    break;
            }
        },
        created(){
            this.is_search = false;
            this.select.Url = '';
            this.select.WebName = '';
            this.getData();
        },
        methods: {
            //分页
            handleCurrentChange(val){
                this.paging.page = val;
            },
            resetForm(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            getData(){
                this.select.Page = this.paging;
                GetWebSiteList(this.select).then((res) => {
                    this.statusSwitch(res);
                });
            },
            handelSearch() {
                this.select.Page.page = 1;//初始化页
                let para = Object.assign({}, this.select);
                GetWebSiteList(para).then((res) => {
                    this.statusSwitch(res);
                });
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.formVisible = true;
                this.formTitle = '编辑';
                this.formMethod = 'update';
                this.resetForm('websiteForm');
                this.$nextTick(function () {
                    this.websiteForm = Object.assign({}, row);
                });
            },
            //显示新增界面
            handleAdd() {
                this.formVisible = true;
                this.formTitle = '新增';
                this.formMethod = 'add';
                this.resetForm('websiteForm');
                this.websiteForm.Id = 0;
            },
            //表单处理
            formSubmit() {
                this.$refs.websiteForm.validate((valid) => {
                    if (valid) {
                        if (this.formMethod === 'add') {
                            this.formLoading = true;
                            let para = Object.assign({}, this.websiteForm);
                            AddWebSite(para).then((res) => {
                                this.formLoading = false;
                                this.statusSwitch(res);
                            });
                            this.formVisible = false;
                        }else {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.formLoading = true;
                                let para = Object.assign({}, this.websiteForm);
                                UpdateWebSite(para).then((res) => {
                                    this.formLoading = false;
                                    this.statusSwitch(res);
                                });
                                this.formVisible = false;
                            }).catch(() => {});
                        }
                    }
                });
            },
            //删除
            handleDelete(index, row) {
                this.serverForm = Object.assign({}, row);
                this.deletes[0] = this.serverForm;

                this.$confirm('是否确认删除？？', '提示', {}).then(() => {
                    DeleteWebSite(this.deletes).then((res) => {
                        this.statusSwitch(res);
                    });
                }).catch(() => {});
            },
            //批量删除
            delAll(){
                DeleteWebSite(this.multipleSelection).then((res) => {
                    this.statusSwitch(res);
                    this.getData();
                    this.multipleSelection = [];
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //返回匹配值
            query(queryString, cb) {
                let webName = this.webName;
                let results = queryString ? webName.filter(createFilter(queryString)) : webName;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
        }
    }
</script>
