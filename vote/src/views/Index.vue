<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-11-30 20:10:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\HelloWorld.vue
 -->
<template>
  <div class="box">
		<el-container v-if="user">
			<el-header>
				<span style="float: left">欢迎， {{user.name}}</span>
				<div class="right">
					<el-avatar shape="circle"
						size="large"
						fit="contain" 
						:src="this.getAvatar"
					></el-avatar>
					<el-link @click="logout" style="margin-left: 15px; line-height: 35px">退出</el-link>
				</div>
			</el-header>
			<el-container>
				<el-aside width="200px">
					<router-link to="/create-vote">
						<el-button type="primary">创建投票</el-button>
					</router-link>
					<el-button type="primary" @click="myCreate">我创建的投票</el-button>
					<el-button type="primary" @click="myJoin">我参加的投票</el-button>
				</el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
		<el-container v-else>
			<el-header>
				<el-menu class="el-menu-demo" mode="horizontal">
					<el-menu-item @click="loginFormVisible = true" index="1">登录</el-menu-item>
					<el-menu-item @click="registerFormVisible = true" index="2">注册</el-menu-item>
				</el-menu>
			</el-header>
			<el-main>
				<el-dialog title="请输入登录信息" :visible.sync="loginFormVisible" width="36%">
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入用户名" v-model="loginInfo.name">
								<template slot="prepend">用户名：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入密码" v-model="loginInfo.password" type="password">
								<template slot="prepend">密码：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入验证码" v-model="loginInfo.captcha">
								<template slot="prepend">验证码：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12"><img :src="captchaUrl" @click="updateCaptcha" /></el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<router-link to="/forgot">
								<el-link target="_blank">
									忘记密码
								</el-link>
							</router-link>
						</el-col>
					</el-row>
					<el-button @click="login" type="primary" style="width: 50%">登录</el-button>
				</el-dialog>
				<el-dialog  title="请输入注册信息" :visible.sync="registerFormVisible" width="36%" >
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入用户名" v-model="registerInfo.name">
								<template slot="prepend">用户名：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入邮箱" v-model="registerInfo.email">
								<template slot="prepend">邮箱：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-input placeholder="请输入密码" v-model="registerInfo.password" type="password">
								<template slot="prepend">密码：</template>
							</el-input>
						</el-col>
					</el-row>
					<el-row style="padding: 8px 3px">
						<el-col :span="5">
							请选择头像：
						</el-col>
						<el-col :span="19">
							<input type="file" @change="getFile($event)"/>
						</el-col>
					</el-row>
					<el-button @click="register($event)" type="primary" style="width: 50%">注册</el-button>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>


<script>
import api from '../api';
import baseURL from '../baseURL'
window.api = api;
export default {
	name: 'Profile',
	async mounted(){
		try {
			var response = await api.get('/userinfo');
			this.user = response.data;
		} catch(e) {
			// this.$router.push('/login')
		}
	},
	data(){
		return {
			user: null,
			captchaUrl: baseURL + "captcha?" + Date.now(),
			loginInfo: {
				name: "",
				password: "",
				captcha: "",
			},
			registerInfo: {
				name: "",
				email: "",
				password: "",
				avatar: "",
			},
			loginFormVisible: false,
            registerFormVisible: false
		}
	},
	computed: {
		getAvatar() {
			return baseURL + this.user.avatar;
		},
	},
	methods: {
		async logout(){
			await api.get('/logout');
			this.user = null;
		},
		myCreate(){
			location.href = "/#/create";
		},
		myJoin(){
			location.href = "/#/join";
		},
		async login(){
			this.loginFormVisible = false;
			var request = await api.post('/login', this.loginInfo);
			var data = request.data;
			if(data.code == 1){
				location.href = '/';
			}else if(data.code == 0){
				alert('验证码错误！');
			}else if(data.code == -1){
				alert('用户名或密码错误！');
			}
		},
		updateCaptcha(){
			this.captchaUrl = baseURL + "captcha?" + Date.now();
		},
		getFile(event){
			this.registerInfo.avatar = event.target.files[0];
		},
		async register(event){
			this.registerFormVisible = false
			try{
				event.preventDefault();
				let formData = new FormData();
				formData.append('name', this.registerInfo.name);
				formData.append('email', this.registerInfo.email);
				formData.append('password', this.registerInfo.password);
				formData.append('avatar', this.registerInfo.avatar);
				await api.post('/register', formData);
				this.$router.push("/");
			}catch(e){
				alert(e.response.data.msg);
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
	html,
	body,
	#app,
	.box,
	.el-container
		padding 0
		margin 0
		height 100%
	.right
		float right
	.el-header
		background-color #B3C0D1
		color #333
		text-align center
		line-height 80px
	.el-aside
		background-color #D3DCE6
		color #333
		text-align center
		line-height 175px
	.el-main
		background-color #E9EEF3
		color #333
		text-align center
		line-height 28px
	.el-row 
		margin-bottom: 15px
	&:last-child 
		margin-bottom: 0
	.el-col 
		border-radius: 4px
	
</style>
