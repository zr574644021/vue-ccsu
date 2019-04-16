export default {
    tableData : [],//存储json数据
    multipleSelection : [],//存放所选行数据
    formMethod: '',//表单编辑类型
    formVisible: false,//表单显示状态
    formLoading: false,//表单加载状态
    options: [],  //下拉框
    paging: {
        total: 0,//默认数据总数
        pageSize: 15,//每页的数据数量
        page: 1,//默认开始页面
    },
}