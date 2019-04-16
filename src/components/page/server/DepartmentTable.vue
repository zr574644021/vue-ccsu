<template>

    <div class="table">
        <el-card style="width: 50%">
        <div class="handle-box">
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="Name" label="责任部门">
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
        </el-card>
        <!--编辑界面-->
        <el-dialog :visible.sync="editFormVisible" width="30%">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                    <el-form-item label="责任部门" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="新部门名" prop="newName">
                    <el-input v-model="editForm.newName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog :visible.sync="addFormVisible" width="30%">
            <el-form :model="depForm" label-width="80px" :rules="addFormRules" ref="depForm">
                <el-form-item label="责任部门" prop="Name">
                    <el-input v-model="depForm.Name" auto-complete="off"></el-input>
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
    import { GetDepList,DeleteDepartment,AddDepartment,UpdateDepartment } from '../../../api/api'

    export default {
        data() {
            return {
                tableData: [],//存储json数据
                multipleSelection: [],

                names: [],//存储删除数据

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                depForm: {
                    Id: 0,
                    Name: ''
                },

                editForm: {
                    Id: 0,
                    Name: '',
                    newName: ''
                },

                editFormVisible: false,//编辑界面是否显示
                addFormVisible: false,//新增界面是否显示
                editLoading: false,
                addLoading: false,
                addFormRules: {
                    Name: [
                        { required: true, message: '请输入责任部门', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            this.getData();
        },
        methods: {
            handleCurrentChange(val){
                this.paging.page = val;
                this.getData();
            },
            statusSwitch(res){
                switch (res.status) {
                    case 6000:
                        this.tableData = res.departments;
                        this.paging.total = res.count;
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
                let para = this.paging;
                GetDepList(para).then((res) => {
                    this.statusSwitch(res);
                });
            },
            resetForm(formName) {
                this.$nextTick(()=>{
                    this.$refs[formName].resetFields();
                })
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.resetForm('editForm');
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.resetForm('depForm');
            },
            //删除
            handleDelete(index, row) {
                let para = Object.assign({}, row);
                this.$confirm('是否确定删除？', '提示', {}).then(() => {
                    DeleteDepartment(para).then((res) => {
                        this.statusSwitch(res);
                    });
                }).catch(() => {});
                this.getData();
            },
            //编辑
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let newDepartment = Object.assign({}, this.editForm);
                            if (newDepartment.newName === ''){
                                this.editFormVisible = false;
                                return
                            }
                            UpdateDepartment(newDepartment).then((res) => {
                                this.editLoading = false;
                                this.statusSwitch(res);
                                this.editFormVisible = false;
                                this.getData();
                            });
                        }).catch(() => {});
                    }
                });
            },
            //新增
            addSubmit() {
                this.$refs.depForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        let para = Object.assign({}, this.depForm);
                        AddDepartment(para).then((res) => {
                            this.addLoading = false;
                            this.statusSwitch(res);
                            this.getData();
                            this.addFormVisible = false;
                        });
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
