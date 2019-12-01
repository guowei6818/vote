<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-11-30 20:16:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\HelloWorld.vue
 -->
<template>
	<div id="create">
		<h3 style="text-align: center">创建投票</h3>
		<el-form label-width="90px" size="medium">
			<el-form-item label="标题："><el-input v-model='voteInfo.title'></el-input></el-form-item>
			<el-form-item label="描述："><el-input v-model='voteInfo.desc'></el-input></el-form-item>
			<el-button 
				@click="voteInfo.options.push('')"
				size="small"
				style="width: 510px;margin: 0px 0px 20px 90px"
				type="info"
			>添加选项</el-button>
			<el-form-item label="选项内容: " v-for="(option, idx) of voteInfo.options" :key="idx" size="small">
				<el-input type="text" 
					v-model="voteInfo.options[idx]" 
					:placeholder="'选项' + (idx + 1)"
				>
					<el-button slot="append" @click="voteInfo.options.splice(idx, 1)">-</el-button>
				</el-input>
			</el-form-item>
			<el-form-item label="截止时间：" size="small">
				<el-date-picker type="date" placeholder="选择日期" v-model="voteInfo.deadline" size="small"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否匿名：">
				<el-radio-group v-model="voteInfo.anonymouse">
					<el-radio label="0">实名</el-radio>
					<el-radio label="1">匿名</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="投票方式">
				<el-select v-model="voteInfo.singleSelection" placeholder="单选或多选">
					<el-option label="单选" value="1"></el-option>
					<el-option label="多选" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-button style="width: 40%" type="primary" @click="submit">创建投票</el-button>
		</el-form>
	</div>
</template>


<script>
import api from '../api'
window.api = api;
export default {
	name: 'CreateVote',
	data() {
		return {
			voteInfo: {
				title: '',
				desc: '',
				options: ["", ""],
				deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
				anonymouse: "0",
				singleSelection: '1',
			},
		};
	},
	methods: {
		async submit() {
			let request = await api.post('/vote', this.voteInfo);
			let data = request.data;
			this.$router.push('/vote-show/' + data.id);
		},
	},
	rules: {
		title: [{ 
			required: true,
			message: '请输入投票名称',
			trigger: 'blur' 
		}],
		desc: [{
			required: true,
			message: '描述',
			trigger: 'change'
		}],
		deadline: [{
			type: 'date',
			required: true,
			message: '请选择日期',
			trigger: 'change' 
		}],
		anonymouse: [{
			type: 'array',
			required: true,
			message: '是否匿名',
			trigger: 'change'
		}],
		singleSelection: [{
			required: true,
			message: '单选或多选',
			trigger: 'change'
		}],
		options: [{
			required: true,
			message: '请输入选项',
			trigger: 'blur'
		}]
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
#create
	width 600px
	padding 15px
	margin 20px auto
	border-radius 4px
	border 1px solid #bfcbd9
</style>
