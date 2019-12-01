<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-11-30 16:04:21
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
				<div class="right">
					<router-link to="/login" style="margin-right: 8px">登录</router-link>
					<router-link to="/register">注册</router-link>
				</div>
			</el-header>
			<el-main>
				<router-view></router-view>
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
		};
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
		}
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
</style>
