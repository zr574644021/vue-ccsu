<template>
    <div class="table">
        <div class="handle-box">
            <el-select v-model="select.Carrier" clearable placeholder="运营商">
                <el-option
                        v-for="item in carrierOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select.Address" placeholder="地址" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <el-table :data="tableData.slice((paging.page-1)*paging.pageSize,paging.page*paging.pageSize)" border style="width: 50%" @selection-change="handleSelectionChange">
            <el-table-column prop="Id" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="Carrier" label="运营商" width="120">
            </el-table-column>
            <el-table-column prop="Address" label="地址" width="120">
            </el-table-column>
            <el-table-column prop="DnsIp" label="IP" width="140">
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

        <div class="pagination" style="width: 55%">
            <el-pagination
                @current-change ="handleCurrentChange"
                layout="total, prev, pager, next"
                :total="paging.total"
                :page-size="paging.pageSize"
                >
            </el-pagination>
        </div>

        <!--表单界面-->
        <el-dialog title="编辑" :visible.sync="formVisible" width="20%">
            <el-form :model="webSiteForm" label-width="80px" ref="webSiteForm">
                <el-form-item label="运营商" prop="Carrier">
                    <el-select v-model="webSiteForm.Carrier" clearable placeholder="运营商">
                        <el-option
                                v-for="item in carrierOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="Address">
                    <el-input v-model="webSiteForm.Address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="DnsIp" prop="DnsIp">
                    <el-input v-model="webSiteForm.DnsIp" auto-complete="off" ></el-input>
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
    import { GetCarrierList,UpdateCarrie,DeleteCarrie,AddCarrie } from "../../../api/api";

    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                carrierOptions: [{
                    value: '电信',
                    label: '电信'
                },{
                    value: '联通',
                    label: '联通'
                },{
                    value: '移动',
                    label: '移动'
                },{
                    value: '教育网',
                    label: '教育网'
                }],

                select: {
                    Carrier: '',
                    Address: '',
                },

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                //编辑界面数据
                webSiteForm: {
                    Id: 0,
                    Carrier: '',
                    Address: '',
                    DnsIp: ''
                },

                formTitle: '',
                formMethod: '',
                formVisible: false,//编辑界面是否显示
                formLoading: false,
            }
        },
        created(){
           this.getData();
        },
        methods: {
            //分页
            handleCurrentChange(val) {
                this.paging.page = val;
            },
            statusSwitch(res) {
                switch (res.status) {
                    case 6000:
                        this.tableData = res.carriers;
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
            resetForm(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            getData(){
                GetCarrierList(this.select).then((res) => {
                    this.statusSwitch(res);
                });
            },
            handleSearch() {
                let para = Object.assign({}, this.select);
                GetCarrierList(para).then((res) => {
                    this.statusSwitch(res);
                });
            },
            handleDelete(index, row) {
                let para = Object.assign({}, row);
                this.$confirm('是否确定删除？', '提示', {}).then(() => {
                    DeleteCarrie(para).then((res) => {
                        this.statusSwitch(res);
                        this.getData();
                    });
                }).catch(() => {});
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.formVisible = true;
                this.formTitle = '编辑';
                this.formMethod = 'update';
                this.resetForm('webSiteForm');
                this.$nextTick(function () {
                    this.webSiteForm = Object.assign({}, row);
                });
            },
            //显示新增界面
            handleAdd() {
                this.formVisible = true;
                this.formTitle = '新增';
                this.formMethod = 'add';
                this.resetForm('webSiteForm');
                this.webSiteForm.Id = 0;
            },
            //表单操作
            formSubmit() {
                this.$refs.webSiteForm.validate((valid) => {
                    if (valid) {
                        if (this.formMethod === 'add') {
                            this.formLoading = true;
                            let para = Object.assign({}, this.webSiteForm);
                            AddCarrie(para).then((res) => {
                                this.formLoading = false;
                                this.statusSwitch(res);
                            });
                            this.formVisible = false;
                        }else {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.formLoading = true;
                                let para = Object.assign({}, this.webSiteForm);
                                UpdateCarrie(para).then((res) => {
                                    this.formLoading = false;
                                    this.statusSwitch(res);
                                });
                                this.formVisible = false;
                            }).catch(() => {});
                        }
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
