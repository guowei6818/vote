<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-11-18 16:34:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\HelloWorld.vue
 -->
<template>
	<div style="width: 500px">
		<el-row>
			<el-col :span="24">
				<el-input placeholder="请输入您的邮箱：" v-model="email">
					<template slot="prepend">邮箱：</template>
				</el-input>
			</el-col>
		</el-row>
		<el-button type="primary" @click="comfile">确定</el-button>
	</div>
</template>

<script>
import api from '../api';

window.api = api;
export default {
	name: 'Forgot',
	data(){
		return {
			email: "",
		};
	},
	methods:{
		async comfile(){
			var response = await api.post('/forgot', {email: this.email});
			alert(response.data.msg);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-row 
	margin-bottom: 20px
.el-col 
	border-radius: 4px
</style>
