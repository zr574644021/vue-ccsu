<template>
    <div class="login-wrap">
        <div class="ms-title">CCSU网页监测平台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click.native.prevent="submitForm('ruleForm')" :loading="logining">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                logining: false,
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.logining = true;
                        var loginParams = { username: self.ruleForm.username, password: self.ruleForm.password};
                        this.$axios.post('/api/ccsu/login',loginParams).then((response) =>{
                            let res = response.data;
                            switch (res.status) {
                                case 7000:
                                    localStorage.setItem('ms_username',this.ruleForm.username);
                                    self.$router.push({ path: '/index' });
                                    break;
                                case 7001:
                                    self.$message.error('此账号不存在！');
                                    self.$router.replace({ path: '/login' });
                                    self.logining = false;
                                    break;
                                case 7002:
                                    self.$message.error('密码错误！');
                                    self.$router.replace({ path: '/login' });
                                    self.logining = false;
                                    break;
                                default:
                                    self.$message.error('服务器异常');
                                    self.$router.replace({ path: '/login' });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        /*background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;*/
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
