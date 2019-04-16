<template>
    <div class="table">
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-input v-model="select.Name" placeholder="姓名" class="handle-input mr10"></el-input>
            <el-select v-model="select.DepId" clearable placeholder="请选择责任部门">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="ID" :index="indexMethod" width="60">
            </el-table-column>
            <el-table-column prop="Name" label="姓名">
            </el-table-column>
            <el-table-column prop="Dep.Name" label="责任部门">
            </el-table-column>
            <el-table-column prop="PhoneNumber" label="电话">
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
        <el-dialog :title="formTitle" :visible.sync="formVisible" width="30%">
            <el-form :model="managerForm" label-width="80px" :rules="formRules" ref="managerForm">
                <el-form-item label="姓名" prop="Name">
                    <el-input v-model="managerForm.Name" auto-complete="off" style="width: 160px"></el-input>
                </el-form-item>
                <el-form-item label="责任部门" prop="options">
                <el-select v-model="managerForm.Dp.Id" placeholder="请选择责任部门">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="PhoneNumber">
                    <el-input v-model="managerForm.PhoneNumber" auto-complete="off" style="width: 218px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { GetManagerList,AddManager,DeleteManager,UpdateManager,GetDepList } from '../../../api/api'

    export default {
        data() {

            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };

            return {
                tableData: [],//存储json数据
                multipleSelection: [],

                select: {
                    Name: '',
                    DepId: '',
                    Page: {
                        pageSize: 15,
                        page: 1
                    }
                },

                options: [],

                deletes: [],//存储删除数据

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                managerForm: {
                    Id: 0,
                    Name: '',
                    Dp: {
                        Id: 0,
                        Name: '',
                    },
                    PhoneNumber: ''
                },

                formTitle: '',
                formMethod: '',
                formVisible: false,
                formLoading: false,

                formRules: {
                    Name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    PhoneNumber: [
                        { required: true, validator: checkPhone, trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            this.getData();
            this.options = [];
        },
        methods: {
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val){
                this.paging.page = val;
                this.getData();
            },
            statusSwitch(res){
                switch (res.status) {
                    case 6000:
                        this.tableData = res.managers;
                        this.paging.total = res.count;
                        console.log(this.tableData);
                        if (this.options.length === 0){
                            this.managerList();
                        }
                        break;
                    case 7000:
                        this.$message.success(res.message);
                        this.getData();
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
            //获取数据
            getData(){
                this.select.Page = this.paging;
                GetManagerList(this.select).then((res) => {
                    this.statusSwitch(res);
                });
            },
            handleSearch() {
                this.select.Page.page = 1;//初始化页
                let para = Object.assign({}, this.select);
                GetManagerList(para).then((res) => {
                    this.statusSwitch(res);
                });
            },
            resetForm(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.formVisible = true;
                this.formMethod = 'update';
                this.formTitle = '编辑';
                this.resetForm('managerForm');
                this.$nextTick(function () {
                    this.managerForm = Object.assign({}, row);
                });
            },
            //显示新增界面
            handleAdd() {
                this.formVisible = true;
                this.formMethod = 'add';
                this.formTitle = '新增';
                this.resetForm('managerForm');
                this.managerForm.Id = 0;
                this.managerForm.Dp = {Id: '', Name: ''};
            },
            //删除
            handleDelete(index, row) {
                this.deletes[0] = Object.assign({}, row);
                this.$confirm('是否确认删除？', '提示', {}).then(() => {
                    DeleteManager(this.deletes).then((res) => {
                        this.statusSwitch(res);
                        this.getData();
                        this.deletes = [];
                    });
                }).catch(() => {});
            },
            //表单操作
            formSubmit() {
                this.$refs.managerForm.validate((valid) => {
                    if (valid) {
                        if (this.formMethod === 'add'){
                            this.formLoading = true;
                            let para = Object.assign({}, this.managerForm);
                            AddManager(para).then((res) => {
                                this.formLoading = false;
                                this.statusSwitch(res);
                                this.getData();
                            });
                            this.$refs['managerForm'].resetFields();
                            this.formVisible = false;
                        }else {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.formVisible = true;
                                let para = Object.assign({}, this.managerForm);
                                UpdateManager(para).then((res) => {
                                    this.formLoading = false;
                                    this.statusSwitch(res);
                                });
                                this.$refs['managerForm'].resetFields();
                                this.formVisible = false;
                            }).catch(() => {});
                        }
                    }
                });
            },
            //批量删除
            delAll(){
                DeleteManager(this.multipleSelection).then((res) => {
                   this.statusSwitch(res);
                    this.getData();
                    this.multipleSelection = [];
                });
            },
            managerList(){
                GetDepList().then((res) => {
                    if (res.status === 6000){
                        for (let i = 0; i < res.count; i++) {
                            this.options.push({
                                "value": res.departments[i].Id,
                                "label": res.departments[i].Name
                            });
                        }
                    }else {
                        this.statusSwitch(res);
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
