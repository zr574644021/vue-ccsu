<template>
    <div class="table">
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-select v-model="select.Area" clearable placeholder="请选择区域">
                <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="select.DepName" clearable placeholder="请选择责任部门">
                <el-option
                    v-for="item in depOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select.MaName" placeholder="管理员" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" @click="exportAllTable" :loading="exportLoading">全部导出</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="Name" label="服务器名">
            </el-table-column>
            <el-table-column prop="Area" label="区域">
            </el-table-column>
            <el-table-column prop="HardPosition" label="物理位置">
            </el-table-column>
            <el-table-column prop="HardWare" label="硬件环境">
            </el-table-column>
            <el-table-column prop="Manager.Dep.Name" label="数据责任部门">
            </el-table-column>
            <el-table-column prop="Manager.Name" label="服务器管理员">
            </el-table-column>
            <el-table-column prop="Manager.PhoneNumber" label="联系电话">
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
        <br>
        <el-button type="primary" @click="exportTable()" size="small" style="margin-top: 4px ;display: inline-block">导出Excel</el-button>

        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                layout="total, prev, pager, next"
                :total="paging.total"
                :page-size="paging.pageSize">
            </el-pagination>
        </div>

        <!--表单界面-->
        <el-dialog :title="formTitle" :visible.sync="formVisible">
            <el-form :model="serverForm" label-width="80px" :rules="formRules" ref="serverForm">
                <el-form-item label="服务器名" prop="Name">
                    <el-input v-model="serverForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="区域" prop="Area">
                    <el-select v-model="serverForm.Area" clearable placeholder="请选择区域">
                        <el-option
                                v-for="item in areaOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物理位置" prop="HardPosition">
                    <el-input v-model="serverForm.HardPosition" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="硬件环境" prop="HardWare">
                    <el-input v-model="serverForm.HardWare" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="责任部门" prop="Manager.Dep.Id">
                <el-select v-model="serverForm.Manager.Dep.Id" filerable placeholder="请选择责任部门" @change="getManagerList">
                    <el-option
                        v-for="item in depOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="管理员" prop="Manager.Name">
                    <el-select v-model="serverForm.Manager.Id" filerable placeholder="请选择管理员" @change="getPhone">
                        <el-option
                                v-for="item in manOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系电话" prop="Manager.PhoneNumber">
                    <el-input v-model="serverForm.Manager.PhoneNumber" style="width: 35%" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible=false">取消</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { GetServerList,AddServer,DeleteServer,UpdateServer,GetDepList,GetManagerList } from '../../../api/api';

    export default {
        data() {
            return {
                tableData: [],//存储json数据
                multipleSelection: [],
                exportLoading: false,

                select: {
                    Area: '',
                    MaName: '',
                    DepName: '',
                    Page: {
                        pageSize: 15,
                        page: 1
                    }
                },
                DepId: {
                    DepId: ''
                },

                depOptions: [],
                manOptions: [],
                managerOptions: [],
                areaOptions: [
                    {
                        value : 'A',
                        label : 'A'
                    },
                    {
                        value : 'B',
                        label : 'B'
                    },
                    {
                        value : 'C',
                        label : 'C'
                    },
                    {
                        value : 'D',
                        label : 'D'
                    },
                ],

                deletes: [],//存储删除数据

                paging: {
                    total: 0,//默认数据总数
                    pageSize: 15,//每页的数据数量
                    page: 1,//默认开始页面
                },

                serverForm: {
                    Id: 0,
                    Name: '',
                    Area: '',
                    HardPosition: '',
                    HardWare: '',
                    Manager: {
                        Id: '',
                        Name: '',
                        PhoneNumber: '',
                        Dep: {
                            Id: '',
                            Name: ''
                        }
                    }
                },

                formTitle: '',
                formMethod: '',
                formVisible: false,//表单界面是否显示
                formLoading: false,

                formRules: {
                    Name: [ { required: true, message: '请输入服务器名称', trigger: 'blur' } ],
                    Area: [ { required: true, message: '请输入区域位置', trigger: 'blur' } ],
                    HardPosition: [ { required: true, message: '请输入物理位置', trigger: 'blur' } ],
                    PhoneNumber: [ { required: true, message: '请输入管理员电话', trigger: 'blur' } ]
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
            statusSwitch(res) {
                switch (res.status) {
                    case 6000:
                        this.tableData = res.servers;
                        this.paging.total = res.count;
                        if (this.depOptions.length === 0){
                            GetDepList().then((dep) => {
                                switch (dep.status) {
                                    case 6000:
                                        for (let i=0;i<dep.count;i++){
                                            this.depOptions.push({
                                                "value": dep.departments[i].Id,
                                                "label": dep.departments[i].Name
                                            });
                                        }
                                        break;
                                    default :
                                        this.statusSwitch(dep);
                                        break;
                                }
                            });
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
                GetServerList(this.select).then((res) => {
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
                this.formTitle = '编辑';
                this.formMethod = 'update';
                this.resetForm('serverForm');
                this.$nextTick(function () {
                    this.serverForm = Object.assign({}, row);
                });
                this.getManagerList();
            },
            //显示新增界面
            handleAdd() {
                this.formVisible = true;
                this.formTitle = '新增';
                this.formMethod = 'add';
                this.resetForm('serverForm');
                this.serverForm.Id = 0;
                this.serverForm.Manager.Dep.Name = '';
            },
            //查询
            handleSearch() {
                this.select.Page.page = 1;//初始化页
                let para = Object.assign({}, this.select);
                GetServerList(para).then((res) => {
                    this.statusSwitch(res);
                });
            },
            //删除
            handleDelete(index, row) {
                this.serverForm = Object.assign({}, row);
                this.deletes[0] = this.serverForm;

                this.$confirm('是否确认删除？？', '提示', {}).then(() => {
                    DeleteServer(this.deletes).then((res) => {
                        this.statusSwitch(res);
                    });
                }).catch(() => {});
            },
            getManagerList() {
                this.manOptions = [];
                this.serverForm.Manager.Id = '';
                this.serverForm.Manager.PhoneNumber = '';
                this.DepId.DepId = this.serverForm.Manager.Dep.Id;
                GetManagerList(this.DepId).then((manager) => {
                    switch (manager.status) {
                        case 6000:
                            for (let i=0;i<manager.count;i++){
                                this.manOptions.push({
                                    "value": manager.managers[i].Id,
                                    "label": manager.managers[i].Name,
                                    "phone": manager.managers[i].PhoneNumber
                                });
                            }
                            break;
                        default :
                            this.statusSwitch(manager);
                            break;
                    }
                });
            },
            getPhone() {
                let id = this.serverForm.Manager.Id;
                for (let i = 0; i<this.manOptions.length; i++) {
                    if (this.manOptions[i].value === id){
                        this.serverForm.Manager.PhoneNumber = this.manOptions[i].phone;
                    }
                }
            },
            //表单操作
            formSubmit() {
                this.$refs.serverForm.validate((valid) => {
                    if (valid) {
                        if (this.formMethod === 'add') {
                            this.formLoading = true;
                            let para = Object.assign({}, this.serverForm);
                            //para = this.getDepDownList(para);
                            AddServer(para).then((res) => {
                                this.formLoading = false;
                                this.statusSwitch(res);
                            });
                            this.formVisible = false;
                        }else {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.formLoading = true;
                                let para = Object.assign({}, this.serverForm);
                                //para = this.getDepDownList(para);
                                UpdateServer(para).then((res) => {
                                    this.formLoading = false;
                                    this.statusSwitch(res);
                                });
                                this.formVisible = false;
                            }).catch(() => {});
                        }
                    }
                });
            },
            //批量删除
            delAll(){
                DeleteServer(this.multipleSelection).then((res) => {
                    this.statusSwitch(res);
                });
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            exportAllTable() {
                this.exportLoading = true;
                require.ensure([], () => {
                    this.exportLoading = false;
                    const { export_json_to_excel } = require('../../../vendor/Export2Excel');
                    const tHeader = ['ID', '服务器名', '区域', '物理位置', '硬件环境','责任部门','管理员','联系电话'];
                    const filterVal = ['Id', 'Name', 'Area', 'HardPosition', 'HardWare','Dp_Name','Manager_Name','Manager_PhoneNumber'];
                    const list = this.transfer(this.tableData);
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '机房服务器清单');
                })
            },
            exportTable() {
                this.$confirm('是否导出所选的'+this.multipleSelection.length+'条数据?', '提示', {}).then(() => {
                    require.ensure([], () => {
                        const {export_json_to_excel} = require('../../../vendor/Export2Excel');
                        const tHeader = ['ID', '服务器名', '区域', '物理位置', '硬件环境', '责任部门', '管理员', '联系电话'];
                        const filterVal = ['Id', 'Name', 'Area', 'HardPosition', 'HardWare', 'Dp_Name', 'Manager_Name', 'Manager_PhoneNumber'];
                        const list = this.transfer(this.multipleSelection);
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, '机房服务器清单');
                    })
                })
            },
            transfer(tableData) {
              let buffData = [];
              for (let i=0; i<tableData.length; i++){
                    buffData.push({
                        "Id": i,
                        "Name": tableData[i].Name,
                        "Area": tableData[i].Area,
                        "HardPosition": tableData[i].HardPosition,
                        "HardWare": tableData[i].HardWare,
                        "Dp_Name": tableData[i].Manager.Dp.Name,
                        "Manager_Name": tableData[i].Manager.Name,
                        "Manager_PhoneNumber": tableData[i].Manager.PhoneNumber
                    })
              }
              return buffData;
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>
