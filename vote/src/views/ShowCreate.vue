<!--
 * @Author: your name
 * @Date: 2019-11-18 08:39:10
 * @LastEditTime: 2019-11-18 17:27:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vote\src\views\ShowCreate.vue
 -->
<template>
	<div>
        <h3 style="text-align:center; height:60px;line-height:40px">我创建的投票</h3>
        <el-table :data="mycreate" style="width: 100%; size: small">
            <el-table-column prop="title" label="标题" width="300"></el-table-column>
            <el-table-column prop="desc" label="描述" width="400"></el-table-column>
            <el-table-column prop="deadline" label="状态" width="150" :formatter="status"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="jumpToVote(scope.row)" type="text" size="medium">查看</el-button>
                    <el-button @click.stop="deleteVote(scope.$index,scope.row)" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
	</div>
</template>

<script>
import api from '../api';

window.api = api;
export default {
	name: 'Forgot',
	data(){
		return {
            mycreate: [],
		};
	},
	methods:{
		jumpToVote(vote) {
            location.href = `/#/vote-show/${vote.id}`;
        },
        status(row,col,ceil) {
            return (ceil > Date.now()) ? "未过期" : "已过期";
        },
        async deleteVote(idx, vote) {
            this.mycreate.splice(idx,1);
            await api.post("/mycreate",{voteid: vote.id});
        }
    },
    async mounted(){
        var response = await api.get('/mycreate')
        this.mycreate.push(...response.data.mycreate);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

</style>