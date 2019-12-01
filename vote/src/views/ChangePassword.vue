<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-11-18 17:26:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\HelloWorld.vue
 -->
<template>
	<div style="width:500px;">
		<h2>请重置您的密码</h2>
		<el-row>
			<el-col :span="24">
				<el-input placeholder="请输入您的密码：" v-model="password" type="password">
					<template slot="prepend">新密码：</template>
				</el-input>
			</el-col>
		</el-row>
		<el-button type="primary" @click="confirm">确认</el-button>
	</div>
</template>

<script>
// import baseURL from '../baseURL';
import api from '../api';

window.api = api;
export default {
	name: 'ChangePassword',
	data(){
		return {
			password: "",
		};
	},
	async mounted(){
		this.init();
	},
	methods: {
		async init(){
			var token = this.$route.params.token;
			await api.get('/change-password/' + token)
		},
		async confirm(){
			var token = this.$route.params.token;
			var response = await api.post('/change-password/' + token, {password: this.password});
			if(response.data.code == 0){
				this.$router.push("/");
			}else{
				alert(response.data.msg);
			}
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-row 
	margin-bottom: 20px
.el-col 
	border-radius: 4px
</style>
